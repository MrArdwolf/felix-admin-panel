import React, { useState } from 'react'
import './SignUpForm.scss'
import axios from 'axios'


export default function SignUpForm() {

  const backend = import.meta.env.VITE_API_URL

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [masterPassword, setMasterPassword] = useState('');

  const resetForm = () => {
    setUsername('');
    setFirstName('');
    setLastName('');
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

    console.log(backend);

    try {
      const response = await axios.post(`${backend}/api/user/auth/register`, {
        username,
        firstName,
        lastName,
        password,
        masterPassword
      });
      console.log(response.data);
      alert("User registered successfully");
      resetForm();
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
        <div className="input-column">
          <div className="input-row">
            <label htmlFor="first-name">First Name:</label>
            <input type="text" id="first-name" onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="input-row">
            <label htmlFor="last-name">Last Name:</label>
            <input type="text" id="last-name" onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>
        <div className="input-row">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="input-row">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input type="password" id="confirm-password" onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <div className="input-row">
          <label htmlFor="master-password">Master Password:</label>
          <input type="password" id="master-password" onChange={(e) => setMasterPassword(e.target.value)} required />
        </div>
      </div>
      <button onClick={handleSignUp}>Sign Up</button>
    </form>
  )
}