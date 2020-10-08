import Web3 from 'web3';
import React, {useState, useEffect, useCallback} from 'react';
import {Drizzle} from '@drizzle/store';
import {useWallet} from 'use-wallet';
import ERC20 from '../contracts/ERC20';
import YieldDelegatingVault from '../contracts/YieldDelegatingVault';

export const DrizzleContext = React.createContext();

const ALL_CONTRACTS = [
  'USDC',
  'YCRV',
  'TUSD',
  'DAI',
  'USDT',
  'YFI',
  'crvBUSD',
  'crvBTC',
  'WETH',
  'yVaultUSDC',
  'yVaultYCRV',
  'yVaultTUSD',
  'yVaultDAI',
  'yVaultUSDT',
  'yVaultYFI',
  'yVaultcrvBUSD',
  'yVaultcrvBTC',
  'yVaultWETH',
  'yTokenUSDC',
  'yTokenYCRV',
  'yTokenTUSD',
  'yTokenDAI',
  'yTokenUSDT',
  'yTokenYFI',
  'yTokencrvBUSD',
  'yTokencrvBTC',
  'yTokenWETH',
];

// y Tokens addresses  for (deposityToken, withdrawyToken)
const Y_TOKEN_ADDRESSES = {
  USDC: '0x597ad1e0c13bfe8025993d9e79c69e1c0233522e',
  TUSD: '0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a',
  DAI: '0xACd43E627e64355f1861cEC6d3a6688B31a6F952',
  USDT: '0x2f08119C6f07c006695E079AAFc638b8789FAf18',
  YFI: '0xBA2E7Fed597fd0E3e70f5130BcDbbFE06bB94fe1',
  WETH: '0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7',
  YCRV: '0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c',
  crvBUSD: '0x2994529C0652D127b7842094103715ec5299bBed',
  crvBTC: '0x7Ff566E1d69DEfF32a7b244aE7276b9f90e9D0f6',
};

// Loaded from migration addresses
const VAULT_ADDRESSES = {
  USDC: '0xd83aDFa15B77A8A555BfeB605e717798Dfa6ea1C',
  TUSD: '0xdD625adC58bA19cffCeF55cF41459F4564454133',
  DAI: '0xd1878dde2359829FBf1000D5CF62aFd5a534E8c2',
  USDT: '0x77115087D679eCC95613d069f46ca6598b9AF587',
  YFI: '0xF0022d82b2Ce81b101C6E731e97ae31c7707937c',
  WETH: '0x533f1E9A109aC9CaC32A6233E788632834A46880',
  YCRV: '0x056fbbD3eB1DE19c085f10d32ed9D50C206ef681',
  crvBUSD: '0xa0BCA72a3BCf3E7518F51214d9528b9F7D6d7420',
  crvBTC: '0x020d66aCE26b4a2124429F44F2907641245Be6Ec',
};

const CONTRACT_LOADING_STATE = {
  NONE: 0,
  LOADING: 1,
  DONE: 2,
};

export const DrizzleProvider = ({children}) => {
  const {ethereum, status} = useWallet();
  const [drizzle, setDrizzle] = useState(null);
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingContracts, setLoadingContracts] = useState(CONTRACT_LOADING_STATE.NONE);
  const [initialized, setInitialized] = useState(false);

  const connect = useCallback(() => {
    const web3 = new Web3(ethereum);
    (async () => {
      setLoading(true);
      // let drizzle know what contracts we want and how to access our test blockchain
      const options = {
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
    if (
      (loading && !initialized) ||
      !drizzle ||
      initialized ||
      loadingContracts !== CONTRACT_LOADING_STATE.NONE
    ) {
      return;
    }

    setLoadingContracts(CONTRACT_LOADING_STATE.LOADING);
    let contracts = [
      ...Object.entries(VAULT_ADDRESSES).map(([key, value]) => ({
        contractName: `yVault${key}`,
        web3Contract: new drizzle.web3.eth.Contract(YieldDelegatingVault.abi, value),
      })),
      ...Object.entries(Y_TOKEN_ADDRESSES).map(([key, value]) => ({
        contractName: `yToken${key}`,
        web3Contract: new drizzle.web3.eth.Contract(ERC20.abi, value),
      })),
    ];

    contracts.map(c => {
      drizzle.addContract(c);
    });

    (async () => {
      // Underlying token for (deposit, withdraw, withdrawAll)
      contracts = await Promise.all(
        Object.keys(VAULT_ADDRESSES).map(async key => {
          console.log(`Loading ${key}`);
          return new Promise(async resolve => {
            const tokenAddress = await drizzle.contracts[`yVault${key}`].methods
              .token()
              .call();

            resolve({
              contractName: key,
              web3Contract: new drizzle.web3.eth.Contract(ERC20.abi, tokenAddress),
            });
          });
        })
      );

      contracts.map(c => {
        drizzle.addContract(c);
      });

      setLoadingContracts(CONTRACT_LOADING_STATE.DONE);
    })();
  }, [drizzle, initialized, loading, loadingContracts]);

  useEffect(() => {
    if (!drizzle || initialized || loadingContracts !== CONTRACT_LOADING_STATE.DONE) {
      return;
    }

    setInitialized(drizzle.contractList.length === ALL_CONTRACTS.length);
    console.log(drizzle);
  }, [drizzle, initialized, loading, loadingContracts]);

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
