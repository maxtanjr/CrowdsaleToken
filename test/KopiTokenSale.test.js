const Token = artifacts.require("KopiToken");
const TokenSale = artifacts.require("KopiTokenSale");
const KopiKycContract = artifacts.require("KopiKycContract");
require("dotenv").config({path:"../.env"});

const chai = require("./setupChai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("KopiTokenSale test", async (accounts) => {
    // check if there really is no more KopiTokens in the deployer account after deployment
    const [deployerAccount, recipient, anotherAccount] = accounts;

    it("Test case 1: Should not have any KopiTokens in the deployer account", async() => {
        let instance = await Token.deployed(process.env.INITIAL_TOKENS);
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("Test case 2: All tokens should be in the KopiTokenSale Smart Contract by default", async() => {
        let instance = await Token.deployed(process.env.INITIAL_TOKENS);
        let balanceOfTokenSaleSmartContract = await instance.balanceOf(TokenSale.address);

        // total supply of the deployed smart contract's token
        let totalSupply = await instance.totalSupply();

        return expect (balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(totalSupply);
    });

    it("Test case 3: It should be possible to buy tokens", async() => {
        let tokenInstance = await Token.deployed(process.env.INITIAL_TOKENS);
        let tokenSaleInstance = await TokenSale.deployed();
        let kycContractInstance = await KopiKycContract.deployed();

        // think of the KopiToken smart contract to contain a map of balances for each address
        let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
    
        await kycContractInstance.setKycCompleted(deployerAccount, {from:deployerAccount});

        expect(tokenSaleInstance.sendTransaction({from:deployerAccount, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
        
        balanceBefore = balanceBefore.add(new BN(1));
        return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore);

    });
    
})