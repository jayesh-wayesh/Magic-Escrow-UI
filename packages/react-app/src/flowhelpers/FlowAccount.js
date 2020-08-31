import React, { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import { Card, Row, Col, Button, Divider } from 'antd';

import setupUser from "../flow/src/contracts/setupUser.cdc";
import checkReceiver from "../flow/src/contracts/checkReceiver.cdc";

import { checkReceiverScript, setupUserTx, getUserAddress} from "./utility.js";

//
// user logs in
// try to check if receiver is set
//    if receiver not set
//       send a transaction to setup receiver
//
//



const setupNFTReceiver = async (props) => {
        
    // check if receiver is set or not
    const response = await checkReceiverScript(checkReceiver);
    console.log("receiver exits: ", response);

    // if not set then request to set receiver
    if(response == false){
        const receiverResponse = await setupUserTx(setupUser);
        console.log("receiver response :", receiverResponse);
    }
    
    // set flow address to 
    const addr = await getUserAddress();
    props.setFlowAddress(addr);
}



export default function FlowAccount(props){

  const [user, setUser] = useState(null);

  const handleUser = (user) => {
    if (user.cid) {
      setUser(user);
    } else {
      setUser(null);
    }
  };


  useEffect(() => {
      return fcl.currentUser().subscribe(handleUser);
  }, []);


  var userLoggedIn = user && !!user.cid;
  if(userLoggedIn){ 
    // if user is logged in setup NFT Receiver if already not there
    setupNFTReceiver(props);
  }else{
    
    props.setFlowAddress("NO ADDRESS");
  }




  return (
    <div>
      {!(userLoggedIn) ? (
        <div style={{position:'fixed',textAlign:'right',right:0,top:0,padding:10}}>
          <button onClick={() => {fcl.authenticate();}}>Login</button>
        </div>
        ) : (
        <>
          <h1 className="welcome">Welcome, {user.identity.name}</h1>
          <p>Your Address</p>
          <p className="address">{user.addr}</p>
          <div style={{position:'fixed',textAlign:'right',right:0,top:0,padding:10}}>
             <button onClick={() => {fcl.unauthenticate();}}>Logout</button>
          </div>
        </>
      )}
    </div>
  );
}

