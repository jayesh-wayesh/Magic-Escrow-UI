import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Divider } from 'antd';
import displayNFTs from "../flow/src/contracts/displayNFTs.cdc";

import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";



export const setupUserTx = async (setupUser) => {

    const { authorization } = await fcl.currentUser();
  
    console.log("auth :", { authorization });
    
    const code = await generateCode(setupUser, {
      query: /(0x01|0x02)/g,
      "0x01": localStorage.getItem("DappymonContractAddress"),
    });
  
    const tx = await fcl.send([
      sdk.transaction`${code}`,
      sdk.payer(authorization),
      sdk.proposer(authorization),
      sdk.authorizations([authorization]),
      sdk.limit(100),
    ]);
  
    console.log({ tx });
  
    fcl.tx(tx).subscribe((txStatus) => {
      if (fcl.tx.isExecuted(txStatus)) {
        console.log("Transaction was executed");
      }
    });
};


export const checkReceiverScript = async ( checkReceiver) => {
    
    const address = await getUserAddress();
    console.log("checking receiver for :", address); 
  
    const code = await generateCode(checkReceiver, {
        query: /(0x01|0x02)/g,
        "0x01": localStorage.getItem("DappymonContractAddress"),
        "0x02": address,
    });
    
    const response = await fcl.send([
         sdk.script`${code}`,
    ]);
    
    let ans = await fcl.decode(response);
    console.log("len : ", ans);
    return ans;
}


export const render_NFTs = async () => {

  const address = await getUserAddress();
  console.log("address :", address); 

  const code = await generateCode(displayNFTs, {
      query: /(0x01|0x02)/g,
      "0x01": localStorage.getItem("DappymonContractAddress"),
      "0x02": address,
  });
  
  const response = await fcl.send([
       sdk.script`${code}`,
  ]);
  
  let ans = await fcl.decode(response);
  console.log("len : ", ans);
  return ans;
};


export const ListCreatures = async (setMyCollection) => {
      
  let creatureList = await render_NFTs();
    let len = await creatureList[0].length;
    var temp = [];
    
    for (var i = 0; i < len; i++) {
      temp.push(
        <Col style={{width:200}}>
         <Card
           hoverable
           cover={<img alt="example" src={"https://storage.googleapis.com/opensea-prod.appspot.com/creature/"+creatureList[1][i]+".png"} />}
           bodyStyle={{ marginBottom: "-5px" }}
           style={{ width: 200, height: 250, marginTop: 25 }}>
           <p>Flow ID: {creatureList[0][i]}</p>
         </Card>
       </Col>
      );
    
    }

    setMyCollection(myCollection => [...temp]);
};


export const getUserAddress = async () => {
    const user = fcl.currentUser();
    const snapshot = await user.snapshot();
    return getAddress(snapshot);
};


export const generateCode = async (url, match) => {
    const codeFile = await fetch(url);
    const rawCode = await codeFile.text();
    if (!match) {
      return rawCode;
    }
  
    const { query } = match;
    return rawCode.replace(query, (item) => {
      return match[item];
    });
};


export const getAddress = (user, nullPrefix = true) => {
  return nullPrefix ? `0x${user.addr}` : user.addr;
};


export const getEthereumID = (tokenID) => {
  return `"${tokenID}"`;
}; 