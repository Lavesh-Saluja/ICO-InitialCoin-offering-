// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const {ethers} = require("hardhat");
const {MY_NFT_COLLECTION_ADDRESS} =require ("../constants");

async function main() {
  const contract=await ethers.getContractFactory("Contract");
  const deployedContract=await contract.deploy(MY_NFT_COLLECTION_ADDRESS);
  await deployedContract.deployed();
  console.log("Deployed contract Address",deployedContract.address)//0xDF025Cac98b042BA5F251a8e9ADAE14B2fc9c2f4
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
