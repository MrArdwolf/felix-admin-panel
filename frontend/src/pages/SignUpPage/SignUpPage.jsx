import React, { useState } from 'react'
import "./SignUpPage.scss"
import SignUpForm from "../../components/LoginForm/SignUpForm"
import LoginForm from "../../components/LoginForm/LoginForm"

export default function SignUpPage() {
  const [signUp, setSignUp] = useState(false);


  return (
    <div className="sign-up-page">
      <div className="sign-up-page-top">
        <h2>{signUp ? "Skapa admin konto" : "Logga in"}</h2>
        <p onClick={() => {setSignUp(!signUp)}}>{signUp ? "Logga in" : "Skapa konto"}</p>
      </div>
      {signUp ? <SignUpForm /> : <LoginForm />}
    </div>
  )
}