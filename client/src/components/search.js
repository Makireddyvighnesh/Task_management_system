import React, { useState } from 'react';
import axios from 'axios';

export default function Search({allTasks}) {
    const [searchInput, setSearchInput]=useState('');



    const handleChange=(e)=>{
        setSearchInput(e.target.value);
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const token=localStorage.getItem('userToken');
        if(!token){
            console.log("You need to signin");
            return;
        }
        const user=JSON.parse(token);
        console.log(allTasks)
        alert("Search");
        const taskDetails=allTasks.filter(task=>{
           const title=task.title;
           const desc=task.description;
           if((title.includes(searchInput) ||(desc && desc.includes(searchInput))) && task.completed==false)
             return task;
        })
        console.log(taskDetails);
}
  return (
    
    <form >
       <input className='search' type="text" placeholder="Search by task name ....." name="search" onChange={handleChange} />

    </form>

  )
}
