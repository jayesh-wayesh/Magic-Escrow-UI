import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Divider } from 'antd';

import { ListCreatures} from "../flowhelpers/utility.js";




const updateMyFlowCollection = async (setMyCollection) => {

  const response = await ListCreatures(setMyCollection);
  console.log("List creatures on flow side :", response);

}


export default function FlowCollection(props){

  /**
   *
   * @var myCollection stores NFT collection of current user and renders them on screen
   *
   */
  const [myCollection, setMyCollection] = useState([]);



  /**
   *
   * @param props.flowAddress to render NFT collection whenever user logs in
   * @param _ERC721events to check if new NFT is added to flow
   *
   */
  useEffect(() => {

    // if logged in render NFTs for that address
    if(props.flowAddress != "NO ADDRESS")
    {
      updateMyFlowCollection(setMyCollection);
    }
    // else vanish collection
    else
    {
      setMyCollection([]);
    }

  },[props.flowAddress, props._ERC721events])


//  console.log("User's NFT collection: ", myCollection);
//  console.log("_ERC721 events: ", props._ERC721events);  



  return (
    <div>
      <div style={{textAlign:'right',right:0,top:0,padding:10 }}>
        <Button  type="primary" onClick={ListCreatures}>Display NFTs</Button>
      </div>
      <h2>Flow NFT Collection 👾</h2>
        <Row style={{width:700}}>
          {myCollection}
        </Row>
    </div>
  )
}
