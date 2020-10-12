import Web3 from 'web3';
import BigNumber from 'bignumber.js'
import {
  Contracts
} from './lib/contracts.js';
import {
  Account
} from './lib/accounts.js';
import {
  EVM
} from "./lib/evm.js";

const oneEther = 1000000000000000000;

export class YDV {
  constructor(
    provider,
    networkId,
    testing,
    options
  ) {
    var realProvider;

    if (typeof provider === 'string') {
      if (provider.includes("wss")) {
        realProvider = new Web3.providers.WebsocketProvider(
          provider,
          options.ethereumNodeTimeout || 10000,
        );
      } else {
        realProvider = new Web3.providers.HttpProvider(
          provider,
          options.ethereumNodeTimeout || 10000,
        );
      }
    } else {
      realProvider = provider;
    }

    this.web3 = new Web3(realProvider);

    if (testing) {
      this.testing = new EVM(realProvider);
      this.snapshot = this.testing.snapshot()
    }

    if (options.defaultAccount) {
      this.web3.eth.defaultAccount = options.defaultAccount;
    }
    this.contracts = new Contracts(realProvider, networkId, this.web3, options);
    this.accounts = [];
    this.markets = [];
    this.prices = {};
    this.allocations = {};
    this.rates = {};
    this.aprs = {};
    this.poolWeis = {};
    this.platformInfo = {};
  }

  async resetEVM() {
    this.testing.resetEVM(this.snapshot);
  }

  addAccount(address, number) {
    this.accounts.push(new Account(this.contracts, address, number));
  }

  setProvider(
    provider,
    networkId
  ) {
    this.web3.setProvider(provider);
    this.contracts.setProvider(provider, networkId);
    this.operation.setNetworkId(networkId);
  }

  setDefaultAccount(
    account
  ) {
    this.web3.eth.defaultAccount = account;
    this.contracts.setDefaultAccount(account);
  }

  getDefaultAccount() {
    return this.web3.eth.defaultAccount;
  }

  loadAccount(account) {
    const newAccount = this.web3.eth.accounts.wallet.add(
      account.privateKey,
    );

    if (
      !newAccount ||
      (
        account.address &&
        account.address.toLowerCase() !== newAccount.address.toLowerCase()
      )
    ) {
      throw new Error(`Loaded account address mismatch.
        Expected ${account.address}, got ${newAccount ? newAccount.address : null}`);
    }
  }

  toBigN(a) {
    return BigNumber(a);
  }
}

export const ydv = new YDV(
  "http://localhost:8545/",
  "1001",
  true, {
    defaultAccount: "",
    defaultConfirmations: 1,
    autoGasMultiplier: 1.5,
    testing: false,
    defaultGas: "6000000",
    defaultGasPrice: "1000000000000",
    accounts: [],
    ethereumNodeTimeout: 10000
  }
)

export const send = async (contract, func, params=[], from, gasLimit = 125000) => {
  return await ydv.contracts[contract].methods[func](...params).send({
    from,
    gasLimit
  });
}

export const call = async (contract, func, params = []) => {
  return await ydv.contracts[contract].methods[func](...params).call();
}

export const balanceOf = async (token, account) => {
  return await call(token, 'balanceOf', [account]);
}

export const totalSupply = async (token) => {
  return await call(token, 'totalSupply');
}

export const approve = async (token, to, amount, from ) => {
  return send(token, 'approve', [to, amount], from);
}

export const mint = async (token, to, mintAmount, from) => {
  return send(token, 'mint', [to, mintAmount], from);
}

export const deposit = async (token, underlying, amount, from) => {
  await approve(underlying, ydv.contracts[token].options.address, amount, from);
  return send(token, 'deposit', [amount], from);
}

export const withdraw = async (token, amount, from) => {
  return send(token, 'withdraw', [amount], from);
}
