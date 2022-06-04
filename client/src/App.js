import React, { useState, useEffect, Fragment } from 'react';
import KopiToken from "./contracts/KopiToken.json";
import KopiTokenSale from "./contracts/KopiTokenSale.json";
import KopiKycContract from "./contracts/KopiKycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

export default function App(props) {
  // state = { storageValue: 0, web3: null, accounts: null, contract: null };
  const [web3, setWeb3] = useState(null);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [networkId, setNetworkId] = useState("");

  // the contract
  const [kopiToken, setKopiToken] = useState(null);
  const [kopiTokenSale, setKopiTokenSale] = useState(null);
  const [kopiKycContract, setKopiKycContract] = useState(null);

  const [kopiTokenBalance, setKopiTokenBalance] = useState(0);

  // addresses
  const [kycAddress, setKycAddress] = useState("0x123...");


  useEffect(() => {

    // deploy contracts
    let initializeAndDeploy = async() => {
      const web3Instance = await getWeb3();
      if (web3Instance !== null) {
        setWeb3Callback(web3Instance, setWeb3);

        const ethAccounts = await web3Instance.eth.getAccounts();
        if (ethAccounts !== null) {
          setAccountsCallback(ethAccounts, setAccounts);
        }

        const networkId = await web3Instance.eth.net.getId();
        if (networkId !== null) {
          setNetworkIdCallback(networkId, setNetworkId);
        }


        // deploy the contracts
        // Kopi Token
        const kopiTokenInstance = new web3Instance.eth.Contract(
          KopiToken.abi,
          // if the networks and address are successfully set
          KopiToken.networks[networkId] && KopiToken.networks[networkId].address,
        );
        if (kopiTokenInstance !== null) {

          setKopiTokenCallback(kopiTokenInstance, setKopiToken);
          // setKopiToken(kopiTokenInstance);

        } else {
          alert(
            `Failed to load the token contract. Check console for details.`,
          );
          setError("Cannot get KopiToken contract");
        }

        // KopiTokenSale
        const kopiTokenSaleInstance = new web3Instance.eth.Contract(
          KopiTokenSale.abi,
          KopiTokenSale.networks[networkId] && KopiTokenSale.networks[networkId].address,
        );
        if (kopiTokenSaleInstance !== null) {

          setKopiTokenSaleCallback(kopiTokenSaleInstance, setKopiTokenSale);

        } else {
          alert(
            `Failed to load the crowdsale contract. Check console for details.`,
          );
          setError("Cannot get KopiTokenSale contract");
        }

        // KopiKycContract
        const kopiKycInstance = new web3Instance.eth.Contract(
          KopiKycContract.abi,
          KopiKycContract.networks[networkId] && KopiKycContract.networks[networkId].address,
        );
        if (kopiKycInstance !== null) {
          
          setKopiKycCallback(kopiKycInstance, setKopiKycContract);

        } else {
          alert(
            `Failed to load the KYC contract. Check console for details.`,
          );
          setError("Cannot get KopiKycContract contract");
        }

      }
    }

    initializeAndDeploy();  

    // call functions in useEffect once when component renders. If we wish to run them again based on changes in certain state variables, we need to add them into the array of dependencies (line below)
  }, []);


  // callback
  let setAccountsCallback = (_ethAccounts, _setAccounts) => {
    _setAccounts(_ethAccounts); 
  }

  let setNetworkIdCallback = (_networkId, _setNetworkId) => {
    _setNetworkId(_networkId);
  }

  let setWeb3Callback = (_web3Instance, _setWeb3) => {
    _setWeb3(_web3Instance);
  }

  let setKopiTokenCallback = (_kopiTokenInstance, _setKopiToken) => {
    _setKopiToken(_kopiTokenInstance);
  }

  let setKopiTokenSaleCallback = (_kopiTokenSaleInstance, _setKopiTokenSale) => {
    _setKopiTokenSale(_kopiTokenSaleInstance);
  }

  let setKopiKycCallback = (_kopiKycInstance, _setKopiKyc) => {
    _setKopiKyc(_kopiKycInstance);
  }

  // console.log(kopiToken);
  // if (kopiTokenSale !== null) {
  //   console.log(kopiTokenSale.events);
  // }

  // console.log(kycContract);
  // console.log(accounts);


  //--------------------------------- JS functions here ---------------------------------//

  let updateUserTokenBalance = async() => {
    // call() is a 'read' operation which is free, unlike 'send()' which is a writing function
    let balance = await kopiToken.methods.balanceOf(accounts[0]).call();
    setKopiTokenBalance(balance);
  }

  // listen to a token transfer event when it involves the account defined in "to:" (accounts[0]). Call a callback function (updateUserTokenBalance) when there is a change in "data"
  // Thus, when there is a token transfer event to address account[0], the token balance on the frontend will change
  let listenToTokenTransfer = () => {
    kopiToken.events.Transfer({to: accounts[0]}).on("data", updateUserTokenBalance);
  }

  let handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    // 
    if (name === "kycAddress") {
      // console.log(value);
      setKycAddress(value);
    }
  }

  let handleKycWhitelistButtonEvent = async() => {
    console.log(kopiKycContract)
    await kopiKycContract.methods.setKycCompleted(kycAddress).send({from: accounts[0]});
    alert("KYC for " + kycAddress + " is successful!");
  }


  let handleBuyTokens = async() => {
    // buy one token at at time
    await kopiTokenSale.methods.buyKopiToken(accounts[0]).send({from:accounts[0], value: web3.utils.toWei("1", "wei")});
  }


  if (error != null) {
    return <div>Loading Web3, accounts, and contract...</div>
  }


  // only render when the contract instances are not null
  if (kopiTokenSale !== null && kopiToken !== null && kopiKycContract !== null) {

    let kopiTokenSaleAddress = KopiTokenSale.networks[networkId].address;

    console.log(kopiTokenSale.methods)

    // show user's balance on the frontend on render
    updateUserTokenBalance();
    // update user balance when there is a token transfer event
    listenToTokenTransfer();

    // // debugging
    // console.log(kopiTokenSale.methods)
    // console.log(KopiKycContract.networks);
    // console.log(KopiToken.networks)
    // console.log(KopiTokenSale.networks)

    return (
      <Fragment>
        <div className="App">
          <h1>Kopi Token</h1>
          <p>Sign up to get your tokens!</p>
          <h2>KYC Whitelisting</h2>
          <div>
            Address to allow: <input type="text" name="kycAddress" value={kycAddress} onChange={handleInputChange}/>
          </div>
          <button type="button" onClick={handleKycWhitelistButtonEvent}>
            Whitelist Address
          </button>
          <div>
            <p>Send your funds to the crowdsale contract here = {kopiTokenSaleAddress}</p>
          </div>
          <div>
            You currently have : {kopiTokenBalance} KOPI tokens
            <br></br>
            <button type="button" onClick={handleBuyTokens}>Buy more</button>
          </div>
        </div>
      </Fragment>
    )

  } else {
    return <div>Loading Web3, accounts, and contract...</div>
  }

  
}
