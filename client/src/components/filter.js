import React, { useState, useRef, useEffect } from 'react'
import './filter.css';

export default function Filter({sortType, sortedType,groupDue, groupToday, groupInbox, groupUp, tasks,displayDue, filterDue, filterUpcoming, filterToday, filterInbox,displayInbox,displayToday, displayUpcoming, dueTasks,upcomingTasks,inbox,onSortPriority, onSortDate, onReset,onGroup, filterOn, sortingType}) {
    const [filterVisible, setFilterVisible] = useState(false);
    const customPriorityOrder=['high', 'medium', 'low'];
    const ref=useRef(null);
    let lists=[];
    let filter='';

    const settle=()=>{
      console.log(displayToday, displayDue)
      if(displayDue){
        lists=dueTasks;
        console.log("in UseEffect")
      }
      else if(displayInbox){
        lists=inbox;
        console.log("Ibox")
      } else if(displayUpcoming){
        lists=upcomingTasks;
      } else if(displayToday) {
        // alert("called")
        console.log('wqdkw')
        lists=[...dueTasks,...tasks];
        console.log(lists)
      }
    };

    const action=(sortedTasks)=>{
      if(displayDue){
        // alert(filter);
        if(filter==="Grouping") groupDue(sortedTasks)
        
        else
        filterDue(sortedTasks);
      }
      else if(displayInbox){
        // lists=inbox;
        // alert(filter)
        if(filter==="Grouping") {groupInbox(sortedTasks);}
        else  filterInbox(sortedTasks);
      } else if(displayUpcoming){
        if(filter==="Grouping") groupUp(sortedTasks);
        else filterUpcoming(sortedTasks);
        // lists=upcomingTasks;
      } else {
        // lists=[...dueTasks,...tasks];
        
      }
      if(displayToday) {
        console.log("uqgsugwqsiuwd")
        if(filter==="Grouping") groupToday(sortedTasks);
       
        else {console.log(sortedTasks);filterToday(sortedTasks);}
      }
    }

    const sortPriority=async ()=>{
     settle()
     sortingType("priority");
     filter="priority";
     console.log(lists.length, tasks.length)


      if(sortType==='Grouping'){

      }  else{
        const sortedItems = [...lists].sort((a,b)=>{
          const aOrder=customPriorityOrder.indexOf(a.priority);
          const bOrder=customPriorityOrder.indexOf(b.priority);
          if(aOrder===-1) return 1;
          if(bOrder===-1) return -1;
          return aOrder-bOrder;
      });
      console.log(sortedItems);
      action(sortedItems);
      // onSortPriority(sortedItems);
      filterOn();
      }
    }
   
    const handleTasksByGroupP=()=>{
      settle();
      sortingType('Grouping');
      filter="Grouping";
      console.log(lists.length);
      const highPriorityTasks=lists.filter(task=>task.priority==='high');
      const mediumPriorityTasks=lists.filter(task=>task.priority==='medium');
      const lowPriorityTasks=lists.filter(task=>task.priority==='low');
      
      const priorityGroup={
        'Priority 1':highPriorityTasks,
        'Priority 2':mediumPriorityTasks,
        'Priority 3':lowPriorityTasks
      }
      // onGroup(priorityGroup);
      console.log()
      action(priorityGroup);
      console.log(priorityGroup);
    }

    const handleTasksByGroupDue = () => {
      settle();
      sortingType('Grouping');
    //  setFilter('Grouping');
      filter="Grouping";
      const dueGroup = {};
      const currDate = new Date();
    
      lists.forEach((task) => {
        const dueDate = new Date(task.dueDate);
    
        const timeDiff = dueDate - currDate;
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const dayOfWeek = dueDate.toLocaleString('en-US', { weekday: 'long' });
        const month = (dueDate.toLocaleString('en-US', { month: 'long' })).slice(0, 3);
    
        const date = dueDate.getDate();
        const year = dueDate.getFullYear();
        let groupKey;
        if(daysRemaining<=1){
          groupKey='Today';
        }
        else if (daysRemaining < 2) {
          groupKey = ` Tomorrow`;
        } else if (daysRemaining < 8) {
          groupKey = `${date} ${month} ${dayOfWeek}`;
        } else {
          groupKey = `${date} ${month} ${year}`;
        }
    
        if (!dueGroup[groupKey]) {
          dueGroup[groupKey] = [];
        }
        dueGroup[groupKey].push(task);
      });
    
      let sortKeys = Object.keys(dueGroup);
      console.log("hi")
    
      sortKeys.sort((key1, key2) => {
        if(key1.includes("Tomorrow")) return -1;
        if(key2.includes("Tomorrow")) return -1;
        const taskDate1 = new Date(key1);
      
        const taskDate2 = new Date(key2);
        const leftDays1 = Math.abs(taskDate1 - currDate);
        const leftDays2 = Math.abs(taskDate2 - currDate);
    
        return leftDays1 - leftDays2;
      });
    
      const sortedDueGroup = {};
      sortKeys.forEach((key) => {
        sortedDueGroup[key] = dueGroup[key];
      });
    
      console.log("sorted",sortedDueGroup);
    
      // onGroup(sortedDueGroup);
      action(sortedDueGroup)
    };
    

    const sortByDate = () => {
      settle();
    filter="dueDate";
    console.log(lists.length,tasks.length)
      
      const sortedDate = lists.slice().sort((task1, task2) => {
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
        // Return 0 if the dates are equal
        return 0;
      });
    
      action(sortedDate);
      filterOn();
      sortingType("dueDate");
    };
    
     const resetTasks = ()=>{
        onReset();
     }
     const toggleFilter = () => {
        setFilterVisible(!filterVisible);
      }

    
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (filterVisible && ref.current && !ref.current.contains(event.target)) {
          setFilterVisible(false);
        }
      }

        document.addEventListener('click', handleClickOutside, true);

      return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  },[]);
      

     return (
        <div className="filter-container">
        
        <button className="filterButton" onClick={toggleFilter}>Filter</button>
        {filterVisible && (
          <div className="filter-popup" ref={ref} style={{ display: filterVisible ? 'block' : 'none' }}>
            <div className="filter-popup-content">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ textAlign: 'left', marginBottom: '5px' }}>Sort</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>Sorting</label>
                  <button  onClick={sortPriority}>
                    Priority
                  </button>
                  <button  onClick={sortByDate}>
                    Due Date
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '5px' }}>
                  <label>Grouping</label>
                  <button onClick={handleTasksByGroupP}>Priority</button>
                  <button onClick={handleTasksByGroupDue}>Due Date</button>
                </div>
              </div>
  
              <hr />
              <div>
                <h3 style={{ textAlign: 'left', marginBottom: '5px' }}>View</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Completed tasks</span>
                </div>
              </div>
              <hr></hr>
              <button style={{display:'flex'}} onClick={resetTasks}>Reset all</button>
            </div>
          </div>
        )}
      </div>
    );
      
}

