

// renders all the flow creatures of user with their Flow ids using getIDs() function

// setup receiver
// run script gteIDs()
// then render cards accordingly


import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Divider } from 'antd';

import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";

import { generateCode, getAddress } from "../flow/src/utility.js";

import displayNFTs from "../flow/src/contracts/displayNFTs.cdc";



export const getUserAddress = async () => {
    const user = fcl.currentUser();
    const snapshot = await user.snapshot();
    return getAddress(snapshot);
};


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


export default function FlowUser(){

  const [myCollection, setMyCollection] = useState([]);

  const ListCreatures = async () => {
      
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
    }
    
    console.log("myCollection : ", myCollection);
    
    // useEffect(() => {
    //   if(props.flowAddress == ){
        
    //   }
    // },[props.flowAddress]);

    return (
      <div>
        <div style={{textAlign:'right',right:0,top:0,padding:10 }}>
          <Button  type="primary" onClick={ListCreatures}>Display NFTs</Button>
        </div>
        <h2>My NFT Collection 👾</h2>
        <Row style={{width:700}}>
          {myCollection}
        </Row>
      </div>
    )
}
