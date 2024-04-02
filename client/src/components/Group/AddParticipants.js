import React, { useState, useEffect } from 'react';
import AddTasks from './AssignTasks';
import axios from 'axios';
import GroupProfile from '../../pages/groupProfile';
import Profile from '../../pages/profile';
import CommentSection from './commentSection';

export default function AddParticipants() {
  const Group=true;
  const [addUserDetails, setAddUserDetails] = useState(false);
  const [userDetails, setUserDetails] = useState({ email: '' });
  const [user, setUser] = useState([]);
  const [addTasks, setAddTasks] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [groupName, setGroupName]=useState('');
  const [admin, setAdmin]=useState('');
  const [isAdmin, setIsAdmin]=useState(false);
  const [you, setYou]=useState('');
  const [showCommentSection, setShowCommentSection] = useState(false);

  // Function to open the comment section
  const openCommentSection = () => {
    setShowCommentSection(true);
  };

  // Function to close the comment section
  const closeCommentSection = () => {
    setShowCommentSection(false);
  };

  useEffect(() => {
    const name = localStorage.getItem('userToken');
    if (name) {
        const gp = JSON.parse(name);
        setYou(gp.userName);
        if (gp.groupName) {
            setGroupName(gp.groupName);
            fetchUsers(); // Call fetchUsers when groupName is set.
        }
    }
  
}, [groupName]);

  const fetchUsers=async()=>{
    console.log("groupName first", groupName);
    try{
      console.log("groupName", groupName);
      const response = await axios.get(`http://localhost:8080/api/group/${groupName}`);
      console.log("response", response.data.users[0].users);
      if(response.status==200){
        console.log(response.data.users[0].admin);
       
        if(you===response.data.users[0].admin){
          setAdmin('you');
          
        } else{
          setAdmin(response.data.users[0].admin)
        }
        setUser(response.data.users[0].users);
      }
    } catch(err){
      console.error(err);
    }
  }

  const handleClick = () => {
    if(admin!==you && admin!=='you'){
      setIsAdmin(true);
    }
    setAddTasks(false);
    setAddUserDetails(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setAddUserDetails(false);
    setIsShow(false); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/group/addUser', {
        groupName,
        userDetails,
      });
      if (response.status === 200) {
        const name = response.data;
        console.log(response.data);
        setUser([...user, response.data]);
        setUserDetails({ email: '' });
      }
      console.log("After adding", user);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddTasks = () => {
    if(admin!==you && admin!=='you'){
      setIsAdmin(true);
    }
    setAddUserDetails(false);
    setAddTasks(true);
    setIsShow(true); // Set isShow to true when clicking "Add Tasks"
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <section className='addParticipants'>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
        <h1>{groupName}</h1>
        {admin==='you' && (<div style={{ margin: '10px 0' }}>
        <button style={{ background: '#f1f1f1', color: 'black' }} onClick={openCommentSection}>
            Comments
          </button>
          <button style={{ background: '#f1f1f1', color: 'black' }} onClick={handleClick}>
            Add Participants
          </button>
          <button style={{ background: '#f1f1f1', color: 'black' }} onClick={handleAddTasks}>
            Add Tasks
          </button>
        </div>)}
        {admin!=='you' && (<div style={{ margin: '10px 0' }}>
        <button style={{ background: '#f1f1f1', color: 'black' }} onClick={openCommentSection}>
            Comments
          </button>
         <button style={{ background: '#f1f1f1', color: 'black' }} onClick={handleClick}>Participants</button>
         <button style={{ background: '#f1f1f1', color: 'black' }} onClick={handleAddTasks}>Tasks</button>
        </div>)}
      </div>

      
      <section>
      {!addTasks && admin && <section style={{display:'flex',justifyContent:'space-between'}}>
         <ul style={{marginRight:'20px'}}>
           <p >{admin}</p>
         </ul>
         <span style={{marginRight:'20px'}}>admin</span>
      </section>}

        {admin!=='you' && !addTasks && <section style={{display:'flex', justifyContent:'space-between'}}>
          <ul style={{marginRight:'20px'}}>
            <span >you</span>
          </ul>
        </section>
        }
        {!addTasks &&
          user
          .filter(User=>User!==you)
          .map((User, index) => (
            <div style={{padding:'5px'}} key={index}>
                <GroupProfile name={User} />
                <p style={{marginLeft:'50px', paddingTop:'10px'}}>{User}</p>
            </div>
          ))}
      </section>

      {user.length === 0 && !addUserDetails && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          No Participants. Click on <span>Add participants</span> to add.
        </div>
      )}

      {!addTasks && !isAdmin && addUserDetails && (
        <form>
          <input
            value={userDetails.email}
            onChange={(e) => setUserDetails({ email: e.target.value })}
            placeholder='Enter the user mail id:'
          />
          <div>
            <button onClick={handleCancel} style={{ background: 'red' }}>
              Cancel
            </button>
            <button onClick={handleSubmit} style={{ background: 'green' }}>
              Submit
            </button>
          </div>
        </form>
      )}

      {addTasks && !addUserDetails && (
    <section>
        <AddTasks isAdmin={isAdmin} addTask={addTasks} isShow={isShow} setIsShow={setIsShow} />
    </section>
    )}

    {showCommentSection && (
        <div className="modal-container">
          <div className="modal-background" onClick={closeCommentSection}></div>
          <CommentSection onClose={closeCommentSection} />
        </div>
      )}

    </section>
  );
}
