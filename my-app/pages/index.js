
import styles from '@/styles/Home.module.css'
import { useState,createContext ,useEffect} from 'react';
import LoginPage from 'components/LoginPage';
import {ethers} from 'ethers';
import {
  NFT_CONTRACT_ABI,
  NFT_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";
const WalletCheck=createContext();
export default function Home() {
  const [walletConnected,setWalletConnected]=useState(false);
const [walletAddress,setWalletAddress] =useState();
const [signer,setSigner] = useState();
const [provider,setProvider] = useState();
const [loading, setLoading] = useState(false);
const [tokensToBeClaimed, setTokensToBeClaimed] = useState(0);
  // balanceOfCryptoDevTokens keeps track of number of Crypto Dev tokens owned by an address
  const [balanceOfCryptoDevTokens, setBalanceOfCryptoDevTokens] =
    useState(0);
  // amount of the tokens that the user wants to mint
  const [tokenAmount, setTokenAmount] = useState(0);
  // tokensMinted is the total number of tokens that have been minted till now out of 10000(max total supply)
  const [tokensMinted, setTokensMinted] = useState(0);
  // isOwner gets the owner of the contract through the signed address
  const [isOwner, setIsOwner] = useState(false);
async function mint(amount){
  try{
    const contract=new ethers.Contract(TOKEN_CONTRACT_ADDRESS,TOKEN_CONTRACT_ABI,signer);
    const value=amount*0.001;
    const tx=await contract.mint(amount,{
      value:ethers.utils.parseEther(value.toString()),
    });
    setLoading(true);
    await tx.wait();
    setLoading(false);
    window.alert("Successfully minted Crypto Dev Tokens");
    await getBalanceOfCryptoDevTokens();
        await getTotalTokensMinted();
        await getTokensToBeClaimed();
  }catch(e){
    console.log(e.message);
  }
 
}




async function claim(){
  try{
    const contract=new ethers.Contract(TOKEN_CONTRACT_ADDRESS,TOKEN_CONTRACT_ABI,signer);
    const tx=await contract.claim();
    setLoading(true);
    await tx.wait();
    setLoading(false);
    window.alert("Successfully minted Crypto Dev Tokens");
    await getBalanceOfCryptoDevTokens();
    await getTotalTokensMinted();
    await getTokensToBeClaimed();
  }catch(err)
  {
    console.log(err.message);
  }
}
async function withdraw(){
  try{
    const contract=new ethers.Contract(TOKEN_CONTRACT_ADDRESS,TOKEN_CONTRACT_ABI,signer);
    const tx=await contract.withdraw();
    setLoading(true);
    await tx.wait();
    setLoading(false);
    window.alert("Successfully transfered fund");
    await getBalanceOfCryptoDevTokens();
    await getTotalTokensMinted();
    await getTokensToBeClaimed();
  }catch(err)
  {
    console.log(err.message);
  }
}



async function getOwner(){
  try{
    const contract=new ethers.Contract(TOKEN_CONTRACT_ADDRESS,TOKEN_CONTRACT_ABI,signer);
    const tx=await contract.owner();
    if(tx.toLowerCase() === walletAddress.toLowerCase())
    {
      setIsOwner(true);
    }
    await getBalanceOfCryptoDevTokens();
    await getTotalTokensMinted();
    await getTokensToBeClaimed();
  }catch(err)
  {
    console.log(err.message);
  }
}

async function getTotalTokensMinted(){
  try{
    const contract=new ethers.Contract(TOKEN_CONTRACT_ADDRESS,TOKEN_CONTRACT_ABI,signer);
    const tx=await contract.totalSupply();
    setTokensMinted(tx);
    await getBalanceOfCryptoDevTokens();
    await getTotalTokensMinted();
    await getTokensToBeClaimed();
  }catch(err)
  {
    console.log(err.message);
  }
}
async function getBalanceOfTokens(){
  try{
    const contract=new ethers.Contract(TOKEN_CONTRACT_ADDRESS,TOKEN_CONTRACT_ABI,signer);
    const tx=await contract.balanceOf(walletAddress);
    setBalanceOfCryptoDevTokens(tx)
    await getBalanceOfCryptoDevTokens();
    await getTotalTokensMinted();
    await getTokensToBeClaimed();
  }catch(err)
  {
    console.log(err.message);
  }
}

async function getTokenstoBeClaimed(){
  try{
    const contract=new ethers.Contract(TOKEN_CONTRACT_ADDRESS,TOKEN_CONTRACT_ABI,signer);
    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI,
      provider
    );
    const tx=await nftContract.balanceOf(walletAddress);
  
      setTokensToBeClaimed(tx);
    await getBalanceOfCryptoDevTokens();
    await getTotalTokensMinted();
    await getTokensToBeClaimed();
  }catch(err)
  {
    console.log(err.message);
  }
}







const renderButton = () => {
  // If we are currently waiting for something, return a loading button
  if (loading) {
    return (
      <div>
        <button className={styles.button}>Loading...</button>
      </div>
    );
  }
  // If tokens to be claimed are greater than 0, Return a claim button
  if (tokensToBeClaimed > 0) {
    return (
      <div>
        <div className={styles.description}>
          {tokensToBeClaimed * 10} Tokens can be claimed!
        </div>
        <button className={styles.button} onClick={claim}>
          Claim Tokens
        </button>
      </div>
    );
  }
  // If user doesn't have any tokens to claim, show the mint button
  return (
    <div style={{ display: "flex-col" }}>
      <div>
        <input
          type="number"
          placeholder="Amount of Tokens"
          // BigNumber.from converts the `e.target.value` to a BigNumber
          onChange={(e) => setTokenAmount(ethers.BigNumber.from(e.target.value))}
          className={styles.input}
        />
      </div>

      <button
        className={styles.button}
        disabled={!(tokenAmount > 0)}
        onClick={() => mint(tokenAmount)}
      >
        Mint Tokens
      </button>
    </div>
  );
};


useEffect(()=>{
  getOwner();
  getBalanceOfTokens();
  getTotalTokensMinted();
  getTokenstoBeClaimed();
},[walletConnected]);

  return (
  <>
<WalletCheck.Provider value={{walletConnected,setWalletConnected,walletAddress,setWalletAddress,signer,setSigner,provider,setProvider}}>
<LoginPage />
<div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs ICO!</h1>
          <div className={styles.description}>
            You can claim or mint Crypto Dev tokens here
          </div>
          {walletConnected ? (
            <div>
              <div className={styles.description}>
                {/* Format Ether helps us in converting a BigNumber to string */}
                You have minted {ethers.utils.formatEther(balanceOfCryptoDevTokens.toString())} Crypto
                Dev Tokens
              </div>
              <div className={styles.description}>
                {/* Format Ether helps us in converting a BigNumber to string */}
                Overall {ethers.utils.formatEther(tokensMinted.toString())}/10000 have been minted!!!
              </div>
              {renderButton()}
              {/* Display additional withdraw button if connected wallet is owner */}
                {isOwner ? (
                  <div>
                  {loading ? <button className={styles.button}>Loading...</button>
                           : <button className={styles.button} onClick={withdraw}>
                               Withdraw Coins
                             </button>
                  }
                  </div>
                  ) : ("")
                }
            </div>
          ) : (
            <button  className={styles.button}>
            </button>
          )}
        </div>
        <div>
          <img className={styles.image} src="./0.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
</WalletCheck.Provider>
    </>
  );
}
export {WalletCheck}