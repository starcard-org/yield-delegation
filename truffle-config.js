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
        "https://eth-mainnet.alchemyapi.io/v2/ImWEbUSFY_sbX32FLo8Pwv-Q_y29UjcC",
        0,
        1,
      ),
      gasPrice: Number(process.env.GAS_PRICE),
      gas: 8000000,
      from: process.env.DEPLOYER_ACCOUNT,
      timeoutBlocks: 800,
    },
    rinkeby: {
      network_id: '4',
      provider: () => new HDWalletProvider(
        [process.env.DEPLOYER_PRIVATE_KEY],
        "https://rinkeby.infura.io/v3/cb4a5ae28e874192b688d73008d7875e",
        0,
        1,
      ),
      gasPrice: Number(process.env.GAS_PRICE),
      from: process.env.DEPLOYER_ACCOUNT,
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
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }
};
