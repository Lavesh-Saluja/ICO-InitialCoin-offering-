//SPDX-License-Identifier:MIT
pragma solidity ^ 0.8.17;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IMy_NFT.sol";
contract Contract is ERC20,Ownable{
     uint public constant maxTotalSupply=10000*10**18;
     uint public price=0.001 ether;
     uint public tokensPerNFT=10*10**18;
      mapping(address => bool) public claimed;
      IMy_NFT nft;
    constructor(address _myNFT) ERC20("Electro Tech Coin","ETC"){
        nft=IMy_NFT(_myNFT);
         }
         function mint(uint amount) public payable {
             uint reqAmt=amount*price;
             require(reqAmt==msg.value,"Incorrect Amount");
             uint reqToken=amount*10**18;
             require((totalSupply()+reqToken)<=maxTotalSupply,"insufficient Tokens");
             _mint(msg.sender,reqToken);
         }
         function claim()public {
             require(!claimed[msg.sender],"You have already claimed");
             uint balance=nft.balanceOf(msg.sender);
             require(balance>0,"You dont hold any nft");
            uint tokensClaimed=balance*tokensPerNFT;
            _mint(msg.sender,tokensClaimed);         
            claimed[msg.sender]=true;    
         }
        function withdraw() public onlyOwner  {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) =  _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
           // Function to receive Ether. msg.data must be empty
      receive() external payable {}

      // Fallback function is called when msg.data is not empty
      fallback() external payable {}
  }

