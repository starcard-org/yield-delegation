import {
  ydv,
  send,
  balanceOf
} from "../YDV.js"
import {
  etherMantissa
} from "../lib/Helpers.js"

const rallyAmount = etherMantissa(15e9);

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

    // send all reward tokens from escrow to YDVRewardsDistributor contract
    await send("rally", "approve", [ydv.contracts.ydv_rd.options.address, rallyAmount], escrow);
    await send("rally", "transfer", [ydv.contracts.ydv_rd.options.address, rallyAmount], escrow);
  });

  describe('YDV Rewards Distributor', () => {
    test('reward distributor balance', async () => {
      expect(await balanceOf("rally", escrow)).toBe("0");
      expect(await balanceOf("rally", ydv.contracts.ydv_rd.options.address)).toBe("15000000000000000000000000000");
    });
  });
});
