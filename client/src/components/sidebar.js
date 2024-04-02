import React from 'react';
import './sidebar.css';
import 'axios';

function Sidebar({close,all,showUpcoming, today, showDue,isOpen, toggleSidebar, il, dl, tl, fl }) {
const displayDue=()=>{
    showDue();
}

const displayToday=()=>{
    today();
}
const showAll=()=>{
    all();
}

const displayUpcoming=()=>{
  showUpcoming();
}
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`} style={{textAlign:'center', marginTop:'70px', cursor:'pointer'}}>
    <div style={{textAlign:'right', marginRight:'10px', marginBottom:'30px'}}>
    <button style={{color:'white', background:'black'}} onClick={()=>close()}>Close</button>
    </div>
    
      <div style={{display:'block', color:'white', textAlign:'left', marginLeft:'20px'}}>
        <div style={{display:'flex', justifyContent:'space-between', marginRight:'10px'}} onClick={showAll}>
          <button style={{color:'white', background:'black'}} >Inbox</button>
          <span>{il}</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', marginRight:'10px'}}  onClick={displayToday}>
          <button style={{color:'white', background:'black'}}>Today</button>
          <span>{tl}</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', marginRight:'10px'}} onClick={displayDue}>
          <button style={{color:'white', background:'black'}} >Due Tasks</button>
          <span>{dl}</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', marginRight:'10px'}} onClick={displayUpcoming}>
          <button style={{color:'white', background:'black'}}>Upcoming</button>
          <span>{fl}</span>
        </div>

        
       
        
      </div>
    </div>
  );
}

export default Sidebar;
