require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require('solidity-coverage')
require('hardhat-gas-reporter');

require("dotenv").config();

const { PRIVATE_KEY } = process.env;
const TRACK_GAS = process.env.TRACK_GAS === 'true';

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.POLYGONSCAN_API_KEY // for this to work go to => <project-root>/node_modules/@nomiclabs/hardhat-etherscan/src/network/prober.ts and update mainnet etherscan api urls to bscscan ones
  },
  networks: {
    hardhat: {
      // forking: {
      //   url: process.env.MAINNET_RPC_URL
      // }
    },
    Mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      networkCheckTimeout: 2000000,
      skipDryRun: true,
      // gas: 7000000,
      // gasPrice: 25000000000,
      network_id: 97
    },
    Mainnet: {
      url: process.env.MAINNET_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      networkCheckTimeout: 20000,
      skipDryRun: true,
      // gas: 7000000,
      // gasPrice: 5000000000,
      network_id: 56
    },
  },
  gasReporter: {
    enabled: TRACK_GAS,
  },
};

