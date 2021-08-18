require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("@openzeppelin/hardhat-upgrades");

const dotEnvConfig = require("dotenv").config;

dotEnvConfig();

const MNEMONIC_KEY = process.env.MNEMONIC_KEY || "";
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "41e0d1636f937f2ae9c09902be4503ee1f7047e640b3d90dbda1419868b21efe";
// commiting the above private key is safe, as the wallet (0x12845f392DBbe1470D0Bf32d90822AD6c43e7FB8) compromised
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.6.9",
      },
    ],
  },
  networks: {
    localhost: {
      chainId: 1337,
      url: 'http://127.0.0.1:8545/',
      timeout: 3000000,
    },
    mainnet: {
      url:
        "https://eth-mainnet.alchemyapi.io/v2/ULzKnrrt6iflDEREoi2qNJzqRL6N6y6X",
      chainId: 1,
      accounts: [PRIVATE_KEY],
    },
    rinkeby: {
      url:
        "https://eth-rinkeby.alchemyapi.io/v2/ULzKnrrt6iflDEREoi2qNJzqRL6N6y6X",
      chainId: 4,
      accounts: [PRIVATE_KEY],
    },
    hardhat: {
      forking: {
        url:
          "https://eth-mainnet.alchemyapi.io/v2/ULzKnrrt6iflDEREoi2qNJzqRL6N6y6X",
      },
      accounts: {
        mnemonic: MNEMONIC_KEY,
      },
      chainId: 1337,
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY
  },
  mocha: {
    timeout: false,
  }  
};