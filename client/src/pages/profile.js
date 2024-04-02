import React, { useEffect, useState , useRef} from 'react';
import './profile.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Profile() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [userName, setUserName]=useState('');
  const ref=useRef(null);
  const navigate = useNavigate(); // Use useNavigate to programmatically navigate

      
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (isPopupOpen && ref.current && !ref.current.contains(event.target)) {
          setPopupOpen(false);
        }
      }

        document.addEventListener('click', handleClickOutside, true);

      return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  },[]);

  useEffect(()=>{
    console.log("Called fetch tasks")
    const name = localStorage.getItem('userToken');
    if (name) {
        const User = JSON.parse(name);
        setUserName(User);
      
    }
  },[]);

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('groupName');
    navigate('/signin'); // Redirect to /signin after logging out
  };
  
  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  return (
    <div className="user-profile" ref={ref} style={{marginLeft:'70px'}}>
      <div className={`profile-icon ${isPopupOpen ? 'active' : ''}`} onClick={togglePopup}>
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFzpuh4XFqIEZgiuSAL_N_lG8g77RMbeIuMQ&usqp=CAU" alt="Profile Picture"/>
      </div>
      {isPopupOpen && (
        <div className="profile-popup">
          <div className="popup-content">
           <div style={{display:'flex'}}>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFzpuh4XFqIEZgiuSAL_N_lG8g77RMbeIuMQ&usqp=CAU" />
                <h1 style={{fontSize:'20px'}}>{userName.userName}</h1>
            </div>
            <span>Front-end Developer</span>
            <p>Help</p>
            <button onClick={logout}>Sign out</button>
         </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
