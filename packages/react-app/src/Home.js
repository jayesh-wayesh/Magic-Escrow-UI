import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import {Row, Col} from 'antd';

export default function Home(){

  return (
    <div>
      <Col style={{position:'fixed', textAlign:'left', left:10,top:200}}>
        <div>
            <Link to="/ethuser">🔗User</Link>
         </div>
         <div style={{height:40}}></div>
         <div>
            <Link to="/ethescrow">🔗Escrow</Link>
         </div>
         <div style={{height:40}}></div>
         <div>
            <Link to="/flowdashboard">🔗Dashboard</Link>
         </div>
         <div  style={{height:40}}></div>
         <div>
            <Link to="/flowuser">🔗User(fl)</Link>
         </div>
      </Col>
    </div>
  )
}
