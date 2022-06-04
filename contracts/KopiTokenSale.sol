pragma solidity ^0.8.0;


import "../contracts/Crowdsale.sol";
import "../contracts/KopiKycContract.sol";


/*
* @param rate Number of token units a buyer gets per wei
* @dev The rate is the conversion between wei and the smallest and indivisible
* token unit. So, if you are using a rate of 1 with a ERC20Detailed token
* with 3 decimals called TOK, 1 wei will give you 1 unit, or 0.001 TOK.
* @param wallet Address where collected funds will be forwarded to
* @param token Address of the token being sold
*/
contract KopiTokenSale is Crowdsale {

    KopiKycContract kyc;

    constructor (
        uint256 rate, 
        address payable wallet, 
        IERC20 tokenAddr,
        KopiKycContract _kyc
    ) 
         Crowdsale(rate, wallet, tokenAddr) 
         public 
    {
             
        kyc = _kyc;

    }

    function buyKopiToken(address beneficiary) public {
        super.buyTokens(beneficiary);
    }


    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view virtual override {
       super._preValidatePurchase(beneficiary, weiAmount);
       require(kyc.kycCompleted(msg.sender), "Kyc not completed!");
    }

}