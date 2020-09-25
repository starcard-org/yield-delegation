import Web3 from 'web3';
import React, {useState, useEffect, useCallback} from 'react';
import {Drizzle} from '@drizzle/store';
import {useWallet} from 'use-wallet';
import SampleVault from '../contracts/SampleVault';
import SampleToken from '../contracts/SampleToken';
import ERC20 from '../contracts/ERC20';
import YieldDelegatingVault from '../contracts/YieldDelegatingVault';

export const DrizzleContext = React.createContext();

const POOL_ADDRESSES = {
  USDC: '0x1ec32bfdbdbd40c0d3ec0fe420ebcfeeb2d56917',
  YUSDC: '0x35fA62d1A915a5A1390215e2b85aDE1cB48205c0',
  YIELD_DELEGATING_VAULT: '0x700C8634CcD7ed7dEBb36B92Da7aD912D70FEa67',
  ST_YIELD_DELEGATING_VAULT: '0xF7a280F71f3a31e4eeBa6deC7923768f0f1B91Ae',
};

export const DrizzleProvider = ({children}) => {
  const {ethereum, status} = useWallet();
  const [drizzle, setDrizzle] = useState(null);
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const connect = useCallback(() => {
    const web3 = new Web3(ethereum);
    (async () => {
      setLoading(true);
      // let drizzle know what contracts we want and how to access our test blockchain
      const options = {
        contracts: [SampleVault, SampleToken],
        web3: {
          customProvider: web3,
          fallback: {
            type: 'ws',
            url: 'ws://127.0.0.1:9545',
          },
        },
      };

      const loaded = new Drizzle(options);
      // setup the drizzle store and drizzle
      setDrizzle(loaded);
    })();
  }, [ethereum]);

  useEffect(() => {
    if (!drizzle) {
      return;
    }

    const unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        setState(drizzleState);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [drizzle]);

  useEffect(() => {
    if ((loading && !initialized) || !drizzle || initialized) {
      return;
    }
    setInitialized(true);
    drizzle.addContract({
      contractName: 'STYDV',
      web3Contract: new drizzle.web3.eth.Contract(
        YieldDelegatingVault.abi,
        POOL_ADDRESSES.ST_YIELD_DELEGATING_VAULT
      ),
    });
    drizzle.addContract({
      contractName: 'USDCYDV',
      web3Contract: new drizzle.web3.eth.Contract(
        YieldDelegatingVault.abi,
        POOL_ADDRESSES.YIELD_DELEGATING_VAULT
      ),
    });
    drizzle.addContract({
      contractName: 'USDCVault',
      web3Contract: new drizzle.web3.eth.Contract(ERC20.abi, POOL_ADDRESSES.USDC),
    });
    drizzle.addContract({
      contractName: 'yUSDCVault',
      web3Contract: new drizzle.web3.eth.Contract(ERC20.abi, POOL_ADDRESSES.YUSDC),
    });
  }, [drizzle, initialized, loading]);

  useEffect(() => {
    if (status !== 'connected') {
      return;
    }

    if (drizzle) {
      return;
    }

    // We should be connected, let's connect drizzle
    connect();
  }, [connect, status, drizzle]);

  return (
    <DrizzleContext.Provider value={{loading, initialized, drizzle, state, connect}}>
      {children}
    </DrizzleContext.Provider>
  );
};
