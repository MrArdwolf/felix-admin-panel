import React, { useState } from 'react'
import './LoginForm.scss'
import axios from 'axios'
import { useNavigate, redirect } from 'react-router-dom';


export default function LoginForm(props) {

  const backend = import.meta.env.VITE_API_URL

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    axios.post(`${backend}/api/user/auth/login`, {
      username,
      password
    })
      .then(res => {
        console.log(res.data);
        setLoginSuccess(true);
        props.setUser(res.data.user);
        props.setAlert({
          show: true,
          message: "test alert1",
          type: "success"
        })
        setTimeout(() => {
          navigate('/');
        }, 1000)
      })
      .catch(err => {
        console.log(err);
      })
  }

  if (loginSuccess) {
    return (
      <div className="login-success">
        <h2>Login successful!</h2>
        <p>Redirecting to home page...</p>
      </div>
    )
  }


  return (
    <form action="" className="SignUpForm">
      <div className="inputs">
        <div className="input-row">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" placeholder='Username' onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="input-row">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
        </div>
      </div>
      <button className='primary-button' onClick={handleSignUp}>Log in</button>
    </form>
  )
}