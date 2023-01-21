//SPDX-License-Identifier:MIT
pragma solidity ^ 0.8.17;
interface IMy_NFT{
    function balanceOf(address add)external view returns (uint balance);
     function tokenOfOwnerByIndex(address owner, uint256 index)
        external
        view
        returns (uint256 tokenId);
}