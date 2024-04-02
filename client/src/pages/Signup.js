import React, { useState } from 'react';
import axios from 'axios';

export default function SignUp() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ email: '', password: '', userName: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await axios.post('http://localhost:8080/api/user/signup', {
        email: user.email,
        password: user.password,
        userName: user.userName,
      });

      if (response.status === 200) {
        setLoading(false);
        setUser({ email: '', password: '', userName: '' });
        localStorage.setItem('userToken', JSON.stringify(response.data));
      }
    } catch (error) {
      setLoading(false);
      setError(error.response.data.error);
      setTimeout(() => {
        setError('');
      }, 10000); 
    }
  }

  return (
    <form onSubmit={handleSubmit} className='signup'>
      <h2>Sign Up</h2>
      <label>UserName:</label>
      <input
        type='text'
        onChange={(e) => setUser({ ...user, userName: e.target.value })}
        value={user.userName}
      />
      <label>Email:</label>
      <input
        type='email'
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        value={user.email}
      />
      <label>Password:</label>
      <input
        type='password'
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        value={user.password}
      />
      <button style={{ background: '#5adbb5' }} disabled={loading}>
        Sign Up
      </button>
      {error && <div className='error'> {error}</div>}
    </form>
  );
}
