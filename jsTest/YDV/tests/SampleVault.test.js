import {
  ydv,
  send,
  call,
  balanceOf,
  totalSupply,
  mint,
  deposit,
  withdraw
} from "../YDV.js"
import {
  etherMantissa
} from "../lib/Helpers.js"

const mintAmount = etherMantissa(10e4);
const depositAmount = etherMantissa(10e3);
const interestAmount = etherMantissa(2e2);

import {
  plus,
  minus,
} from "../lib/Helpers.js"

describe("Sample Vault", () => {
  let snapshotId;
  let deployer;
  let user;
  let user2;
  
  beforeAll(async () => {
    await ydv.testing.resetEVM("0x2");
    const accounts = await ydv.web3.eth.getAccounts();
    ydv.addAccount(accounts[0]);
    deployer = accounts[0];
    user = accounts[1];
    user2 = accounts[2];
    snapshotId = await ydv.testing.snapshot();
  });

  beforeEach(async () => {
    await ydv.testing.resetEVM("0x2");
    await mint("st", user, mintAmount, deployer);
    await mint("st", user2, depositAmount, deployer);
    await mint("st", user2, depositAmount, deployer);
    await mint("st", user2, interestAmount, deployer);
  });

  describe('Sample Vault', () => {
    test('sample vault setup', async () => {
      expect(await call("sv", "name")).toBe('sample vault sample token');
      expect(await call("sv", "symbol")).toBe('svSTKN');
      expect(await balanceOf("sv", user)).toBe("0");
      expect(await balanceOf("st", user)).toBe(mintAmount);
    });

    test("deposit sample token", async () => {
      await deposit("sv", "st", depositAmount, user2);

      expect(await balanceOf("sv", user2)).toBe(depositAmount);
      expect(await call("sv", "balance")).toBe(depositAmount);
    });

    test("deposit sample token and simulate interest", async () => {
      await deposit("sv", "st", depositAmount, user2);

      // simulate earning in sv
      await mint("st", ydv.contracts.sv.options.address, interestAmount, deployer);
      expect(await call("sv", "balance")).toBe(plus(depositAmount, interestAmount));

      await deposit("sv", "st", depositAmount, user2);
      
      expect(await ydv.contracts.sv.methods.balanceOf(user2).call()).toBe("19803921568627450980392");
    });

    test("withdraw sample token", async () => {
      await deposit("sv", "st", depositAmount, user2);
      
      let _before = await balanceOf("st", user2);

      await withdraw("sv", depositAmount, user2);

      let _after = await balanceOf("st", user2);
      expect(minus(_after, _before)).toBe(depositAmount);

      expect(await balanceOf("sv", user2)).toBe("0");
      expect(await call("sv", "balance")).toBe("0");
    });

    test("withdraw sample token after yield", async () => {
      await deposit("sv", "st", depositAmount, user2);

      // simulate earning in sv
      await mint("st", ydv.contracts.sv.options.address, interestAmount, deployer);
      expect(await call("sv", "balance")).toBe(plus(depositAmount, interestAmount));

      await deposit("sv", "st", depositAmount, user2);
      
      expect(await balanceOf("sv", user2)).toBe("19803921568627450980392");
      let svBalance = await call("sv", "balance");
      let pricePerFullShare = await call("sv", "getPricePerFullShare");
      let amount = svBalance.div(1e18).mul(svBalance);
      console.log("pricePerFullShare", pricePerFullShare)
      console.log("amount", amount)

      let _before = await balanceOf("st", user2).call();

      await withdraw("sv", depositAmount, user2);

      let _after = await balanceOf("st", user2).call();
      expect(minus(_after, _before)).toBe("10200000000000000000000");
    });
  });
})
