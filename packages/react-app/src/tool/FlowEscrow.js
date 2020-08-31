import React, { useEffect, useState } from "react";


import * as fcl from "@onflow/fcl";

import { createAccount } from "../utils/create-account";
import { sendTransaction } from "../utils/send-transaction";
import { deployContract } from "../utils/deploy-code";

import { useContractLoader, useEventListener } from "../hooks"


import mintNFT from "../flow/src/contracts/mintNFT.cdc";
import DappymonCode from "../flow/src/contracts/Dappymon.cdc";

import { generateCode } from "../flow/src/utility.js";


fcl
  .config()
  .put("PRIVATE_KEY", "5e967c6c6370b4b243d107794f6096cc346415142eacb72ed64ccfee4e4ae8f5")
  .put("SERVICE_ADDRESS","f8d6e0586b0a20c7")
  .put("accessNode.api","http://localhost:8080");



const updateEvents = async (_ERC721events) => {

    var prevLength = localStorage.getItem("eventsLength") ? localStorage.getItem("eventsLength") : 0;
    //var prevLength = 0;
    var newLength = _ERC721events.length;
    
    console.log("prevLength : ", prevLength);
    console.log("newLength : ", newLength);
    
    if(newLength > prevLength){
        for (var i = prevLength; i < newLength ; i++){
            const event = _ERC721events[i];
                       
            
            const code = await generateCode(mintNFT, {
                query: /(0x01|0x02|TOKEN_ID)/g,
                "0x01": localStorage.getItem("DappymonContractAddress"),
                "0x02": event._flowAddress,
                "TOKEN_ID": event._tokenID.toNumber(),
            });
            
            //console.log("code : ", code);

            const tx = await sendTransaction(localStorage.getItem("DappymonContractAddress"), code);
            console.log("index : ", i);
            console.log("Mint token : ", { tx });
        }
        localStorage.setItem("eventsLength", newLength);
    }
}  



const loadContracts = async () => {

    // create account from service account
    // depoy Dappymon contract
    // save this address


    const account = await createAccount();
    localStorage.setItem("DappymonContractAddress",account);

    console.log("account : ", { account });
    const code = await generateCode(DappymonCode);

    const deployTx = await deployContract(account, code);
    console.log("deploy : ",{ deployTx });
}


export default function FlowEscrow(props){
    
    // incoming _ERC721events check kartey rho
    // if newLength > prevLength
    //    mintNFT() transaction ko call kro 
    // const readContracts = useContractLoader(props.localProvider);
    // const _ERC721events = useEventListener(readContracts,"NFTescrow","_ERC721update",props.localProvider,1);
    
    console.log("events : ", props._ERC721events);
    

    //useEffect(() => {
    //    updateEvents(_ERC721events);
    //},[_ERC721events]);


    /**
     * 
     * TODO: Call updateEvents only if new length is greater than old length!
     * aur next time se ye man k chlna ki contracts loaded hi hain
     * 
     * 
     */
    useEffect(() => {
        update_Events();
    },[props._ERC721events]);
    

    
    const update_Events = async () => {
        const response = await updateEvents(props._ERC721events);
        console.log("Escrow NFT list updated :", response);
    }
    





    return (
        <div>
            <button onClick={loadContracts}>Load contracts</button>
            <button onClick={update_Events}>mint tokens</button>
            <p>hello</p>
        </div>
    )

}