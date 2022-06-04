pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KopiToken is ERC20 {
    constructor(uint256 numTokens) ERC20("Kopi Dao Governance Token", "KOPI") {
        // default decimals 18

        // If we wish to mint tokens on deployment, call the _mint function
        _mint(msg.sender, numTokens);
    }
}

