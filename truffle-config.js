const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config({path: "./.env"});
const AccountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develops: {
      port: 8545,
      network_id:5777
    },

    ganache_local: {
      provider: () => 
        new HDWalletProvider({
          mnemonic: {
            phrase: process.env.MNEMONIC
          },
          providerOrUrl: "http://localhost:8545",
          numberOfAddresses: 1,
        }),
        network_id: 5777,
    }
  },

  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};
