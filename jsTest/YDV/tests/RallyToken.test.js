import {
  ydv,
  call,
  balanceOf,
  totalSupply
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
    deployer = accounts[0];
    user = accounts[1];
    snapshotId = await ydv.testing.snapshot();
  });

  beforeEach(async () => {
    await ydv.testing.resetEVM("0x2");
  });

  describe('Rally Token', () => {
    test('rally token setup', async () => {
      expect(await call("rally", "name")).toBe('Rally');
      expect(await call("rally", "symbol")).toBe('RLY');
      expect(await balanceOf("rally", user)).toBe("0");
      expect(await totalSupply("rally")).toBe(rallyAmount);
      expect(await balanceOf("rally", escrow)).toBe(rallyAmount);
    });
  });
});
