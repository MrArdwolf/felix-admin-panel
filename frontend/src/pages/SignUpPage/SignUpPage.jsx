import React, { useState } from 'react'
import "./SignUpPage.scss"
import SignUpForm from "../../components/LoginForm/SignUpForm"
import LoginForm from "../../components/LoginForm/LoginForm"
import AlertModal from '../../components/AlertModal/AlertModal'

export default function SignUpPage(props) {
  const [signUp, setSignUp] = useState(false);


  return (
    <div className="sign-up-page">
      <div className="sign-up-page-top">
        <h2>{signUp ? "Skapa konto" : "Logga in"}</h2>
        <p onClick={() => {setSignUp(!signUp)}}>{signUp ? "Logga in" : "Skapa konto"}</p>
      </div>
      {signUp ? <SignUpForm /> : <LoginForm setAlert={props.setAlert} setUser={props.setUser} />}
      <button onClick={() => {
        props.setAlert({
          show: true,
          message: "test alert1",
          type: "success"
        })
        }}>test alert</button>
    </div>
  )
}