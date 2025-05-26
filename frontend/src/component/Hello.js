import React from 'react'
import banner from "../banner.svg"
import "../App.css"
import { useSelector } from 'react-redux';
function Hello() {
  const user = useSelector((state) => state.user.user || JSON.parse(localStorage.getItem('user')));
 
  return (
    <div style={{ borderRadius:"25px",  minWidth:"500px",  backgroundColor:"#F5F5F7", padding:"2px", display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
        <div style={{ padding:"0px 12px", display:"flex", flexDirection:"column", justifyContent:"center", }}>
            <div style={{ fontSize:"24px",fontFamily:"Lexend", fontWeight:600}}>Hello {user?.name}!</div>
            <div style={{ fontSize:"14px", color:"#5A5A5A"}}>It’s good to see you again.</div>
        </div>
        <div style={{ display:"flex",  flexDirection:"column", justifyContent:"space-between"}}>
            <img alt="banner" style={{ borderRadius:"25px"}} src={banner}/>
           
        </div>
    </div>
  )

}

export default Hello