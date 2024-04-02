import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DueDateCalendar from './DueDateCalender';
import './Home.css'

export default function Task({
getTasks, atNav,symbol,
  fetchTasks,
  sectionName, 
}) {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  
  const setDefault = () => {
    const now = new Date();
    
    // Set hours, minutes, seconds, and milliseconds to the end of the day
    now.setHours(23, 59, 59, 999);
  
    return now;
  };
  
  useEffect(() => {
    const jsonParse = localStorage.getItem('userToken');
    if (!jsonParse) {
      return;
    }
    const User = JSON.parse(jsonParse);

    setUser(User);

    console.log('addTask', User);
  }, []);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: setDefault(),
    add: false,
    priority: 'low',
    completed: false,
  });
  const [add, setAdd] = useState(false);

  const handleDateTimeSelected = (dateTime) => {
    setNewTask({ ...newTask, dueDate: dateTime });
  };

  const handlePriorityChange = (event) => {
    setNewTask({ ...newTask, priority: event.target.value });
  };

  const handleCancel = () => {
    setAdd(false);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'low',
      completed: false,
    });
  };

  const handleRecur=() => {
    setNewTask({...newTask, add:!checked});
    setChecked(!checked);
  }

  const createTask = async (e) => {
    e.preventDefault();
    setAdd(false);
    if (!user || !user.token) {
      console.log('You must be logged in', user);
      return;
    }
    try {
      console.log('Inside try', user.token);
      console.log(newTask)
      const response = await axios.post(
        'http://localhost:8080/api/tasks',
        newTask,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log('response', response);
      fetchTasks()
      setChecked(false)
      setNewTask({title: '',description: '',dueDate: setDefault(),add:false,priority: 'low',completed: false,});
    } catch (err) {
      console.log('Error creating task:', err);
    }
  };

  const createSectionTask=async(e)=>{
    e.preventDefault();
    console.log("section called", user.email)
    console.log(sectionName)
    try {
      const response=await axios.post('http://localhost:8080/api/custom/task',{email:user.email,section:sectionName, task:newTask});
      console.log(response);
      getTasks();
      setNewTask({title: '',description: '',dueDate: setDefault(),add:false,priority: 'low',completed: false,});
    } catch (error) {
      console.log(error);
    }
  }

  return (
      <div > 
        {!add && (
          <button className="addTaskB" style={{background:'#f1f1f1', color:"black", paddingTop:'11px', paddingLeft:'0px', paddingRight:'15px', fontSize:symbol==="plus" && '30px',paddingTop:symbol==="plus" && '0px', marginTop:symbol==="plus"  && '0px'}} onClick={() => setAdd(true)}>
          {symbol==="plus" ?'+':"Add"}
          </button>
        )}
        {add && (
          <div style={{width:'470px'}} className={`${atNav=="center" && 'popup-background'}`}>
          <div className={`${atNav!=="center" && `task-container`} `}>
          <form style={{marginLeft:'20px' , marginRight:'30px'}}>
            <input autoFocus
            value={newTask.title}
            className='addInput'
            style={{color:'black', border:'none', background:atNav==="center" && "white"}}
              type="text"
              placeholder="Task name"
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
            value={newTask.description}
              className='addInput'
              style={{color:'black', border:'none', background:atNav==="center" && "white"}}
              type="text"
              placeholder="Desciption"
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <section style={{display:'flex', padding:'0px', width:'150px', height:'40px'}}>
              <select style={{width:'80px',marginTop:'10px', height:'30px',color:'black', background:'#f1f1f1'}}
                id="taskPriority" 
                value={newTask.priority}
                onChange={handlePriorityChange}
              >
                <option value="high">P1</option>
                <option value="medium">P2</option>
                <option value="low">P3</option>
              </select>
              <DueDateCalendar
                onDateTimeSelected={handleDateTimeSelected}
              
                className="due"
              />
            </section>
            <div style={{ display: 'flex', justifyContent:'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" checked={checked} onChange={handleRecur} style={{width: '15px', height: '15px',verticalAlign: 'middle',padding: '2px', }}/>
              <label style={{ padding: '8px' ,color:'black', fontWeight:'lighter'}}>
                Daily Task
              </label>
              </div>
              <div >
            <button
              style={{
                padding: '6px',
                background: '#FF7675',
                color: '#fff',
                marginRight: '20px',
              }}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              style={{
                padding: '6px',
                background: '#00D2B8',
                color: '#fff',
                width:'60px'
              }}
              onClick={sectionName ?createSectionTask:createTask}
            >
            Add
            </button>
          </div>
            </div>
            
            </form>
            </div>
          </div>
        )}
      </div>
  );
}
