import React, { useState, useEffect } from 'react';
import './Alert.css'; 

function App({message, notify, undo, off}) {
  return (
    <div className="App">
      {notify && (
        <div className="notification overlay">
          <div className="notification-content">
            {message}  <button style={{background:"black"}} onClick={undo}>Undo</button>
            <button onClick={off} style={{background:'black', marginLeft:'3px'}}>-</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
