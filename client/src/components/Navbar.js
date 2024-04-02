import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react'; 
import Profile from '../pages/profile';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Navbar = () => {
  const [user, setUser] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Use useNavigate to programmatically navigate

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('groupName');
    setUser(null);
    setIsLoggedIn(false);
    navigate('/signin'); // Redirect to /signin after logging out
  };
// alert(isLoggedIn)
  useEffect(() => {
    
    const jsonString = localStorage.getItem('userToken');

    if (!jsonString) {
      console.log("Error");
      return;
    }

    const User = JSON.parse(jsonString);
    setUser(User);
    setIsLoggedIn(true);

  }, []);

  return (
    <header>
      <div className='navbar'>
        <Link to='/'>
          <h1>Task Management</h1>
        </Link>
        
        <nav>
          {isLoggedIn ? (
            <div>
        
              <Profile />
              <button onClick={logout}>Sign Out</button>
            </div>
          ) : (
            <div>
              <Link to='/signin'>Sign in</Link>
              <Link to="/signup">Sign up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
