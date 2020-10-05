import {useCallback, useContext, useState, useEffect} from 'react';
import {useWallet} from 'use-wallet';

import {DrizzleContext} from '../context/DrizzleContext';

const getAllowance = async (methods, owner, spender) => {
  return methods.allowance(owner, spender).call();
};

const useAllowance = (token, vault) => {
  const {drizzle, initialized} = useContext(DrizzleContext);
  const {account} = useWallet();
  const [allowance, setAllowance] = useState(0);
  const fetchAllowance = useCallback(async () => {
    if (!initialized) {
      return -1;
    }

    try {
      const tx = await getAllowance(
        drizzle.contracts[vault].methods,
        drizzle.contracts[token].address,
        account
      );

      setAllowance(tx);
    } catch (e) {
      console.log(
        `Error getting allowance for owner: ${drizzle.contracts[token].address}, spender: ${account}`
      );
      return 0;
    }
  }, [account, token, vault, drizzle, initialized]);

  useEffect(() => {
    if (!drizzle || !initialized) {
      return;
    }

    fetchAllowance();

    let refreshInterval = setInterval(fetchAllowance, 10000);
    return () => clearInterval(refreshInterval);
  }, [drizzle, fetchAllowance, initialized]);

  return {getAllowance: fetchAllowance, allowance, setAllowance};
};

export default useAllowance;
