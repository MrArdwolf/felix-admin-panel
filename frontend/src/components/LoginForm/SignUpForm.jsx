import React, { useState } from 'react'
import './LoginForm.scss'
import axios from 'axios'


export default function SignUpForm(props) {

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
        props.setAlert({
          show: true,
          message: "Passwords do not match",
          type: "error",
        })
      return;
    }

    axios.post(`${backend}/api/user/auth/register`, {
      username,
      password,
      masterPassword
    })
      .then(res => {
        console.log(res.data);
        props.setAlert({
          show: true,
          message: "User registerd successfully",
          type: "success"
        })
        resetForm();
      })
      .catch(err => {
        console.log(err);
        if (err.response.data.error === "Missing data") {
          props.setAlert({
            show: true,
            message: "Fyll i alla fält",
            type: "error"
          })
        } else if (err.response.data.error === "username all ready in use") {
          props.setAlert({
            show: true,
            message: "Användarnamnet är upptaget",
            type: "error"
          })
        } else if (err.response.data.error === "Master not defined") {
          props.setAlert({
            show: true,
            message: "Huvudlösenord saknas",
            type: "error"
          })
        } else if (err.response.data.error === "Master password incorrect") {
          props.setAlert({
            show: true,
            message: "Huvudlösenordet är inkorrekt",
            type: "error"
          })
        } else {
          props.setAlert({
            show: true,
            message: "Något gick fel",
            type: "error"
          })
        }
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