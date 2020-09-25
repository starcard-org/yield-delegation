import {useWallet} from 'use-wallet';
import {useCallback, useContext} from 'react';
import {DrizzleContext} from '../context/DrizzleContext';

export const useDeposit = name => {
  const {drizzle, loading} = useContext(DrizzleContext);
  const {account} = useWallet();
  const deposit = useCallback(
    amount => {
      console.log(`Depositing to ${name}, from ${account}`);
      if (!drizzle || loading) {
        return false;
      }

      console.log(drizzle.contracts[name].methods);
      drizzle.contracts[name].methods.deposit(10000000000).send({
        from: account,
      });

      console.log(`Deposited ${amount}`);
    },
    [account, name, drizzle, loading]
  );
  return deposit;
};
