import React, { useEffect, useState } from 'react'
import { ethers } from "ethers";
import { Card, Row, Col, List, Button } from 'antd';
import { useContractLoader,  useEventListener, } from "../hooks"

import { Address } from "../components"

const { Meta } = Card;
const contractName = "NFTescrow";

const ESCROW="0x556B0560205E62c3F690d86C775138d1f9911FA3";
// const ESCROW="0x5D79475C85B39E3ef1DdBdcD54560EC9eAC4B466";


export default function EthereumEscrow(props) {

  const readContracts = useContractLoader(props.localProvider);
  const writeContracts = useContractLoader(props.injectedProvider);
  const _ERC721events = useEventListener(readContracts,contractName,"_ERC721update",props.localProvider,1);


  // withdraw NFT from ESCROW by USER
  const returnNFT = async (id) => {
    const result3 = await writeContracts['NFTescrow']._transferNFT(new ethers.utils.BigNumber(id.toString()));
    console.log('NFT returned to original owner :', result3);
  }


  const ListCreatures = async () => {
    var temp = [];
    for (var i = 1; i <= 12; i++) {
      if(i == 3 || i == 5) continue;
      const id = i;
      const res = await writeContracts['Creature'].ownerOf(new ethers.utils.BigNumber(id.toString()));
      if(res == ESCROW){
        temp.push(
          <Col style={{width:200}}>
           <Card
             hoverable
             cover={<img alt="example" src={"https://storage.googleapis.com/opensea-prod.appspot.com/creature/"+i+".png"} />}
             bodyStyle={{ marginBottom: "-5px" }}
             style={{ width: 200, height: 250, marginTop: 25 }}>
            <p>ETH ID: {id}</p>
           </Card>
           <Button type="primary" onClick={() => returnNFT(id)}>Withdraw NFT</Button>
         </Col>
        );
      }
    }
    setMyCollection(myCollection => [...temp]);
  }


  const [myCollection, setMyCollection] = useState([]);

  useEffect(() => {
    if(writeContracts){
       ListCreatures();
    }
  },[_ERC721events]);


  return (
    <div>
        <Card
          title={(
            <div>
              Escrow Contract 📄 Holds your NFT !
              <div style={{float:'right',opacity:0.77}}>
              </div>
            </div>
          )}
          size="large"
          style={{ width: 550, marginTop: 25 }}>
          <Meta
            description={(
              <div>
                <Address
                  ensProvider={props.ensProvider}
                  value={ESCROW}
                />
              </div>
            )}
          />
        </Card>
          {/*<List
            style={{ width: 550, marginTop: 25}}
            header={<div><b>Transfers to Escrow</b></div>}
            bordered
            dataSource={_ERC721events}
            renderItem={item => (
            <List.Item style={{ fontSize:10 }}>
               <Address
                 ensProvider={props.ensProvider}
                 value={item._from}
               /> deposited Creature NFT with token ID : {item._tokenID.toNumber()}
            </List.Item>
          )}
        />*/}
      <Row>
        {myCollection}
      </Row>
    </div>
  );
}
