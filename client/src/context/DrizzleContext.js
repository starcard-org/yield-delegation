import Web3 from 'web3';
import React, {useState, useEffect, useCallback} from 'react';
import {Drizzle} from '@drizzle/store';
import {useWallet} from 'use-wallet';
import SampleVault from '../contracts/SampleVault';
import SampleToken from '../contracts/SampleToken';
import YieldDelegatingVault from '../contracts/YieldDelegatingVault';

export const DrizzleContext = React.createContext();

export const DrizzleProvider = ({children}) => {
  const {ethereum, status} = useWallet();
  const [drizzle, setDrizzle] = useState(null);
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);

  const connect = useCallback(() => {
    (async () => {
      setLoading(true);
      // let drizzle know what contracts we want and how to access our test blockchain
      const options = {
        contracts: [YieldDelegatingVault, SampleVault, SampleToken],
        web3: {
          customProvider: new Web3(ethereum),
          fallback: {
            type: 'ws',
            url: 'ws://127.0.0.1:9545',
          },
        },
      };

      const loaded = new Drizzle(options);
      // setup the drizzle store and drizzle
      setDrizzle(loaded);

      console.log(drizzle);
    })();
  }, [drizzle, ethereum]);

  useEffect(() => {
    if (!drizzle) {
      return;
    }

    const unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        console.log('Drizzle Connected!');
        setState(drizzleState);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [drizzle]);

  useEffect(() => {
    if (status !== 'connected') {
      return;
    }

    // We should be connected, let's connect drizzle
    connect();
  }, [connect, status]);

  return (
    <DrizzleContext.Provider value={{loading, drizzle, state, connect}}>
      {children}
    </DrizzleContext.Provider>
  );
};
