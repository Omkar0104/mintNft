import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";

const contractAddress = "0x70e125384205c3556c14954274dac86C170912Ee";
function App() {
  const [account, setAccount] = useState(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  // state for whether app is minting or not.
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  useEffect(() => {
    function initNFTContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress, contractABI.abi, signer));
    }
    initNFTContract();
  }, [account]);

  async function connectWallet() {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        setAccount(accounts[0]);
      })
      .catch((error) => {
        alert(error.reason);
      });
  }

  const data = [
    {
      url: "./assets/images/1.png",
      param:
        "handleMint('https://gateway.pinata.cloud/ipfs/QmeRv55BpK843dTZe5igDc2Wy6ZjmmZ8gdhzBToQ7TsuSr?filename=1')",
    },
    {
      url: "./assets/images/2.png",
      param:
        "handleMint('https://gateway.pinata.cloud/ipfs/QmabHjYBmgbVRA1kJqDPHRkhC5ewkpEL1GU7v733MwYHoe?filename=2')",
    },
    {
      url: "./assets/images/3.png",
      param:
        "handleMint('https://gateway.pinata.cloud/ipfs/QmeBBPFQPcmDa1UKicFz1GU6CZWRG4ApvXmUyuQKnFVBgA?filename=3')",
    },
    {
      url: "./assets/images/4.png",
      param:
        "handleMint('https://gateway.pinata.cloud/ipfs/QmSm8iPoMMG51NM6E8oeLh5TqZaBJcJ884owjDP97WdKxw?filename=4')",
    },
    {
      url: "./assets/images/5.png",
      param:
        "handleMint('https://gateway.pinata.cloud/ipfs/QmVHaDXDSydqEP2ub6MW3ZrdaYK3htUoiyUTtPPUctbpd3?filename=5')",
    },
  ];

  async function withdrawMoney() {
    try {
      const response = await NFTContract.withdrawMoney();
      console.log("Received: ", response);
    } catch (err) {
      alert(err.reason);
    }
  }

  async function handleMint(tokenURI) {
    setIsMinting(true);
    try {
      const options = { value: ethers.utils.parseEther("0.01") };
      const response = await NFTContract.mintNFT(tokenURI, options);
      console.log("Received: ", response);
    } catch (err) {
      alert(err.data.message);
    } finally {
      setIsMinting(false);
    }
  }

  if (account === null) {
    return (
      <>
        <div className="container">
          <br />

          <div className="header">
            <h1>NFT Marketplace</h1>
            <span id="network">
              <strong>* Contract is deployed on polygon_mumbai testnet</strong>
              <br /> Get test matic token from{" "}
              <a href="https://faucet.polygon.technology/" target={"_blank"}>Here</a>
            </span>
          </div>
          <p>Buy an NFT from our marketplace.</p>

          {isWalletInstalled ? (
            <button onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <p>Install Metamask wallet</p>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container">
        <br />

        <div className="header">
          <h1>NFT Marketplace</h1>
          <span id="network">
            <strong>* Contract is deployed on polygon_mumbai testnet</strong>
          </span>
        </div>

        {data.map((item, index) => (
          <div className="imgDiv">
            <img
              src={item.url}
              key={index}
              alt="images"
              width={250}
              height={250}
            />
            <button
              isLoading={isMinting}
              onClick={() => {
                eval(item.param);
              }}
            >
              Mint - 0.01 Matic
            </button>
          </div>
        ))}
        <div className="header">
          <button
            style={{ "margin-top": "10px", "margin-bottom": "10px" }}
            className="withdrawBtn"
            onClick={() => {
              withdrawMoney();
            }}
          >
            Withdraw Money from Contract
          </button>
          <span>
            <strong>💰 For Contract owner only 💰</strong>
          </span>
        </div>
      </div>
    </>
  );
}

export default App;
