const Token = artifacts.require("KopiToken");
require("dotenv").config({path:"../.env"});

const chai = require("./setupChai.js");
const BN = web3.utils.BN;
const expect = chai.expect;


contract("Token test", async (accounts) => {

    // accounts is a list. Ganache has 10 by default
    const [deployerAccount, recipient, thirdAccount] = accounts;

    beforeEach(async() => {
        // deploy a new instance of the smart contract before any of these tests are run
        this.kopiToken = await Token.new(process.env.INITIAL_TOKENS);
    })


    it("Test case 1: All tokens should be minted to the sender's account on deployment", async () => {
        let instance = this.kopiToken;
        // total supply of the deployed smart contract's token
        let totalSupply = await instance.totalSupply();

        // from Chai. Function that expects something to be equal to something else. 
        // accounts[0] is usually the contract deployer's (msg.sender) address.
        // the eventually method waits for the promise to be resolved.
        return expect(instance.balanceOf(accounts[0])).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("Test case 2: Possible to send tokens between accounts", async() => {
        const tokensToSend = 1;
        let instance = this.kopiToken;
        let totalSupply = await instance.totalSupply();

        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(recipient, tokensToSend)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(totalSupply.sub(new BN(tokensToSend))));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(tokensToSend));
    });

    it("Test case 3: Not possible to send more tokens that available in the token smart contract", async() => {
        let instance = this.kopiToken;
        let balanceOfDeployer = await instance.balanceOf(deployerAccount);

        // expect this transaction to be rejectd
        expect(instance.transfer(recipient, new BN(balanceOfDeployer.add(new BN(1))))).to.eventually.be.rejected;

        // rejected, and expect that the deployer account stay the same
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);

    });
})