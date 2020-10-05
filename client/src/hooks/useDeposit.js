import {useWallet} from 'use-wallet';
import {useCallback, useContext} from 'react';
import BigNumber from 'bignumber.js';
import {bnToDec} from '../utils/number';
import {DrizzleContext} from '../context/DrizzleContext';

export const useDeposit = name => {
  const {drizzle, initialized} = useContext(DrizzleContext);
  const {account} = useWallet();
  const deposit = useCallback(
    (amount, decimals, method = 'deposit') => {
      if (!drizzle || !initialized) {
        return;
      }

      drizzle.contracts[name].methods[method](
        bnToDec(new BigNumber(amount), decimals)
      ).send({
        from: account,
      });
    },
    [account, name, drizzle, initialized]
  );
  return deposit;
};
