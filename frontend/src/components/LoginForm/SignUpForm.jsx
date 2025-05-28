import React, { useState } from 'react'
import './LoginForm.scss'
import axios from 'axios'


export default function SignUpForm() {

  const backend = import.meta.env.VITE_API_URL

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [masterPassword, setMasterPassword] = useState('');

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setMasterPassword('');
  }

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    axios.post(`${backend}/api/user/auth/register`, {
      username,
      password,
      masterPassword
    })
      .then(res => {
        console.log(res.data);
        alert("User registered successfully");
        resetForm();
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <form action="" className="SignUpForm">
      <div className="inputs">
        <div className="input-row">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="input-row">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="input-row">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input type="password" id="confirm-password" placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <div className="input-row">
          <label htmlFor="master-password">Master Password:</label>
          <input type="password" id="master-password" placeholder='Master Password' value={masterPassword} onChange={(e) => setMasterPassword(e.target.value)} required />
        </div>
      </div>
      <button className='primary-button' onClick={handleSignUp}>Sign Up</button>
    </form>
  )
}