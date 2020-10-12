import {
  ydv,
  send,
  call,
  balanceOf,
  totalSupply
} from "../YDV.js"
import {
  etherMantissa
} from "../lib/Helpers.js"

const totalAmount = etherMantissa(25e4);
const mintAmount = etherMantissa(1e2);

describe("Reward Token", () => {
  let snapshotId;
  let deployer;
  let user;
  
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

  describe('Sample Token', () => {
    test('sample token setup', async () => {
      await ydv.testing.resetEVM("0x2");
      expect(await call("st", "name")).toBe('sample token');
      expect(await call("st", "symbol")).toBe('STKN');
      expect(await balanceOf("st", user)).toBe("0");
      expect(await totalSupply("st")).toBe(totalAmount);
    });

    test('other users mint fail', async () => {
      await ydv.testing.resetEVM("0x2");
      await ydv.testing.expectThrow(send("st", "mint", [user, mintAmount], user), "only minters");
    });

    test('admin mint success', async () => {
      await ydv.testing.resetEVM("0x2");
      expect(await balanceOf("st", user)).toBe("0");
      await send("st", "mint", [user, mintAmount], deployer);
      await expect(await balanceOf("st", user)).toBe(mintAmount);
    });
  });
});
