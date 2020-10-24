import BigNumber from 'bignumber.js'
import {
  ydv,
  send,
  call,
  balanceOf,
  mint,
  deposit,
  withdraw
} from "../YDV.js"

import {
  etherMantissa,
  plus,
  minus,
  times,
  div,
} from "../lib/Helpers.js"

const depositAmount = etherMantissa(10e3);
const interestAmount = etherMantissa(2e2);
const transferRewardAmount = etherMantissa(1e8);
const mantissa = etherMantissa(1);

describe('Sample YDV', () => {
  let snapshotId;
  let deployer;
  let user;
  let yTokenUser;
  let anotherUser;
  let escrow = process.env.TOKEN_ESCROW;
  let treasury = process.env.TREASURY;
  let newTreasury;
  
  beforeAll(async () => {
    const accounts = await ydv.web3.eth.getAccounts();
    ydv.addAccount(accounts[0]);
    deployer = accounts[0];
    user = accounts[1];
    yTokenUser = accounts[2];
    newTreasury = accounts[3];
    anotherUser = accounts[4];
    snapshotId = await ydv.testing.snapshot();
  });

  beforeEach(async () => {
    await ydv.testing.resetEVM("0x2");
    await mint("st", user, depositAmount, deployer);
    await mint("st", user, depositAmount, deployer);
    await mint("st", user, depositAmount, deployer);
    await mint("st", yTokenUser, depositAmount, deployer);
    await mint("st", yTokenUser, depositAmount, deployer);
    await mint("st", anotherUser, depositAmount, deployer);

    // send reward tokens from escrow to YDVRewardsDistributor contract
    await send("rally", "approve", [ydv.contracts.ydv_rd.options.address, transferRewardAmount], escrow);
    await send("rally", "transfer", [ydv.contracts.ydv_rd.options.address, transferRewardAmount], escrow);
  });

  test('sample ydv setup', async () => {
    expect(await call("ydv", "name")).toBe('rally delegating sample token');
    expect(await call("ydv", "symbol")).toBe('rdSTKN');
    expect(await balanceOf("rally", user)).toBe("0");
    expect(await balanceOf("rally", ydv.contracts.ydv_rd.options.address)).toBe(transferRewardAmount);
  });

  test('sample ydv config params', async () => {
    let newGlobalDepositCap = etherMantissa(10e9);
    let newIndividualDepositCap = etherMantissa(10e6);
    let newRewardPerToken = etherMantissa(7);

    await send("ydv", "setTreasury", [newTreasury], deployer);
    await send("ydv", "setGlobalDepositCap", [newGlobalDepositCap], deployer);
    await send("ydv", "setIndividualDepositCap", [newIndividualDepositCap], deployer);
    await send("ydv", "setRewardPerToken", [newRewardPerToken], deployer);

    expect(await call("ydv", "treasury")).toBe(newTreasury);
    expect(await call("ydv", "globalDepositCap")).toBe(newGlobalDepositCap);
    expect(await call("ydv", "individualDepositCap")).toBe(newIndividualDepositCap);
    expect(await call("ydv", "rewardPerToken")).toBe(newRewardPerToken);
  });

  test('sample ydv config params failed from other user', async () => {
    let newGlobalDepositCap = etherMantissa(10e9);
    let newIndividualDepositCap = etherMantissa(10e6);
    let newRewardPerToken = etherMantissa(7);

    await ydv.testing.expectThrow(send("ydv", "setTreasury", [newTreasury], user), "Ownable: caller is not the owner");
    await ydv.testing.expectThrow(send("ydv", "setGlobalDepositCap", [newGlobalDepositCap], user), "Ownable: caller is not the owner");
    await ydv.testing.expectThrow(send("ydv", "setIndividualDepositCap", [newIndividualDepositCap], user), "Ownable: caller is not the owner");
    await ydv.testing.expectThrow(send("ydv", "setRewardPerToken", [newRewardPerToken], user), "Ownable: caller is not the owner");
  });

  test("deposit sample token", async () => {
    await deposit("ydv", "st", depositAmount, user);

    expect(await balanceOf("ydv", user)).toBe(depositAmount);
    expect(await call("ydv", "balance")).toBe(depositAmount);
  });

  test("deposit ytoken", async () => {
    // prepare sample vault
    await deposit("sv", "st", depositAmount, anotherUser);

    await deposit("sv", "st", depositAmount, yTokenUser);
    expect(await balanceOf("sv", yTokenUser)).toBe(depositAmount);

    await send("sv", "approve", [user, depositAmount], yTokenUser);
    await send("sv", "transfer", [user, depositAmount], yTokenUser);

    expect(await balanceOf("sv", user)).toBe(depositAmount);
    await send("sv", "approve", [ydv.contracts.ydv.options.address, depositAmount], user);
    await send("ydv", "deposityToken", [depositAmount], user);
    expect(await balanceOf("ydv", user)).toBe(depositAmount);
  });

  test("deposit sample token and simulate interest", async () => {
    await deposit("ydv", "st", depositAmount, user);

    // simulate earning in ydv
    await mint("st", ydv.contracts.sv.options.address, interestAmount, deployer);

    await deposit("ydv", "st", depositAmount, user);
    
    expect(await balanceOf("ydv", user)).toBe("19803921568627450980392");
  });

  test("withdraw sample ytoken", async () => {
    // prepare sample vault
    await deposit("sv", "st", depositAmount, anotherUser);

    await deposit("sv", "st", depositAmount, yTokenUser);

    await send("sv", "approve", [user, depositAmount], yTokenUser);
    await send("sv", "transfer", [user, depositAmount], yTokenUser);

    await send("sv", "approve", [ydv.contracts.ydv.options.address, depositAmount], user);
    await send("ydv", "deposityToken", [depositAmount], user);

    await send("ydv", "withdrawyToken", [depositAmount], user);
    expect(await balanceOf("sv", user)).toBe(depositAmount);
  });

  test("withdraw sample token", async () => {
    await deposit("ydv", "st", depositAmount, user);
    
    let _before = await balanceOf("st", user);
    await withdraw("ydv", depositAmount, user);
    let _after = await balanceOf("st", user);
    expect(minus(_after, _before)).toBe(depositAmount);

    expect(await balanceOf("ydv", user)).toBe("0");
    expect(await call("ydv", "balance")).toBe("0");
  });

  test("withdraw sample token after yVault yield without harvest", async () => {
    expect(await balanceOf("st", ydv.contracts.ydv.options.address)).toBe("0");
    expect(await balanceOf("st", ydv.contracts.sv.options.address)).toBe("0");
    await deposit("ydv", "st", depositAmount, user);

    // simulate earning in ydv
    await mint("st", ydv.contracts.sv.options.address, interestAmount, deployer);

    await deposit("ydv", "st", depositAmount, user);

    expect(await balanceOf("ydv", user)).toBe("19803921568627450980392");
    expect(await balanceOf("sv", ydv.contracts.ydv.options.address)).toBe("19803921568627450980392");

    let _before = await balanceOf("st", user);
    await withdraw("ydv", depositAmount, user);
    await send("ydv", "withdrawAll", [], user);
    let _after = await balanceOf("st", user);

    expect(minus(_after, _before)).toBe(plus(depositAmount, plus(depositAmount, interestAmount)));
  });

  test("send treasury and transfer rewards", async () => {
    let _before, _after;
    await deposit("ydv", "st", depositAmount, user);

    // simulate earning in ydv
    await mint("st", ydv.contracts.sv.options.address, interestAmount, deployer);

    await deposit("ydv", "st", depositAmount, user);

    let treasuryAmount = "176470588235294117645";
    _before = await balanceOf("sv", ydv.contracts.ydv.options.address);
    await send("ydv", "harvest", [], user);
    _after = await balanceOf("sv", ydv.contracts.ydv.options.address);
    
    expect(await balanceOf("sv", treasury)).toBe(treasuryAmount);
    expect(_before).toBe("19803921568627450980392");
    expect(_before).toBe(plus(treasuryAmount, _after));

    let yVaultPricePerFullShare = await call("sv", "getPricePerFullShare");
    let delegatePercent = await call("ydv", "delegatePercent");
    
    expect(BigNumber(interestAmount).times(delegatePercent).div(10000).div(yVaultPricePerFullShare).dp(6).toString(10))
      .toBe(BigNumber(treasuryAmount).div(mantissa).dp(6).toString(10));
    
    let pendingReward = "88235294106666666666";
    
    expect(await call("ydv", "earned", [user])).toBe(pendingReward);
    expect(await balanceOf("rally", user)).toBe("0");

    _before = await balanceOf("st", user);
    await send("ydv", "withdrawAll", [], user);
    _after = await balanceOf("st", user);
    expect(minus(_after, _before)).toBe("20020000000000000000002");

    expect(await balanceOf("rally", user)).toBe("88235294106666666666");
  });

  test("check deposit caps", async () => {
    await(send("ydv", "setGlobalDepositCap", [BigNumber(depositAmount).times(2)], deployer));
    await(send("ydv", "setIndividualDepositCap", [depositAmount], deployer));

    expect(await balanceOf("st", user)).toBe(BigNumber(depositAmount).times(3).toString(10));
    await send("st", "approve", [ydv.contracts.ydv.options.address, BigNumber(depositAmount).times(3)], user);
    
    console.log(expect(await send("ydv", "deposit", [depositAmount], user)));
    
    expect(await send("ydv", "deposit", [depositAmount], user));
    await ydv.testing.expectThrow(send("ydv", "deposit", [depositAmount], user), "Check deposit cap failed");
    await ydv.testing.expectThrow(send("ydv", "deposit", [depositAmount], user), "Check deposit cap failed");
  });
});
