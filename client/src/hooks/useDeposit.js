import {useWallet} from 'use-wallet';
import {useCallback, useContext} from 'react';
import {decToBn} from '../utils/number';
import {DrizzleContext} from '../context/DrizzleContext';

export const useDeposit = name => {
  const {drizzle, initialized} = useContext(DrizzleContext);
  const {account} = useWallet();
  const deposit = useCallback(
    async (amount, decimals, method = 'deposit') => {
      if (!drizzle || !initialized) {
        return;
      }

      // If ever we still have decimals after applying the decimals
      // we need to get rid of them.
      const value = decToBn(amount, decimals).toFixed(0, 1);
      console.log(`Value: ${value}`);
      const tx = await drizzle.contracts[name].methods[method](value.toString()).send({
        from: account,
      });
      return tx.status;
    },
    [account, name, drizzle, initialized]
  );
  return deposit;
};
