// TaskList.js
import React,{useState, useEffect} from 'react';
import Task from './addTask.js';
import CustomSection from './customSection.js';
import './Home.css';
import DueDateCalendar from './DueDateCalender.js';
const TaskSection = ({
  tasks,
  head,
  user,
  groupedTasks,
  fetchTasks,
  sortingType,
  onEditTask,
  onDeleteTask,
  onEditTitle,
  onUpdateTask,
  onEditDesc,
  onCancelEdit,
  onTaskHover,
  editingTask,
  isHovered,
}) => {

  const [selectedTask, setSelectedTask] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  // console.log("inbox tasks are", tasks);

    // console.log("tasks",tasks)
    const [curDate, setCurdate]=useState(null);
    useEffect(()=>{
      const date=new Date();
      const month =date.toLocaleString('en-US', {month:'short'});
      const day=date.getDate();
      setCurdate(`${month} ${day}`)
}, [])

const handleEdit=(task) => {
  onEditTask(task)
}
const handleTaskClick = (task) => {
  setSelectedTask(task);
  setPopupVisible(true);
};

const closePopup = () => {
  setSelectedTask(null);
  setPopupVisible(false);
};

// console.log("Sorting type", sortingType, tasks)

  return (
    <div className="task-list-container" style={{marginLeft:head==="Inbox"&& `70px`}}>
      {tasks.length > 0 && (
        <div>
        {head=='' ?(<div style={{ padding: '3px',marginLeft:'40px', color: '#534545', fontWeight: 'bold', fontSize: '26px' }}>
          {curDate} ‧ Today
        </div>):(<div style={{ padding: '3px',marginLeft:'40px',  color: head==="Reschedule" ?'red':head==="Upcoming"?'blue':'black', fontWeight: 'bold', fontSize: '20px' }}>
          {head}
        </div>)}
        <div className={head!=="Inbox" ? `scrollable-section task-list`:`inbox` }style={{paddingLeft:'40px'}}>
        
          {sortingType === "Grouping" && Object.keys(groupedTasks).length > 0 &&
            Object.keys(groupedTasks).map((priority) => (
              <div key={priority}>
                {Array.isArray(groupedTasks[priority]) &&
                  groupedTasks[priority].length > 0 && (
                    <>
                      <h5>{priority}</h5>
                      <ul>
                        {groupedTasks[priority].map((task) => (
                          <div
                            key={task._id} 
                            className={head!=="Inbox" && `task-container ${isHovered ? 'hovered' : ''}`}
                            onMouseEnter={() => onTaskHover(true)}
                            onMouseLeave={() => onTaskHover(false)}
                            onClick={()=>handleTaskClick(task)}
                          >
                            {!editingTask || editingTask._id !== task._id ? (
                              <div className="Container" style={{width: head === "Inbox" && '1100px', marginLeft:head==="Inbox" && '20px' }}>
                                <div className="task">
                                  <div className="task-checkbox">
                                  <label className="custom-radio">
                                      <input
                                        type="radio"
                                        checked={task.selected}
                                        onChange={() => onDeleteTask(task._id)}
                                      />
                                      <span className={`radio-button ${task.priority}`}>
                                      </span>
                                    </label>

                                  </div>
                                  <div className="task-name" >
                                    <strong style={{color:"#534545", fontSize:'23px', fontWeight:'600'}}>{task.title}</strong>
                                  </div>
                                  <div className="buttonLayout hide">
                                    <button
                                      style={{ background: '#f1f1f1' }}
                                      onClick={handleEdit}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                                <p>{task.description}</p>
                                {head=='' ?(<p>{task.time}</p>):(<p >{task.date}</p>)}

                                
                              </div>
                            ) : (
                              <div className="editTask">
                                <form>
                                  <input
                                    type="text"
                                    value={editingTask.title}
                                    onChange={(e) => onEditTitle(e.target.value)}
                                  />
                                  <input
                                    type="text"
                                    value={editingTask.description}
                                    onChange={(e) => onEditDesc(e.target.value)}
                                  />
                                  <select
                                    id="taskPriority"
                                    onChange={(e) =>
                                      onEditTask({ ...editingTask, priority: e.target.value })
                                    }
                                    value={editingTask.priority}
                                  >
                                    <option value="high">P1-Highest</option>
                                    <option value="medium">P2-Medium</option>
                                    <option value="low">P3-Low</option>
                                  </select>
                                  <DueDateCalendar onDateTimeSelected={(date)=> onEditTask({ ...editingTask, dueDate: date})} className="due"/>
                                  <div style={{ display: 'flex' }}>
                                    <input
                                      type="checkbox"
                                      checked={editingTask.recurringTask}
                                      onChange={(e) =>
                                        onEditTask({
                                          ...editingTask,
                                          recurringTask: !editingTask.recurringTask,
                                        })
                                      }
                                      style={{
                                        width: '15px',
                                        height: '15px',
                                        verticalAlign: 'middle',
                                        padding: '10px',
                                      }}
                                    />
                                    <label style={{ padding: '5px 10px' }}>
                                      Add to Recurring Tasks
                                    </label>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                    <button className="cancel-button" onClick={onCancelEdit}>
                                      Cancel
                                    </button>
                                    <button className="save-button" onClick={onUpdateTask}>
                                      Save
                                    </button>
                                  </div>
                                </form>
                              </div>
                            )}
                          </div>
                        ))}
                      </ul>
                    </>
                  )}
              </div>
            ))}
            
          {sortingType !== "Grouping" && (
            <>
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={ `task-container ${isHovered ? 'hovered' : ''}`}
                 
                  onMouseEnter={() => onTaskHover(true)}
                  onMouseLeave={() => onTaskHover(false)}
                  onClick={()=>handleTaskClick(task)}
                >
                       {!editingTask || editingTask._id !== task._id ? (
                        <div className='Container' style={{width: head === "Inbox" && '500px', marginLeft:head==="Inbox" && '20px' , border:'2px solid #f1f1f1'}}>
                                <div className=  "task" >
                                  <div className="task-checkbox" style={{padding:"0px 0px", marginTop:"11px", height:"10px",}}>
                                  <label className="custom-radio">
                                      <input
                                        type="radio"
                                        checked={task.selected}
                                        onChange={() => onDeleteTask(task._id)}
                                      />
                                      <span className={`radio-button ${task.priority}`}>
                                      </span>
                                    </label>
                                  </div>
                                  <div className="task-name" style={{margin:'0px', padding:'0px', paddingTop:'8px'}}>
                                    <strong style={{fontWeight:'800', fontSize:'18px'}}>{task.title}</strong>
                                  </div>
                                  <div className="buttonLayout hide">
                                    <button
                                      style={{ background: '#f1f1f1' }}
                                      onClick={() => onEditTask(task)}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                                <div style={{marginLeft:'30px'}}>
                                {task.description!=='' &&(<p >{task.description}</p>)}
                                
                                { (
                                  <p style={{ color: task.due === 'Due' ? 'red' : task.due === 'Today' ? 'green' : 'blue', fontWeight:'100', fontSize:'12px' , fontFamily:'sans-serif'}}>
                                    {task.date} {task.time} 
                                  </p>
                                ) }

                                </div>
                              </div>
                            ) : (
                              <div className='task-container'>
                                <form style={{marginLeft:'20px'}}>
                                  <input
                                    className='addInput'
                                    
                                    style={{color:'black', border:'none'}}
                                    type="text"
                                    value={editingTask.title}
                                    onChange={(e) => onEditTitle(e.target.value)}
                                  />
                                  <input
                                    type="text" 
                                    className='addInput'
                                    style={{border:'none'}}
                                    value={editingTask.description}
                                    onChange={(e) => onEditDesc(e.target.value)}
                                  />
                                 
                                  <section style={{display:'flex', padding:head==="Index"?'30px':'0px', width:'150px', height:'40px'}}>
                                  <select style={{width:'80px',marginRight:head==="Index"?'40px':'0px', height:'30px',color:'black', background:'#f1f1f1'}}
                                    id="taskPriority"
                                    onChange={(e) =>
                                      onEditTask({ ...editingTask, priority: e.target.value })
                                    }
                                    value={editingTask.priority}
                                  >
                                    <option value="high">P1</option>
                                    <option value="medium">P2</option>
                                    <option value="low">P3</option>
                                  </select>
                                  {/* <DueDateCalendar onDateTimeSelected={handleDateTimeSelected} className="due"/> */}
                                  <DueDateCalendar onDateTimeSelected={(date)=> onEditTask({ ...editingTask, dueDate: date})} className="due"/>
                                </section>
                                  <div style={{ display: 'flex', justifyContent:'space-between' }}>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input 
                                      type="checkbox"
                                      checked={editingTask.recurringTask}
                                    
                                      onChange={(e) =>
                                        onEditTask({
                                          ...editingTask,
                                          recurringTask: !editingTask.recurringTask,
                                        })
                                      }
                                      style={{
                                        display:'inline',
                                        width: '15px',
                                        height: '15px',
                                        verticalAlign: 'middle',
                                        padding: '10px',
                                      }}
                                    />
                                    <label style={{marginLeft:'5px' }}>
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
                                    onClick={onCancelEdit}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    style={{
                                      padding: '6px',
                                      background: '#00D2B8',
                                      color: '#fff',
                                    }}
                                    onClick={onUpdateTask}
                                  >
                                  Save
                                  </button>
                                </div>
                                  </div>
                                 

                                </form>
                              </div>
                            )}
                </div>
              ))}
            </>
          )}
           {head==="" &&(<div > {/*  className='add-task-button' */}
                <Task fetchTasks={fetchTasks}/>
            </div>)}
        </div>
        </div>
      )}
     {head==="Inbox" &&(<div>
      <CustomSection user={user}/>
     </div>)}

    </div>
  );
};

export default TaskSection;

          