import {useCallback, useContext} from 'react';
import {useWallet} from 'use-wallet';
import {DrizzleContext} from '../context/DrizzleContext';
import BigNumber from 'bignumber.js';

const MAX_APPROVAL = new BigNumber(2).pow(256).minus(1);

const approve = async (methods, to, from) => {
  debugger;
  return methods.approve(to, MAX_APPROVAL).send({from});
};

const useApprove = (token, vault) => {
  const {drizzle, loading} = useContext(DrizzleContext);
  const {account} = useWallet();
  const handleApprove = useCallback(async () => {
    if (!drizzle || loading) {
      return false;
    }

    try {
      const tx = await approve(
        drizzle.contracts[token].methods,
        drizzle.contracts[vault].address,
        account
      );

      return tx.status;
    } catch (e) {
      return false;
    }
  }, [account, token, vault, drizzle, loading]);

  return {onApprove: handleApprove};
};

export default useApprove;
