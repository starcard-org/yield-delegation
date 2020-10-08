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

describe("Reward Token", () => {
  let snapshotId;
  let deployer;
  let user;
  let new_user;
  let new_minter;
  let escrow = process.env.TOKEN_ESCROW;
  let treasury = process.env.TREASURY;
  
  beforeAll(async () => {
    const accounts = await ydv.web3.eth.getAccounts();
    ydv.addAccount(accounts[0]);
    deployer = accounts[0];
    user = accounts[1];
    snapshotId = await ydv.testing.snapshot();
  });

  beforeEach(async () => {
    await ydv.testing.resetEVM("0x2");

    // send all reward tokens from escrow to YDVRewardsDistributor contract
    await ydv.contracts.rally.methods.approve(ydv.contracts.ydv_rd.options.address, "15000000000000000000000000000").send({from:escrow});
    await ydv.contracts.rally.methods.transfer(ydv.contracts.ydv_rd.options.address, "15000000000000000000000000000").send({from:escrow});
  });

  describe('YDV Rewards Distributor', () => {
    test('reward distributor balance', async () => {
      expect(await ydv.contracts.rally.methods.balanceOf(ydv.contracts.ydv_rd.options.address).call()).toBe("15000000000000000000000000000");
    });
  });
});
