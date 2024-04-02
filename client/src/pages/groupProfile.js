import React, { useEffect, useState , useRef} from 'react';
import './profile.css';

function GroupProfile({name}) {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const ref=useRef(null);
      
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
  
  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  return (
    <div className="user-profile" ref={ref}>
      <div className={`group-icon ${isPopupOpen ? 'active' : ''}`} onClick={togglePopup}>
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFzpuh4XFqIEZgiuSAL_N_lG8g77RMbeIuMQ&usqp=CAU" alt="Profile Picture"/>
      </div>
      {isPopupOpen && (
        <div className="group-popup">
          <div className="popup-content">
           <div style={{display:'flex'}}>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFzpuh4XFqIEZgiuSAL_N_lG8g77RMbeIuMQ&usqp=CAU" />
                <h1 style={{fontSize:'20px'}}>{name}</h1>
            </div>
            <span>Front-end Developer</span>
            <p>Help</p>
            <p>Sign out</p>
         </div>
        </div>
      )}
    </div>
  );
}

export default GroupProfile;
