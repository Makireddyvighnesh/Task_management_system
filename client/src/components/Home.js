import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import EditTask from './editTask.js';
import Filter from './filter.js';
import Task from './addTask.js';
import Search from './search.js';
import './Home.css';
import Sidebar from './sidebar.js';
import Progress from './Progress.js';
import TaskSection from './TaskSection.js';
import App from './Alert/App.js'
// import Navbar from './Navbar.js';

function TaskList() { 
  const [user, setUser]=useState(null);
  const [allTasks, setAllTasks]=useState([]);
  const [undo, setUndo]=useState([]);
  const [tasks, setTasks] = useState([]);
  const [inbox, setInbox]=useState([]);
  const [futureTasks, setFutureTasks]=useState([]);
  const [daily, setDaily]=useState(0);
  const [weekly,setWeekly]=useState(0);
  const [dueTasks, setDueTasks]=useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
  const [tasksCompleted, setTasksCompleted]=useState(0);
  const [editingTask, setEditingTask] = useState('');
  const [dailyGoal, setDailyGoal]=useState(0);
  const [weeklyGoal, setWeeklyGoal]=useState(0);
  const [sortType, setSortType]=useState(()=>{
    const storedType=localStorage.getItem('type');
    return storedType?JSON.parse(storedType):{sortedType:"default"};
  })

  const [fillter, setFilter] =useState(()=>{
    const storedFilter = localStorage.getItem('filter');
    return storedFilter?JSON.parse(storedFilter):{state:false};
    });

    const [displayToday, setDisplayToday]=useState(true);
    const [displayUpcoming, setDisplayUpcoming]=useState(false);
    const [displayDue, setDisplayDue]=useState(false);
    const [displayInbox, setDisplayInbox]=useState(false);

    useEffect(()=>{
      localStorage.setItem('filter', JSON.stringify(fillter));
      },[fillter])

  useEffect(()=>{
    const name = localStorage.getItem('userToken');
    if (name) {
        const User = JSON.parse(name);
        setUser(User);
        if (User && User.token) {
           fetchTasks();
        }
    }
  },[])

  const handleSortType=(type)=>{
    setSortType({sortedType:type});
     console.log(sortType);
  }

 useEffect(()=>{
  localStorage.setItem('type',JSON.stringify(sortType));
 },[sortType])


 const sortTasksByPriority = (tasks) => {
  const customPriorityOrder = ['high', 'medium', 'low'];
  return [...tasks].sort((a, b) => {
    const aOrder = customPriorityOrder.indexOf(a.priority);
    const bOrder = customPriorityOrder.indexOf(b.priority);

    if (aOrder === -1) return 1;
    if (bOrder === -1) return -1;
    return aOrder - bOrder;
  });
};

const [message, setMessage]=useState('');
const [notify, setNotify]=useState(false);

const off=()=>{
  setNotify(false);
}

const sortByDueDate= (tasks) => {
  return [...tasks].slice().sort((task1, task2) => {
    const date1 = new Date(task1.dueDate);
    const date2 = new Date(task2.dueDate);

    if (isNaN(date1) || isNaN(date2)) {
      return 0;
    }

    if (date1.getFullYear() !== date2.getFullYear()) {
      return date1.getFullYear() - date2.getFullYear();
    }

    if (date1.getMonth() !== date2.getMonth()) {
      return date1.getMonth() - date2.getMonth();
    }

    if (date1.getDate() !== date2.getDate()) {
      return date1.getDate() - date2.getDate();
    }

    if (date1.getHours() !== date2.getHours()) {
      return date1.getHours() - date2.getHours();
    }

    if (date1.getMinutes() !== date2.getMinutes()) {
      return date1.getMinutes() - date2.getMinutes();
    }

    if (date1.getSeconds() !== date2.getSeconds()) {
      return date1.getSeconds() - date2.getSeconds();
    }

    return 0;
  });
};


const handleTasksByGroupP=(tasks)=>{
      console.log("called ")
  const highPriorityTasks=tasks.filter(task=>task.priority==='high');
  const mediumPriorityTasks=tasks.filter(task=>task.priority==='medium');
  const lowPriorityTasks=tasks.filter(task=>task.priority==='low');
  
  const priorityGroup={
    'Priority 1':highPriorityTasks,
    'Priority 2':mediumPriorityTasks,
    'Priority 3':lowPriorityTasks
  }
  console.log(priorityGroup);
  return priorityGroup;
}

// const oneDayTasks = (tasks) => {
//   console.log("ondDayTasks",tasks)
//   const currDate = new Date();
//   const startOfToday = new Date(currDate);
//   startOfToday.setHours(0, 0, 0, 0); // Set to the beginning of today (12:00 AM)
//   const endOfToday = new Date(currDate);
//   endOfToday.setHours(23, 59, 59, 999); // Set to the end of today (11:59 PM)

//   const newTasks = tasks.filter(task => {
//       const dueDate = new Date(task.dueDate);
//       console.log(`${dueDate} >= ${startOfToday} && ${dueDate} <= ${endOfToday}`)
//       return dueDate >= startOfToday && dueDate <= endOfToday;
//   });
//   console.log("newTasks", newTasks);

//   return newTasks;
// }

const fetchTasks = async () => {
  const User = localStorage.getItem('userToken');
  if (!User) {
    return;
  }
  const token = JSON.parse(User);
  try {
    const response = await axios.get('http://localhost:8080/api/tasks', {
      headers: {
        'Authorization': `Bearer ${token.token}`
      }
    });
    console.log("response is", response.data);
    setTasksCompleted(response.data.tasksCompleted);

    response.data.recurTasks.map(task => {
      task.completed = false;
    });
    setDailyGoal(response.data.dailyGoal);
    setWeeklyGoal(response.data.weeklyGoal);
    setDaily(response.data.daily);
    setWeekly(response.data.weekly);

    let sortedTasks;
    // const oneDay = await oneDayTasks([...response.data.tasks]);
    const fetchedTasks = [...response.data.tasks, ...response.data.recurTasks];
    console.log(fetchedTasks)
    if (fillter.state) {
      if (sortType.sortedType === 'priority' || sortType.sortedType === "Grouping") {
        setSortType({sortedType:"priority"});
        sortedTasks = sortTasksByPriority(fetchedTasks);
      } else if (sortType.sortedType === "dueDate") {
        sortedTasks = sortByDueDate(fetchedTasks);
        console.log(sortedTasks, "sorted tasks");
      } else if (sortType.sortedType === "Grouping") {
        sortedTasks = fetchedTasks;
        console.log("before");
        setGroupedTasks(handleTasksByGroupP(sortedTasks));
        console.log("after");
      }
    } else {
      sortedTasks = fetchedTasks;
    }

    const currDate = new Date();
    const dueTasks = [];
    const todayTasks = [];
    const upcomingTasks = [];
    
    sortedTasks.forEach((task) => {
      if (!task.completed) {
        const dueDate = new Date(task.dueDate);
    
        const isDueToday = dueDate.toDateString() === currDate.toDateString();
        const isDueTimePassed = dueDate <= currDate;
    
        if (dueDate < currDate || (isDueToday && isDueTimePassed)) {
          task.due="Due";
          dueTasks.push({ ...task});
        } else if (isDueToday) {
          task.due="Today"
          todayTasks.push({ ...task });
        } else {
          upcomingTasks.push(task);
        }
      }
    });
    // if(dueTasks.length>0) {setDisplayDue(true);}
    
    setInbox([...sortedTasks])
    console.log("Due tasks are", dueTasks.map(task => task.title));
    console.log("Other tasks are", todayTasks.map(task => task.title));
    console.log("upcoming tasks are", upcomingTasks.map(task => task.title));
    // const oneDay=await oneDayTasks([...otherTasks]);
    // console.log("oneDay", oneDay);
    setDueTasks(dueTasks)
    setTasks(todayTasks); 
    setFutureTasks(upcomingTasks);
   
    // console.log("Due tasks are", dueTasks);
    // console.log("Other tasks are", otherTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

const closeNotification=()=>{
  setMessage('');
  setNotify(false);
}

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      const userToken=localStorage.getItem('userToken');
      if(!userToken){
        console.log("User is not authenticated");
        return;
      }
      const token=JSON.parse(userToken);
      const response = await axios.put(`http://localhost:8080/api/tasks/${editingTask._id}`, editingTask,{
        headers:{
          'Authorization':`Bearer ${token.token}`,
        },
      });
      const updatedTasks = tasks.map(task => task._id === editingTask._id ? response.data : task);
      // setTasks(updatedTasks)
      await fetchTasks()
      .then(()=>{
        setEditingTask(null);
        setMessage("Task is Updated.")
        setNotify(true);
        setTimeout(() => {
          closeNotification();
        }, 10000); 
      })
      
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const onDeleteTask = async (taskId) => {
    console.log("taskID is",taskId)
    
    try {
      const userToken=localStorage.getItem('userToken');
      if(!userToken){
        console.log("User is not authenticated");
        return;
      }
      const token=JSON.parse(userToken);
      const response=await axios.delete(`http://localhost:8080/api/tasks/${taskId}`,{
        headers:{
          'Authorization':`Bearer ${token.token}`,
        },
      });
      await fetchTasks();
      console.log(response)
      if(response.status===200){

        setTasks(prevTasks=>prevTasks.filter(task=>task._id!==taskId));
        setMessage("Task is deleted.")
          setNotify(true);
          setUndo(response.data.task)
          console.log("response.data.task",response.data.task);
          setTimeout(() => {
            closeNotification();
        }, 10000); 

      }
      else{
        console.error('Error  task', response);
      }
      console.log(tasks)
     
      
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const undoTask=async()=>{
    
    const userToken=localStorage.getItem('userToken');
    if(!userToken){
      console.log("User is not authenticated");
      return;
    }
    const token=JSON.parse(userToken);
  
    try {
      const response=await axios.put('http://localhost:8080/api/tasks/undo',{undo},{ headers:{
        'Authorization':`Bearer ${token.token}`,
      },})
      if(response.status==200) fetchTasks();
      setNotify(false)
      console.log("Response after undo is", response);
    } catch (error) {
      console.log(error);
    }
  }
  const addTaskList = (newTaskList) => {
    setTasks(newTaskList);
    fetchTasks();
  };
  const handleSortPriority=(sortedItems)=>{
    setTasks(sortedItems);
    setFilter({state:true});
  }
  const handleDateSort = (sortedDate)=>{
    setTasks(sortedDate)
    setFilter({state:true});

  }

  const handleEditTitle=(value)=> setEditingTask({ ...editingTask, title: value })
  const handleEditDesc=(value)=> setEditingTask({ ...editingTask, description: value })

  const handleReset = () => {
    setFilter({ state: false });
  };
  
  useEffect(() => {
    console.log(fillter.state)
    if (fillter.state === false) {
      fetchTasks();
    }
  }, [fillter.state]);
  
 const handleCancel=()=>{
  setEditingTask(null);
 }
 const [isHovered, setIsHovered] = useState(false);
  const handleTaskHover = (hovered) => {
    setIsHovered(hovered);
  };
  
  const onEditTask=(task)=>{
    setEditingTask(task)
  }
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeToggle=()=>{
    setSidebarOpen(!isSidebarOpen);
  }

  const showDue=()=>{
    setDisplayDue(true);
    setDisplayToday(false);
    setDisplayUpcoming(false);
    setDisplayInbox(false);
  }

  const showToday=()=>{
    setDisplayToday(true);
    setDisplayDue(false)
    setDisplayInbox(false);
    setDisplayUpcoming(false);

  }

  const all=()=>{
    setDisplayInbox(true);
    setDisplayDue(false);
    setDisplayToday(false);
    setDisplayUpcoming(false);
  }

  const showUpcoming=()=>{
    setDisplayUpcoming(true);
    setDisplayDue(false);
    setDisplayToday(false);
    setDisplayInbox(false);
  }

  const [isAddTaskPopupOpen, setAddTaskPopupOpen] = useState(false);

  
  const filterDue=(tasks)=>{
    setDueTasks(tasks);
  }

  const filterUpcoming=(tasks)=>{

    setFutureTasks(tasks);
  }

  const filterInbox=(tasks)=>{
    setInbox(tasks);
  }

  const filterToday=(tasks)=>{
    console.log(tasks)
    setTasks(tasks);
  }

  const [groupedInbox,setGroupedInbox]=useState({});
  const [groupedToday,setGroupedToday]=useState({});
  const [groupedDue,setGroupedDue]=useState({});
  const [groupedUp,setGroupedUp]=useState({});

  const groupDue=(tasks)=>{
    setGroupedDue(tasks);
  }
  const groupInbox=(tasks)=>{
    setGroupedInbox(tasks);
    console.log("12oeu1i2", groupedInbox)
  }
  const groupToday=(tasks)=>{
    setGroupedToday(tasks);
  }
  const groupUp=(tasks)=>{
    setGroupedUp(tasks);
  }

  return (
    <div>
    
       <div>
      <div className='play' >
        <div className={` app ${isSidebarOpen ? 'sidebar-open' : ''}`} style={{display:'flex', position:'static'}}>
            <div style={{marginTop:"13px",paddingRight:'4px'}}>
              <button style={{background:'#f1f1f1'}} onClick={toggleSidebar}>☰</button>
            </div>
            <Link style={{ textDecoration: 'none', color: 'black',  padding: '12px' }} to='/'>Home</Link>
            <Search  allTasks={allTasks} />
            <Sidebar all={all}  showUpcoming={showUpcoming} showDue={showDue} today={showToday} close={closeToggle} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} il={inbox.length} dl={dueTasks.length} tl={tasks.length} fl={futureTasks.length}/>
        </div>
        <div style={{ display: 'flex'}}>
          <Link style={{ textDecoration: 'none', color: 'black', paddingRight: '20px', paddingTop: '9px' }} to='/create'>
            Groups
          </Link>
          <Filter
          sortedType={sortType.sortedType}
          groupDue={groupDue} groupToday={groupToday} groupUp={groupUp} groupInbox={groupInbox}
            displayDue={displayDue}
            displayInbox={displayInbox}
            displayToday={displayToday}
            displayUpcoming={displayUpcoming}
            sortType={sortType}
            inbox={inbox}
            tasks={tasks}
            dueTasks={dueTasks} filterDue={filterDue}  filterUpcoming={filterUpcoming} filterInbox={filterInbox} filterToday={filterToday}
            upcomingTasks={futureTasks}
            onSortPriority={handleSortPriority}
            onSortDate={handleDateSort}
            onGroup={setGroupedTasks}
            onReset={handleReset}
            filterOn={() => setFilter({ state: true })}
            sortingType={handleSortType}
          />
          <Task symbol="plus" fetchTasks={fetchTasks} sectionName="" atNav="center"/>
          <Progress weeklyGoal={weeklyGoal} dailyGoal={dailyGoal} weekly={weekly} tasksCompleted={tasksCompleted} daily={daily}/>
        </div>
      </div>
      {/* {tasks.length === 0 &&  dueTasks.length===0 && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <span>Enjoy your day. No tasks were assigned.</span>
        </div>
      )} */}
      <div style={{ display: 'flex', width:dueTasks.length>0 && tasks.length>0 ? '60%':'30%' }}>

{dueTasks.length>0 && displayDue &&(  <div style={{ flex: '1', marginRight: '10px' }}>
    <TaskSection
      tasks={dueTasks}
      head="Reschedule"
      user={user}
      groupedTasks={groupedDue}
      fetchTasks={fetchTasks}
      sortingType={sortType.sortedType}
      onEditTask={onEditTask}
      onDeleteTask={onDeleteTask}
      onEditTitle={handleEditTitle}
      onUpdateTask={updateTask}
      onEditDesc={handleEditDesc}
      onCancelEdit={handleCancel}
      onTaskHover={handleTaskHover}
      editingTask={editingTask}
      isHovered={isHovered}
    />
  </div>)}

  {  displayToday &&(<div style={{ flex: '1' }}>
    <TaskSection
      tasks={tasks}
      head=""
      user={user}
      groupedTasks={groupedToday}
      fetchTasks={fetchTasks}
      sortingType={sortType.sortedType}
      onEditTask={onEditTask}
      onDeleteTask={onDeleteTask}
      onEditTitle={handleEditTitle}
      onUpdateTask={updateTask}
      onEditDesc={handleEditDesc}
      onCancelEdit={handleCancel}
      onTaskHover={handleTaskHover}
      editingTask={editingTask}
      isHovered={isHovered}
    />
  </div>)}

  {  displayInbox &&(<div style={{ flex: '1' }}>
    <TaskSection
      tasks={inbox}
      head="Inbox"
      user={user}
      groupedTasks={groupedInbox}
      fetchTasks={fetchTasks}
      sortingType={sortType.sortedType}
      onEditTask={onEditTask}
      onDeleteTask={onDeleteTask}
      onEditTitle={handleEditTitle}
      onUpdateTask={updateTask}
      onEditDesc={handleEditDesc}
      onCancelEdit={handleCancel}
      onTaskHover={handleTaskHover}
      editingTask={editingTask}
      isHovered={isHovered}
    />
  </div>)}

  {  displayUpcoming &&(<div style={{ flex: '1' }}>
    <TaskSection
      tasks={futureTasks}
      head="Upcoming"
      user={user}
      groupedTasks={groupedUp}
      fetchTasks={fetchTasks}
      sortingType={sortType.sortedType}
      onEditTask={onEditTask}
      onDeleteTask={onDeleteTask}
      onEditTitle={handleEditTitle}
      onUpdateTask={updateTask}
      onEditDesc={handleEditDesc}
      onCancelEdit={handleCancel}
      onTaskHover={handleTaskHover}
      editingTask={editingTask}
      isHovered={isHovered}
    />
  </div>)}
</div>
    {notify && (<App message={message} notify={notify} undo={undoTask} off={off}/>)}
    </div>
    </div>
  );
}

export default TaskList;


                        {/* { task.daysLeft >1 && ( <span style={{color:'darkred'}}>{task.daysLeft} days left</span>)}
                        { task.daysLeft<=1 && task.daysLeft>=0 && task.timeLeft>0 &&( <span style={{color:'darkred'}}>{task.timeLeft} hours time left</span>)}
                        {task.timeLeft===0 && (<span  style={{color:'red'}}>{task.minutesLeft} Minutes left</span>)}
                        { task.due &&( <span style={{color:'red'}}>Due </span>)} */}