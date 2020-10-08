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
  let escrow = process.env.TOKEN_ESCROW;
  
  beforeAll(async () => {
    const accounts = await ydv.web3.eth.getAccounts();
    ydv.addAccount(accounts[0]);
    deployer = accounts[0];
    user = accounts[1];
    snapshotId = await ydv.testing.snapshot();
  });

  beforeEach(async () => {
    await ydv.testing.resetEVM("0x2");
  });

  describe('Rally Token', () => {
    test('rally token setup', async () => {
      expect(await ydv.contracts.rally.methods.name().call()).toBe('Rally');
      expect(await ydv.contracts.rally.methods.symbol().call()).toBe('RLY');
      expect(await ydv.contracts.rally.methods.balanceOf(user).call()).toBe("0");
      expect(await ydv.contracts.rally.methods.totalSupply().call()).toBe("15000000000000000000000000000");
      expect(await ydv.contracts.rally.methods.balanceOf(escrow).call()).toBe("15000000000000000000000000000");
    });
  });
});
