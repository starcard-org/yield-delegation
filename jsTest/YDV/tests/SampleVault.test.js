import {
  YDV, BigNumber
} from "../index.js";
import * as Types from "../lib/types.js";
import {
  addressMap
} from "../lib/constants.js";
import {
  decimalToString,
  stringToDecimal,
  plus,
  minus,
  times,
  div
} from "../lib/Helpers.js"
import * as util from "../lib/utils.js"

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
    await ydv.contracts.st.methods.mint(user, util.TOKEN_1000).send({from:deployer});
    await ydv.contracts.st.methods.mint(user2, util.TOKEN_100).send({from:deployer});
    await ydv.contracts.st.methods.mint(user2, util.TOKEN_100).send({from:deployer});
  });

  describe('Sample Vault', () => {
    test('sample vault setup', async () => {
      expect(await ydv.contracts.sv.methods.name().call()).toBe('sample vault sample token');
      expect(await ydv.contracts.sv.methods.symbol().call()).toBe('svSTKN');
      expect(await ydv.contracts.sv.methods.balanceOf(user).call()).toBe("0");
      expect(await ydv.contracts.st.methods.balanceOf(user).call()).toBe(util.TOKEN_1000);
    });

    test("deposit sample token", async () => {
      // deposit to sv
      await ydv.contracts.st.methods.approve(ydv.contracts.sv.options.address, util.TOKEN_100).send({from: user2});
      await ydv.contracts.sv.methods.deposit(
        util.TOKEN_100
      ).send({
        from: user2,
        gas: 12500000
      });

      expect(await ydv.contracts.sv.methods.balanceOf(user2).call()).toBe(util.TOKEN_100);
      expect(await ydv.contracts.sv.methods.balance().call()).toBe(util.TOKEN_100);
    });

    test("deposit sample token and simulate interest", async () => {
      // deposit to sv
      await ydv.contracts.st.methods.approve(ydv.contracts.sv.options.address, util.TOKEN_100).send({from: user2});
      await ydv.contracts.sv.methods.deposit(
        util.TOKEN_100
      ).send({
        from: user2,
        gas: 12500000
      });

      expect(await ydv.contracts.sv.methods.balanceOf(user2).call()).toBe(util.TOKEN_100);
      expect(await ydv.contracts.sv.methods.balance().call()).toBe(util.TOKEN_100);

      // simulate earning in sv
      await ydv.contracts.st.methods.mint(ydv.contracts.sv.options.address, util.TOKEN_10).send({from: deployer});
      expect(await ydv.contracts.sv.methods.balance().call()).toBe(plus(util.TOKEN_100, util.TOKEN_10));

      // deposit to sv
      await ydv.contracts.st.methods.approve(ydv.contracts.sv.options.address, util.TOKEN_100).send({from: user2});
      await ydv.contracts.sv.methods.deposit(
        util.TOKEN_100
      ).send({
        from: user2,
        gas: 12500000
      });
      
      expect(await ydv.contracts.sv.methods.balanceOf(user2).call()).toBe("190909090909090909090");
    });

    test("withdraw sample token", async () => {
      // deposit to sv
      await ydv.contracts.st.methods.approve(ydv.contracts.sv.options.address, util.TOKEN_100).send({from: user2});
      await ydv.contracts.sv.methods.deposit(
        util.TOKEN_100
      ).send({
        from: user2,
        gas: 12500000
      });

      expect(await ydv.contracts.sv.methods.balanceOf(user2).call()).toBe(util.TOKEN_100);
      expect(await ydv.contracts.sv.methods.balance().call()).toBe(util.TOKEN_100);
      
      let _before = await ydv.contracts.st.methods.balanceOf(user2).call();

      // withdraw from sv
      await ydv.contracts.sv.methods.withdraw(
        util.TOKEN_100
      ).send({
        from: user2,
        gas: 12500000
      });

      let _after = await ydv.contracts.st.methods.balanceOf(user2).call();
      expect(minus(_after, _before)).toBe(util.TOKEN_100);

      expect(await ydv.contracts.sv.methods.balanceOf(user2).call()).toBe(util.TOKEN_0);
      expect(await ydv.contracts.sv.methods.balance().call()).toBe(util.TOKEN_0);
    });

    test("with sample token after yield", async () => {
      // deposit to sv
      await ydv.contracts.st.methods.approve(ydv.contracts.sv.options.address, util.TOKEN_100).send({from: user2});
      await ydv.contracts.sv.methods.deposit(
        util.TOKEN_100
      ).send({
        from: user2,
        gas: 12500000
      });

      expect(await ydv.contracts.sv.methods.balanceOf(user2).call()).toBe(util.TOKEN_100);
      expect(await ydv.contracts.sv.methods.balance().call()).toBe(util.TOKEN_100);

      // simulate earning in sv
      await ydv.contracts.st.methods.mint(ydv.contracts.sv.options.address, util.TOKEN_10).send({from: deployer});
      expect(await ydv.contracts.sv.methods.balance().call()).toBe(plus(util.TOKEN_100, util.TOKEN_10));

      // deposit to sv
      await ydv.contracts.st.methods.approve(ydv.contracts.sv.options.address, util.TOKEN_100).send({from: user2});
      await ydv.contracts.sv.methods.deposit(
        util.TOKEN_100
      ).send({
        from: user2,
        gas: 12500000
      });
      
      expect(await ydv.contracts.sv.methods.balanceOf(user2).call()).toBe("190909090909090909090");

      let _before = await ydv.contracts.st.methods.balanceOf(user2).call();

      // withdraw from sv
      await ydv.contracts.sv.methods.withdrawAll(
      ).send({
        from: user2,
        gas: 12500000
      });

      let _after = await ydv.contracts.st.methods.balanceOf(user2).call();
      expect(minus(_after, _before)).toBe(plus(util.TOKEN_100, plus(util.TOKEN_100, util.TOKEN_10)));
    });
  });
})
