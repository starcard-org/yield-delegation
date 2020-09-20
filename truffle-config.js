require('dotenv-flow').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '1001',
      gasPrice: 1000000000, // 1 gwei
      gas: 8000000,
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    mainnet: {
      network_id: '1',
      provider: () => new HDWalletProvider(
        [process.env.DEPLOYER_PRIVATE_KEY],
        "https://mainnet.infura.io/v3/731a2b3d28e445b7ac56f23507614fea",
        0,
        1,
      ),
      gasPrice: Number(process.env.GAS_PRICE),
      gas: 8000000,
      from: process.env.DEPLOYER_ACCOUNT,
      timeoutBlocks: 800,
    },
  },
  compilers: {
    solc: {
      version: "^0.6.2",  // A version or constraint - Ex. "^0.5.0"
                          // Can also be set to "native" to use a native solc
      docker: false,      // Use a version obtained through docker
      parser: "solcjs",   // Leverages solc-js purely for speedy parsing
      settings: {
        optimizer: {
          enabled: true,
          runs: 200 // Optimize for how many times you intend to run the code
        },
      }
    }
  }
};
