import {useCallback, useContext} from 'react';
import {useWallet} from 'use-wallet';

import {DrizzleContext} from '../context/DrizzleContext';

const approve = async (methods, to, from) => {
  return methods.approve(to, 10000000000).send({from});
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
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, token, vault, drizzle, loading]);

  return {onApprove: handleApprove};
};

export default useApprove;
