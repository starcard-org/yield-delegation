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

  describe('Sample Token', () => {
    test('sample token setup', async () => {
      await ydv.testing.resetEVM("0x2");
      expect(await ydv.contracts.st.methods.name().call()).toBe('sample token');
      expect(await ydv.contracts.st.methods.symbol().call()).toBe('STKN');
      expect(await ydv.contracts.st.methods.balanceOf(user).call()).toBe("0");
      expect(await ydv.contracts.st.methods.totalSupply().call()).toBe("250000000000000000000000");
    });

    test('other users mint fail', async () => {
      await ydv.testing.resetEVM("0x2");
      await ydv.testing.expectThrow(ydv.contracts.st.methods.mint(user, "100000000000").send({from:user}), "only minters");
    });

    test('admin mint success', async () => {
      await ydv.testing.resetEVM("0x2");
      expect(await ydv.contracts.st.methods.balanceOf(user).call()).toBe("0");
      await ydv.contracts.st.methods.mint(user, "100000000000").send({from:deployer});
      expect(await ydv.contracts.st.methods.balanceOf(user).call()).toBe("100000000000");
    });
  });
});
