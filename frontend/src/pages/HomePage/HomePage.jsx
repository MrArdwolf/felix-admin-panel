import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../../components/Nav/nav';
import './HomePage.scss'



export default function HomePage(props) {

  if (!props.user) {
    window.location.href = "/form";
  }


  return (
    <div className="home-page">
      <div className="welcome-container">
        <h1>Välkommen</h1>
        <h1>{props.user.username}</h1>
      </div>
      <Nav/>
    </div>
  )
}