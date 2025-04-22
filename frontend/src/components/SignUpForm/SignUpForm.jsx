import React from 'react'
import './SignUpForm.scss'


export default function SignUpForm() {
  return (
    <form action="" className="SignUpForm">
      <div className="inputs">
        <div className="input-row">
          <label htmlFor="email">Email:</label>
          <input type="text" id="email" />
        </div>
        <div className="input-row">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" />
        </div>
        <div className="input-column">
          <div className="input-row">
            <label htmlFor="first-name">First Name:</label>
            <input type="text" id="first-name" />
          </div>
          <div className="input-row">
            <label htmlFor="last-name">Last Name:</label>
            <input type="text" id="last-name" />
          </div>
        </div>
        <div className="input-row">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" />
        </div>
        <div className="input-row">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input type="password" id="confirm-password" />
        </div>
        <div className="input-row">
          <label htmlFor="master-password">Master Password:</label>
          <input type="password" id="master-password" />
        </div>
      </div>
      <button type="submit">Sign Up</button>
    </form>
  )
}