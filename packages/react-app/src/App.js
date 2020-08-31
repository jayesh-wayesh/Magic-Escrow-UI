import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import 'antd/dist/antd.css';
import { ethers } from "ethers";
import "./App.css";
import { Row } from 'antd';

import * as fcl from "@onflow/fcl";

import { Header, Account  } from "./components";
import { useContractLoader, useEventListener } from "./hooks"


import EthereumUser from './tool/EthereumUser.js';
import EthereumEscrow from './tool/EthereumEscrow.js';
import FlowCollection from './tool/FlowCollection.js';
import FlowEscrow from './tool/FlowEscrow.js';
import FlowAccount from './flowhelpers/FlowAccount.js';


const localProvider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/433699ddb2194574a686098d5596dc4a");

fcl.config()
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate")


function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();

  const [flowAddress, setFlowAddress] = useState("NO ADDRESS");

  const readContracts = useContractLoader(localProvider);
  const _ERC721events = useEventListener(readContracts,"NFTescrow","_ERC721update",localProvider,1);


  return (
      <div className="App">
          <Header />
          <div style={{position:'fixed',textAlign:'right',right:0,top:0,padding:10}}>
            <Account
              address={address}
              setAddress={setAddress}
              localProvider={localProvider}
              injectedProvider={injectedProvider}
              setInjectedProvider={setInjectedProvider}
            />
          </div>
        <EthereumEscrow
            address={address}
            localProvider={localProvider}
            injectedProvider={injectedProvider}
        />
      </div>
  );
}

export default App;
