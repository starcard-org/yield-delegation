import {
  YDV, BigNumber
} from "../index.js";
import * as Types from "../lib/types.js";
import {
  addressMap
} from "../lib/constants.js";
import {
  decimalToString,
  stringToDecimal
} from "../lib/Helpers.js"


export const ydv = new YDV(
  "http://localhost:8545/",
  "1001",
  true, {
    defaultAccount: "",
    defaultConfirmations: 1,
    autoGasMultiplier: 1.5,
    testing: false,
    defaultGas: "6000000",
    defaultGasPrice: "1000000000000",
    accounts: [],
    ethereumNodeTimeout: 10000
  }
)
const oneEther = 10 ** 18;

describe("Yield Delegation Vault", () => {
  let snapshotId;
  let deployer;
  let user;
  let new_user;

  let usdc_account = "0x1ec32bfdbdbd40c0d3ec0fe420ebcfeeb2d56917";
  let yusdc_account = "0x35fA62d1A915a5A1390215e2b85aDE1cB48205c0";
  
  beforeAll(async () => {
    const accounts = await ydv.web3.eth.getAccounts();
    ydv.addAccount(accounts[0]);
    deployer = accounts[0];
    user = accounts[1];
    new_user = accounts[2];
    snapshotId = await ydv.testing.snapshot();
  });

  beforeEach(async () => {
    await ydv.testing.resetEVM("0x2");
  });

  describe('YDV USDC', () => {
    test('checking token setup', async () => {
      expect(await ydv.contracts.ydv.methods.name().call()).toBe('rally delegating USD Coin');
      expect(await ydv.contracts.ydv.methods.symbol().call()).toBe('rdUSDC');
      expect(await ydv.contracts.ydv.methods.balanceOf(user).call()).toBe("0");
      expect(await ydv.contracts.ydv.methods.totalSupply().call()).toBe("0");
      expect(await ydv.contracts.ydv.methods.totalDeposits().call()).toBe("0");
      expect(await ydv.contracts.ydv.methods.treasury().call()).toBe(deployer);
    });

    describe('deposit', () => {
      test('deposit USDC', async () => {
        expect(await ydv.contracts.usdc.methods.name().call()).toBe('USD Coin');
        expect(await ydv.contracts.usdc.methods.symbol().call()).toBe('USDC');

        await ydv.contracts.usdc.methods.transfer(user, "50000000000").send({
          from: usdc_account
        });
        expect(await ydv.contracts.usdc.methods.balanceOf(user).call()).toBe("50000000000");

        expect(await ydv.contracts.ydv.methods.balanceOf(user).call()).toBe("0");
        await ydv.contracts.usdc.methods.approve(ydv.contracts.ydv.options.address, 10000000000).send({from: user});
        await ydv.contracts.ydv.methods.deposit(
          "10000000000"
        ).send({
          from: user,
          gas: 3000000
        });
        console.log("user ydv share balance after deposit USDC:", await ydv.contracts.ydv.methods.balanceOf(user).call());
        expect(await ydv.contracts.ydv.methods.balanceOf(user).call()).not.toBe("0");
      });

      test('deposit yUSDC', async () => {
        expect(await ydv.contracts.yusdc.methods.name().call()).toBe('yearn USD//C');
        expect(await ydv.contracts.yusdc.methods.symbol().call()).toBe('yUSDC');
        await ydv.contracts.yusdc.methods.transfer(user, "100000").send({
          from: yusdc_account
        });
        expect(await ydv.contracts.yusdc.methods.balanceOf(user).call()).toBe("100000");

        expect(await ydv.contracts.ydv.methods.balanceOf(user).call()).toBe("0");
        await ydv.contracts.yusdc.methods.approve(ydv.contracts.ydv.options.address, 100000).send({from: user});
        await ydv.contracts.ydv.methods.deposityToken(
          "100000"
        ).send({
          from: user,
          gas: 3000000
        });
        console.log("user ydv share balance after deposit yUSDC:", await ydv.contracts.ydv.methods.balanceOf(user).call());
        expect(await ydv.contracts.ydv.methods.balanceOf(user).call()).not.toBe("0");
      });
    });

    describe('withdraw', () => {
      test('withdraw USDC', async () => {

        await ydv.contracts.usdc.methods.transfer(user, "50000000000").send({
          from: usdc_account
        });
        expect(await ydv.contracts.usdc.methods.balanceOf(user).call()).toBe("50000000000");

        expect(await ydv.contracts.ydv.methods.balanceOf(user).call()).toBe("0");
        await ydv.contracts.usdc.methods.approve(ydv.contracts.ydv.options.address, 10000000000).send({from: user});
        await ydv.contracts.ydv.methods.deposit(
          "10000000000"
        ).send({
          from: user,
          gas: 3000000
        });
        expect(await ydv.contracts.ydv.methods.balanceOf(user).call()).not.toBe("0");

        await ydv.contracts.ydv.methods.withdraw(
          "10000000"
        ).send({
          from: user,
          gas: 3000000
        });
        expect(await ydv.contracts.ydv.methods.balanceOf(user).call()).not.toBe("0");
        
        let usdcbal = await ydv.contracts.usdc.methods.balanceOf(user).call();
        expect(ydv.toBigN(usdcbal).toNumber()).toBeGreaterThan(40000000000);
      });

      test('withdraw yUSDC', async () => {
        expect(await ydv.contracts.yusdc.methods.name().call()).toBe('yearn USD//C');
        expect(await ydv.contracts.yusdc.methods.symbol().call()).toBe('yUSDC');
        await ydv.contracts.yusdc.methods.transfer(user, "100000").send({
          from: yusdc_account
        });
        expect(await ydv.contracts.yusdc.methods.balanceOf(user).call()).toBe("100000");

        expect(await ydv.contracts.ydv.methods.balanceOf(user).call()).toBe("0");
        await ydv.contracts.yusdc.methods.approve(ydv.contracts.ydv.options.address, 100000).send({from: user});
        await ydv.contracts.ydv.methods.deposityToken(
          "100000"
        ).send({
          from: user,
          gas: 3000000
        });
        expect(await ydv.contracts.ydv.methods.balanceOf(user).call()).not.toBe("0");

        await ydv.contracts.ydv.methods.withdrawyToken(
          "10000"
        ).send({
          from: user,
          gas: 3000000
        });

        expect(await ydv.contracts.ydv.methods.balanceOf(user).call()).not.toBe("0");
        expect(await ydv.contracts.yusdc.methods.balanceOf(user).call()).toBe("10000");
      });
    });
  });
})
