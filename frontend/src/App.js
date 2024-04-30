import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Test GIFs
const TEST_GIFS = [
  "https://media3.giphy.com/media/FWi1f9Wn2hubC/giphy.gif?cid=ecf05e474hfdis89qdz9w2vn9v8x6yebhlnf8fuwixvyutov&rid=giphy.gif&ct=g",
  "https://media1.giphy.com/media/1h0O50rjjJ256ov1fV/200w.webp?cid=ecf05e471hh7c54ztvmgvlc73y1uzee4rybb151ohotwl07q&rid=200w.webp&ct=g",
  "https://media2.giphy.com/media/WvGIEE8zFIp18kmMzb/200w.webp?cid=ecf05e471hh7c54ztvmgvlc73y1uzee4rybb151ohotwl07q&rid=200w.webp&ct=g",
  "https://media3.giphy.com/media/bvKOHpBToeM9k0Tx0E/giphy.gif?cid=ecf05e475qx5tnf3r4mpbarbq7jj9lehtpkoe8n4hwal9q48&rid=giphy.gif&ct=g",
];

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // States
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  // Checking if Wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Connect the wallet
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected : ", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  // Run this when input changes in form
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  // Run this when the submit is pressed in form
  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log("Gif link:", inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue("");
    } else {
      console.log("Empty input. Try again.");
    }
  };

  // Render when solana not connected
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  // Render when solana is connected
  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {/* Map through gifList instead of TEST_GIFS */}
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching GIF list...");

      // Call Solana program here.

      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 Music Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {walletAddress
            ? renderConnectedContainer()
            : renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
