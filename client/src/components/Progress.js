import React, { useState, useRef, useEffect } from 'react';

export default function Progress({dailyGoal, weeklyGoal ,weekly,tasksCompleted, daily}) {
  const [progressPopup, setProgressPopup] = useState(false);
  const buttonRef = useRef(null);
  const [user, setUser]=useState('');
  const [Weekly, setWeekly]=useState(false);
  const [Daily, setDaily]=useState(true);
  const [display, setDisplay]=useState(false);
  const {editedGoals, setEditedGoals}=useState({dailyGoal:0, weeklyGoal:0});
  useEffect(()=>{
    const name = localStorage.getItem('userToken');
    if (name) {
        const User = JSON.parse(name);
        setUser(User);
    }
  },[])

  const handlePopup = () => {
    setProgressPopup(!progressPopup);
  }

  const getPopupStyle = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const marginRight = 30; // Define the right margin in pixels
      return {
        position: 'absolute',
        top: buttonRect.bottom + 'px',
        left: buttonRect.left - marginRight + 'px', // Adjust left position for right margin
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '5px solid',
        padding: '10px',
        zIndex: 1,
      };
    }
    return {};
  }

  const updateGoal=async()=>{
    try {
      
    } catch (error) {
      
    }
  }


  const showWeekly=()=>{
    setDaily(false);
    setWeekly(true);
  }

  const showDaily=()=>{
    setWeekly(false);
    setDaily(true);
  }

  const handleEditDaily=(e)=>setEditedGoals({...editedGoals, dailyGoal:e.target.value})

  return (
    <section>
      <div style={{ padding: '1px', marginLeft: '5px' }}>
        <button className='filterButton' onClick={handlePopup} ref={buttonRef}>
          Progress
        </button>
      </div>
      {progressPopup && (
        <div style={getPopupStyle() } >
          <h6>Your Productivity</h6>
          <div style={{display:'flex',fontSize:'12px', justifyContent:"space-between"}}>
            <p >{tasksCompleted} Completed</p>
            <a style={{color:'red'}}>View completed tasks</a>
          </div>
          <hr></hr>
          <div style={{textAlign:'center'}}>
            <button onClick={showDaily} style={{paddingRight:'8px'}}>Daily</button>
            <button onClick={showWeekly}>Weekly</button>
          </div>
          <hr></hr>
          {Daily && (<div style={{textAlign:'center', fontSize:'12px'}}>
            <p style={{margin:'0px'}}>Daily goals completed: <span style={{color:'black', fontSize:'16px', fontWeight:'bold'}}>{daily}/{dailyGoal}</span></p>
            {daily>=5 ?(<p style={{margin:'0px'}}>Well done. {user.userName}!</p>):(<p style={{margin:'0px'}}>Keep going!</p>)}
          
            {!display &&(<button onClick={()=>setDisplay(true)} style={{color:'red'}}>Edit goal</button>)}
            {display && (<form>
            <div style={{textAlign:"left"}}>
              <label style={{display:'inline', fontSize:'13px'}}>EditDailyGoal:</label>
              <input onChange={handleEditDaily} style={{width:'50px', margin:'0px',padding:'0px',height:'25px',borderRightWidth: "0px", borderLeftWidth: "0px", borderTopWidth: "0px",borderBottomWidth: "2px", display:'inline'}} type="text"/>
            </div>
            <div style={{textAlign:"left"}}>
              <label style={{display:'inline', fontSize:'13px'}}>EditWeeklyGoal:</label>
              <input onChange={(e)=>setEditedGoals({...editedGoals, weeklyGoal:e.target.value})} style={{width:'50px',height:'25px', margin:'0px',padding:'0px',borderRightWidth: "0px", borderLeftWidth: "0px", borderTopWidth: "0px",borderBottomWidth: "3px", display:'inline'}} type="text"/>
            </div>
            <button onClick={updateGoal} style={{padding:'3px',background:'green'}}>Save</button>
            </form>)}
          </div>)}

          {Weekly && (<div style={{textAlign:'center', fontSize:'12px'}}>
            <p style={{margin:'0px'}}>Weekly goals completed: <span style={{color:'black', fontSize:'16px', fontWeight:'bold'}}>{weekly}/{weeklyGoal}</span></p>
            {weekly>=30 ?(<p style={{margin:'0px'}}>Well done. {user.userName}!</p>):(<p style={{margin:'0px'}}>Keep going!</p>)}
          
            <button style={{color:'red'}}>Edit goal</button>
          </div>)}
          <hr></hr>
          <div style={{fontSize:'14px', textAlign:'center'}}>
            <p style={{margin:'0px'}}> You've completed your goal 1 day in a row.</p>
            <p style={{margin:'0px'}}>Your longest streak: 3 days</p>
            <p>(21 Sep 2023 - 25 Sep 2023)</p>
      
          </div>
        </div>
      )}
    </section>
  )
}
