pragma solidity ^0.8.0;

contract KopiKycContract {
    mapping(address => bool) allowed;

    address private owner;

    constructor() {
        owner = msg.sender;
    }

    function setKycCompleted(address _addr) public onlyOwner {
        allowed[_addr] = true;
    }

    function setKycRevoked(address _addr) public onlyOwner {
        allowed[_addr] = false;
    }

    function kycCompleted(address _addr) public view returns (bool) {
        return allowed[_addr];
    }


    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
    _;
    }
    
}