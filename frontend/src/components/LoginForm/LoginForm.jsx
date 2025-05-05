import React, { useState } from 'react'
import './LoginForm.scss'
import axios from 'axios'


export default function LoginForm() {

  const backend = import.meta.env.VITE_API_URL

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backend}/api/user/auth/login`, {
        username,
        password
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form action="" className="SignUpForm">
      <div className="inputs">
        <div className="input-row">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="input-row">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} required />
        </div>
      </div>
      <button onClick={handleSignUp}>Log in</button>
    </form>
  )
}