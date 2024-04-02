import React, { useEffect, useState } from 'react'
import AddParticipants from './AddParticipants';
import axios from 'axios';

export default function Group() {
    const [isGroup, setIsGroup]=useState(false);
    const [display, setDisplay]=useState(false);
    const [groupName, setGroupName]=useState('');
    const [gName, setGName]=useState('');
   
    // const []

    const handleCreate=()=>{
        setIsGroup(true);
    }

    const handleCancel=()=>{
        setIsGroup(false);
    }
    useEffect(()=>{
        const name=localStorage.getItem('userToken');
        console.log("hello")
        if(name){
            console.log("useEffect")
            const gp=JSON.parse(name);
            console.log("gp is", gp);
            if(gp.groupName)  setGroupName(gp.groupName);
        }
        
    },[groupName]);
    
    const handleSubmit=async (e)=>{
       setDisplay(true);
       try{
        const token=localStorage.getItem('userToken');
        const admin=JSON.parse(token).userName;
        const email=JSON.parse(token).email;
        
        
        console.log(admin,email, gName);
        const response=await axios.post(`http://localhost:8080/api/group/admin`,{admin,email, groupName:gName});
        if(response.status==200){
            setGroupName(gName);
            const userData=JSON.parse(token);
            userData.groupName=gName;
            localStorage.setItem('userToken', JSON.stringify(userData));
        }
       } catch(err){
        console.log(err);
        
       }
    }

  

  return (
    
      <div className='group'>
        {!groupName && !isGroup&& (<section style={{display:'flex', justifyContent:'flex-end'}}>
          <button className='create' onClick={handleCreate}>Create</button>
        </section>)}

        {!groupName && isGroup && !display && (
            <form style={{border:'2px solid black', borderRadius:'5px'}}>
                <input onChange={e=>setGName(e.target.value)} placeholder='Group Name:' />
                <div>
                    <button onClick={handleCancel}  style={{background:'red'}}>Cancel</button>
                    <button  style={{background:'green'}}  onClick={handleSubmit}>Submit</button>
                </div>
            </form>)}
        
            
        {groupName&& (<AddParticipants groupName={groupName}/>)}

        {!groupName && !isGroup && (<div style={{textAlign:'center', marginTop:'20px'}}>
            You don't have any groups. To add click on create button 
        </div>)}
         
      </div>


  
  )
}
