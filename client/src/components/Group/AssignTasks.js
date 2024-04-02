import React, { useState, useEffect } from 'react'
import DueDateCalendar from '../DueDateCalender';
import Filter from '../filter';
import axios from 'axios';
import EditTask from '../editTask';

export default function AddTasks({isAdmin, isShow, setIsShow}) {
  const [assignedTasks, setAssignedTasks]=useState([]);
  const [currTime, setCurrTime]=useState(new Date());
  const [gName, setGroupName]=useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [groupedTasks, setGroupedTasks] = useState({});
  const [sortType, setSortType]=useState(()=>{
    const storedType=localStorage.getItem('type');
    return storedType?JSON.parse(storedType):{sortedType:"default"};
  })
  const [fillter, setFilter] =useState(()=>{
    const storedFilter = localStorage.getItem('filter');
    return storedFilter?JSON.parse(storedFilter):{state:false};
    });
  
    const [file, setFile]=useState('')
 
    useEffect(()=>{
      assignedTasks.map(task=>{
        console.log("in map")
        console.log(task);
      })
      localStorage.setItem('filter', JSON.stringify(fillter));
      },[fillter])

  setIsShow(isShow);

  const setDefault=()=>{
    const now = new Date();
    const curr=new Date(now.getTime() +24 * 60 * 60 * 1000);
    return curr;
  }

  const [task,setTask]=useState({title:'', description:'',priority:'low', dueDate:setDefault(), completed: false});

  useEffect(() => {
    const name = localStorage.getItem('userToken');
    if (name) {
        const gp = JSON.parse(name);
        if (gp.groupName) {
            setGroupName(gp.groupName);
            fetchAllTasks(); 
        }
    }
  }, [gName]);

  const fetchAllTasks=async()=>{
    console.log(gName);
    try{
      const response=await axios.get(`http://localhost:8080/api/group/${gName}`);
      if(response.status==200){
        console.log(response.data.users[0].tasks)
        const allTasks=response.data.users[0].tasks;
        const currDate=new Date();
        allTasks.map(task=>{
          if(task.completed===false){
            
            const dueDate = new Date(task.dueDate);
            const timeDiff=dueDate-currDate;
            
            const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));


           
            if(daysRemaining<=0){
              task.due='Due';
            }
            
          }
        })
        setAssignedTasks(allTasks.filter(task => task.completed === false));
      }
    } catch(err){
      console.log(err);
    }
  }
  
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', task.title);
      formData.append('file', file);
      formData.append('due', task.dueDate);
      formData.append('priority', task.priority);
      formData.append('description', task.description);
      formData.append('gName', gName);
      console.log(task.title, file, gName);

      const response=await axios.post('http://localhost:8080/api/group/assignTasks',formData,{
        headers:{"Content-Type":"multipart/form-data"},
      });
  
      setIsShow(true);
      console.log(response);
      setAssignedTasks([...assignedTasks, task]);
      setTask({
        title: '',
        description: '',
        priority: '',
        dueDate: setDefault(),
        completed: false,
        file: null, // Reset the file after upload
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(()=>{
    setCurrTime(new Date());
  },[])

  const updateTask = async (e) => {
    e.preventDefault();
    console.log("called");
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        console.log("User is not authenticated");
        return;
      }
  
      const token = JSON.parse(userToken);
      
      const response = await axios.put(`http://localhost:8080/api/group/`, {editingTask} );
  
      const updatedTasks = assignedTasks.map((task) =>
        task.title === editingTask.title ? editingTask : task
      );
      setAssignedTasks(updatedTasks);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  
  
  const handleSortType=(type)=>{
    setSortType({sortedType:type});
     console.log(sortType);
  }

  const deleteTask = async (title) => {
    const userToken=localStorage.getItem('userToken');
    if(!userToken){
      console.log("User is not authenticated");
      return;
    }
    const token=JSON.parse(userToken);
    try{
      const response = await axios.delete(`http://localhost:8080/api/group/${title}/${gName}`);
      console.log(response);
      if(response.status===200){
        setAssignedTasks(prevTasks=>prevTasks.filter(task=>task.title!==title));
      }
    } catch(err){
      console.log(err);
    }

  }
    

  const handleCancel=(e)=>{
    e.preventDefault();
    
    setIsShow(false);
  }

  const handlePriorityChange=(value)=> setEditingTask({...editingTask, priority:value})

  const handleDateTimeSelected = (dateTime) => {
    setTask({...task, dueDate:dateTime});     
  };

  const cancel=(e)=>{
    console.log(editingTask)
    e.preventDefault();
    setEditingTask(null);
  }

  const handleSortPriority=(sortedItems)=>{
    setAssignedTasks(sortedItems);
    setFilter({state:true});
  }

  const handleDateSort = (sortedDate)=>{
    setAssignedTasks(sortedDate)
    setFilter({state:true});

  }
  useEffect(()=>{
    console.log(assignedTasks);
  },[assignedTasks])

  const handleEditTitle=(value)=> setEditingTask({ ...editingTask, title: value })
  const handleEditDesc=(value)=> setEditingTask({ ...editingTask, description: value })

  const handleReset = () => {
    // Inside the click handler, set a flag to indicate that the reset button was clicked
    setFilter({ state: false });
  };

  const showPdf=(pdf)=>{
    window.open(`http://localhost:8080/files/${pdf}`,"_blank", "noreferrer");
}
 
  return (
    <section>
      <section style={{display:'flex', justifyContent:'space-around', paddingTop:'0px'}} >
        <p style={{marginTop:'10px'}}>Tasks</p>
        <Filter sortType={sortType} tasks={assignedTasks} onSortPriority={handleSortPriority} onSortDate={handleDateSort} onGroup={(tasks)=>setGroupedTasks(tasks)} onReset={handleReset} filterOn={()=>{setFilter({state:true}); }} sortingType={handleSortType}/>
      </section>
     
      { sortType.sortedType === "Grouping" && Object.keys(groupedTasks).map(priority => (
        <div key={priority}>
          {Array.isArray(groupedTasks[priority]) && groupedTasks[priority].length > 0 && (
            <>
            <h2>{priority}</h2>
            <ul>
              {groupedTasks[priority].map(task => (
                <li key={task.title}>
                {!editingTask || editingTask.title !== task.title ?(
                  <div className='Container'>
                    <div className='task'>
                      <div className='task-name'>
                        <strong>{task.title}</strong>
                      </div>
                     {!isAdmin &&( <div className='buttonLayout hide'>
                        <button  onClick={() => setEditingTask(task)}><i class="far fa-edit"></i></button>
                        <button onClick={() => deleteTask(task.title)}>Delete</button>
                      </div>)}
                    </div>
                    <p>{task.description}</p>
                  </div>
                ): (
                  <EditTask editingTask={editingTask} handleEditTitle={handleEditTitle} updateTask={updateTask} handleEditDesc={handleEditDesc} handleEditDate={(date)=> setEditingTask({ ...editingTask, dueDate: date})} cancel={cancel}/>
                )
                }
                
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    ))}


            {sortType.sortedType!="Grouping" && <ul>
              {assignedTasks.map(task => (
                <li key={task.title}>
    
                  { !editingTask || editingTask.title !== task.title ? (
                    <div className='Container'>
                      <div className='task'>
                        <div className='task-name'>
                          <strong>{task.title}</strong>
                          <button style={{background:'#f1f1f1', marginLeft:'10px'}} onClick={()=>showPdf(task.pdf)}>Resources</button>
                        </div>
                        
                        {!isAdmin &&(<div className='buttonLayout hide' >
                          <button onClick={() => setEditingTask(task)}>Edit</button>
                          <button onClick={() => deleteTask(task.title)}>Delete</button>
                        </div>)}
                      </div>
                      
                        <p>{task.description}</p>
                        { task.daysLeft >2 && ( <span style={{color:'darkred'}}>{task.daysLeft} days left</span>)}
                        { task.daysLeft<=2 && task.daysLeft>0 &&( <span style={{color:'darkred'}}>Due time: { task.dueTime}:{task.dueMinutes} and now time is {currTime.getHours()}:{currTime.getMinutes()}</span>)}
                        { task.daysLeft<=0 &&( <span style={{color:'red'}}>{task.due} </span>)}
                      </div>
                  ) : (
                    <div className='editTask'>
                    <form >
                        <input
                          type="text"
                          value={editingTask.title}
                          onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                        />
                        <input
                          type="text"
                          value={editingTask.description}
                          onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                        />
                        <select id="taskPriority" onChange={e=>setEditingTask({...editingTask, priority:e.target.value})} value={editingTask.priority} >
              
                          <option value="high">P1-Highest</option>
                          <option value="medium">P2-Medium</option>
                          <option value="low">P3-Low</option>
                        </select>
                        <DueDateCalendar onDateTimeSelected={(date)=> setEditingTask({ ...editingTask, dueDate: date})} className="due"/>
                       

                        <div style={{display:'flex', justifyContent:'flex-end', marginTop:'10px'}}>
                          <button  className="cancel-button"   onClick={handleCancel}>Cancel</button>
                          <button className='save-button'  onClick={updateTask}>Save</button>
                        </div>
                      </form>
                    </div>
                  )}
                </li>
              ))}
            </ul>}
        {!isAdmin && isShow && !editingTask && (<form  encType="multipart/form-data">
          <input 
                value={task.title}
                type="text"
                placeholder="Task name"
                onChange={e=>setTask({...task,title:e.target.value})}
              />
              <input
                value={task.description}
                type="text"
                placeholder="Desciption"
                onChange={e=>setTask({...task, description:e.target.value})}
              />
              <select id="taskPriority"  onChange={e=>setTask({...task, priority:e.target.value})} value={task.priority} >
                <option value="high">P1-Highest</option>
                <option value="medium">P2-Medium</option>
                <option value="low">P3-Low</option>
              </select>
              <DueDateCalendar className="due" onDateTimeSelected={handleDateTimeSelected}/>
              <input
                type="file"
                placeholder='Choose File'
                accept='application/pdf'
                onChange={(e) => setFile(e.target.files[0] )}
              />
              <div style={{display:'flex', justifyContent:'flex-end'}}>
                <button style={{background:'red'}} onClick={handleCancel}>Cancel</button>
                <button style={{background:'green'}} onClick={handleCreate} >Create</button>
              </div>
        </form>)}
    </section>
  )
}
