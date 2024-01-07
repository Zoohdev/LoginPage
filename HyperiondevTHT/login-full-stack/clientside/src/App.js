// App.js

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {

          console.log('Username:', username);
          console.log('Password:', password);
          
            const response = await axios.post('http://localhost:3000/login', {
                username,
                password,
            });

            // Store the token securely in local storage
            localStorage.setItem('token', response.data.token);

            // Redirect to index.html page in src folder
            window.location.href = '/index.html';

        } catch (error) {
            console.error(error.response.data.error);
        }
    };

    return (
        <div>
            <h1>Welcome to my page</h1>
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default App;

