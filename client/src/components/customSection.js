import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa'; // Assuming you have FontAwesome or a similar icon library
import './Home.css';
import Task from './addTask';

export default function CustomSection({ user }) {
  const [sectionName, setSectionName] = useState('');
  const [display, setDisplay] = useState(false);
  const [allSections, setAllSections] = useState([]);

  useEffect(() => {
    handleGetSection();
  }, []);

  const handleGetSection = async () => {
    try {
      const email = user.email;
      const response = await axios.get(`http://localhost:8080/api/custom/${email}`);
      console.log(response.data[0].tasks);
      const currDate=new Date();
      response.data[0].tasks.forEach((task) => {
        if (!task.completed) {
          const dueDate = new Date(task.dueDate);
      
          const isDueToday = dueDate.toDateString() === currDate.toDateString();
          const isDueTimePassed = dueDate <= currDate;
      
          if (dueDate < currDate || (isDueToday && isDueTimePassed)) {
            task.due="Due";
            // dueTasks.push({ ...task});
          } else if (isDueToday) {
            task.due="Today"
            // todayTasks.push({ ...task });
          } else {
            // upcomingTasks.push(task);
            // task
          }
        }
      });
      setAllSections(response.data);
      console.log("response", response.data)
    } catch (error) {
      console.log(error);
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/custom/section', {
        email: user.email,
        name: sectionName,
      });
      setAllSections([...allSections, response.data]);
      setSectionName('');
      setDisplay(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteTask=async(title, section)=>{
    const email=user.email;
    console.log(section, email, title)
    console.log("onDeleteTask")
    try {
      const response=await axios.delete(`http://localhost:8080/api/custom/${title}/${email}/${section}`);
      console.log(response);
      // alert("deleted");
      handleGetSection()
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancel = (e) => {
    e.preventDefault();
    setDisplay(false);
  };

  const deleteSection=async(title)=>{
    const email=user.email;
    console.log("title", title)
    try {
      const response=await axios.delete(`http://localhost:8080/api/custom/${email}/${title}`);
      console.log(response);
      handleGetSection();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div style={{marginLeft:'40px'}}>
          {allSections.map((section) => (
        <div key={section._id}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>{section.name}</h2>
          <button style={{ marginTop: '6px', background: '#f1f1f1' }} onClick={() => {alert(section.name);deleteSection(section.name)}}>
            Delete
          </button>
        </div>

          {section.tasks.map((task, index) => (
            <div key={index}>
            <div className='Container' style={{ border:'2px solid #f1f1f1', marginLeft:'20px'}}>
                  <div className=  "task" >
                    <div className="task-checkbox" style={{padding:"0px 0px", marginTop:"11px", height:"10px",}}>
                    <label className="custom-radio">
                        <input
                          type="radio"
                          checked={task.selected}
                          onChange={() =>{console.log("clcikced"); onDeleteTask(task.title,section.name)}}
                        />
                        <span className={`radio-button ${task.priority}`}>
                        </span>
                      </label>
                    </div>
                    <div className="task-name" style={{margin:'0px', padding:'0px'}}>
                      <strong>{task.title}</strong>
                    </div>
                    <div className="buttonLayout hide">
                      <button
                        style={{ background: '#f1f1f1' }}
                        // onClick={() => onEditTask(task)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div style={{marginLeft:'30px'}}>
                  {task.description!=='' &&(<p >{task.description}</p>)}
                  
                  {(
                    <p style={{ color: task.due === 'Due' ? 'red' : task.due === 'Today' ? 'green' : 'blue' }}>
                      {task.date} {task.time} 
                    </p>
                  )}
                  </div>
                </div>
            </div>
          ))}
          <Task getTasks={handleGetSection} sectionId={section._id} sectionName={section.name}/>
        </div>
      ))}
      <section>
        <button
          className="add-section-btn"
          onClick={() => setDisplay(true)}
        >
          <FaPlus className="plus-icon" />
          Add Section
        </button>
      </section>
      {display && (
        <section>
          <form>
            <input
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder='Name this section'
            />
            <div>
              <button onClick={handleSubmit} style={{ background: 'green' }}>
                Add
              </button>
              <button style={{ background: 'red' }} onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

    </div>
  );
}
