// This page will render all the current NFTs of user

import React, { useEffect, useState } from 'react'
import { ethers } from "ethers";
import { Card, Row, Col, List, Input, Button, Divider, Modal } from 'antd';
import { useContractLoader, useEventListener, useBlockNumber, useBalance, useTimestamp, useCustomContractReader, useCustomContractLoader } from "../hooks"
import { Address } from "../components";


const { Meta } = Card;
const contractName = "NFTescrow"
const ESCROW="0x556B0560205E62c3F690d86C775138d1f9911FA3";


export default function EthereumUser(props) {


  const readContracts = useContractLoader(props.localProvider);
  const writeContracts = useContractLoader(props.injectedProvider);
  const _ERC721events = useEventListener(readContracts,contractName,"_ERC721update",props.localProvider,1);
  //const _flowAddressUpdated = useEventListener(readContracts,contractName,"_flowAddressUpdated",props.localProvider,1);

  const [myCollection, setMyCollection] = useState([]);


  // transferNFT from user account to ESCROW
  const transferNFT = async (id) => {

    console.log("Transfer request of NFT with ethereum token ID: ", id);
//    var temp = localStorage.getItem("flowAddress");
      const res = await writeContracts['Creature']["safeTransferFrom(address,address,uint256,bytes)"](props.address, ESCROW, new ethers.utils.BigNumber(id.toString()), "0x01cf0e2f2f715450")
      //const res1 = await writeContracts['Creature'].safeTransferFrom(props.address,ESCROW,new ethers.utils.BigNumber(id.toString()));
      console.log("NFT Transfer done to escrow:", res);
  }


  // update Flow Address
  const updateFlowAddress = async () => {
    //const res = await writeContracts['NFTescrow']._updateFlowAddress(inputAddress.toString());
    //console.log("FLow Address updated :", res);
    //setFlowAddress(inputAddress);
  }


  // render creature Collection
  const ListCreatures = async () => {
    var temp = [];
    console.log("inside ... inside ...")

    for (var i = 1; i <= 12; i++) {
      console.log("inside ... inside ... inside...")

      const id = i;
      const res = await writeContracts['Creature'].ownerOf(new ethers.utils.BigNumber(id.toString()));
      if(res == props.address){
        temp.push(
          <Col style={{width:200}}>
           <Card
             hoverable
             cover={<img alt="example" src={"https://storage.googleapis.com/opensea-prod.appspot.com/creature/"+i+".png"} />}
             bodyStyle={{ marginBottom: "-5px" }}
             style={{ width: 200, height: 250, marginTop: 25 }}>
            <p>ETH ID: {id}</p>
           </Card>
           <Button type="primary" onClick={() => transferNFT(id)}>Convert to Flow</Button>
         </Col>
        );
      }
    }
    setMyCollection(myCollection => [...temp]);
  }


  // get Flow address (if available) corresponding to current ethereum address
  const getFlowAddress = async () => {

    const res = await writeContracts['NFTescrow'].getFlowAddress();
    console.log("Saved Flow Address of current user :", res);

    if(props.flowAddress == res){
      console.log("✔️ Saved Flow Address equals current Flow Address!");
    }else{
      console.log("⚠️ Saved Flow Address not equal to current Flow Address!");
    }
  }



  useEffect(() => {
     if(writeContracts){
       console.log("inside ...")
       ListCreatures();
     }
  },[]);



  useEffect(() => {

    if(writeContracts){
      getFlowAddress();
    }
  },[props.flowAddress]);




  return (
    <div>
        <Card
          size="large"
          style={{ width: 550, marginTop: 25 }}>
          <div>
            <div>Current User :
                <Address
                  ensProvider={props.ensProvider}
                  value={props.address}
                />
              </div>
            <h3>Current Flow Address: {props.flowAddress} </h3>
          </div>
        </Card>
        <div style={{height:50}}></div>
        <Button onClick={ListCreatures}>Display NFTs</Button>
        <h2>Ethereum NFT Collection 👾</h2>
        <Row style={{width:700}}>
            {myCollection}
        </Row>
    </div>
  );

}
