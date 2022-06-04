var KopiToken = artifacts.require("KopiToken.sol");
var KopiTokenSale = artifacts.require("KopiTokenSale.sol");
var KopiKycContract = artifacts.require("KopiKycContract.sol");

// one folder up
require("dotenv").config({path:"../.env"});

// function that gets called through this deploy_contracts migrations
// The deployer is a handle that gives us access to the blockchain
module.exports = async function(deployer) {
    // get the address of the truffle wallets
    let addr = await web3.eth.getAccounts();

    // the deployer is the msg.sender
    await deployer.deploy(KopiToken, process.env.INITIAL_TOKENS);

    // deploy kyc contract
    await deployer.deploy(KopiKycContract);

    // we can call the address of KopiToken after the call to deployer.deploy
    // set rate to be 1 wei for 1 token
    await deployer.deploy(KopiTokenSale, 1, addr[0], KopiToken.address, KopiKycContract.address);

    // take care of sending the minted tokens from addr[0] (the deployer) to the KopiTokenSale address,
    // so that the KopiTokenSale contract 
    // owns all the tokens, and we can distribute them
    let instance = await KopiToken.deployed();
    await instance.transfer(KopiTokenSale.address, process.env.INITIAL_TOKENS);

}


// if you encounter any issues in the contract deployment (egs, calling network ID or address returns undefined / null, run truffle migrate --reset)