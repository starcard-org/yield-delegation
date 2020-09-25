import {
  YDV
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

describe("Reward Token", () => {
  let snapshotId;
  let deployer;
  let user;
  let new_user;
  let new_minter;
  
  beforeAll(async () => {
    const accounts = await ydv.web3.eth.getAccounts();
    ydv.addAccount(accounts[0]);
    deployer = accounts[0];
    user = accounts[1];
    new_user = accounts[2];      
    new_minter = accounts[3];
    snapshotId = await ydv.testing.snapshot();
  });

  beforeEach(async () => {
    await ydv.testing.resetEVM("0x2");
  });

  describe('Sample Token', () => {
    test('sample token setup', async () => {
      expect(await ydv.contracts.st.methods.name().call()).toBe('sample token');
      expect(await ydv.contracts.st.methods.symbol().call()).toBe('STKN');
      expect(await ydv.contracts.st.methods.balanceOf(user).call()).toBe("0");
      expect(await ydv.contracts.st.methods.totalSupply().call()).toBe("0");
      expect(await ydv.contracts.st.methods.softCap().call()).toBe("10000000000000000");
    });
  });

  describe('Minter', () => {
    test('add minter fail', async () => {
      await ydv.testing.expectThrow(ydv.contracts.st.methods.addMinter(
        new_user
      ).send({
        from: user,
        gas: 300000
      }), "Ownable: caller is not the owner");
    });
    
    test('add minter', async () => {
      expect(await ydv.contracts.st.methods.balanceOf(user).call()).toBe("0");
      await ydv.contracts.st.methods.addMinter(
        new_minter
      ).send({
        from: deployer,
        gas: 300000
      });

      await ydv.contracts.st.methods.mint(
        user,
        "1000000"
      ).send({
        from: new_minter,
        gas: 300000
      });

      expect(await ydv.contracts.st.methods.balanceOf(user).call()).toBe("1000000");
    });

  });

  describe('Sample Token Soft Cap', () => {
    test('set soft cap', async () => {
      await ydv.contracts.st.methods.setSoftCap(
        "50000000000000000"
      ).send({
        from: deployer,
        gas: 300000
      });
      expect(await ydv.contracts.st.methods.softCap().call()).toBe("50000000000000000");
    });

    test('set soft cap fail', async () => {
      await ydv.testing.expectThrow(ydv.contracts.st.methods.setSoftCap(
        "50000000000000000"
      ).send({
        from: new_user,
        gas: 300000
      }), "Ownable: caller is not the owner");
    });
  });
});
