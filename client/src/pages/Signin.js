import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8080/api/user/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
    } else {
      setLoggedIn(true);
      navigate('/');
      console.log("Successfully logged in", json);
      localStorage.setItem('userToken', JSON.stringify(json));
    }
  }

  return (
    <div>
      {loggedIn ? (
        <p>You are logged in. Redirecting to home page...</p>
      ) : (
        <form onSubmit={handleSubmit} className='signin'>
          <h2>Sign In</h2>
          <label>Email:</label>
          <input
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <label>Password:</label>
          <input
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button style={{ background: '#5adbb5' }}>Sign In</button>
          {error && <div className='error'>{error}</div>}
        </form>
      )}
    </div>
  );
}
