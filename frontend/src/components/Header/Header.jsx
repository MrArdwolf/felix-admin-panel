import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.scss'
import Nav from '../Nav/nav'
import logo from '../../assets/Logo.avif'

export default function Header(props) {
  const location = useLocation();
  const { pathname } = location;

  if (pathname === "/") {
    return (
      <header>
        {/* <h1 className='title'>FELIX CYKELMECK</h1> */}
        <img src={logo} alt="logo" />
      </header>
    )
  }
  return (
    <header>
      {/* <h1 className='title'>FELIX CYKELMECK</h1> */}
      {props.user ?
        <div className="logged-in">
          <menu>
            <Nav />
          </menu>
          <img src={logo} alt="logo" />
        </div>
        :
        <Link to="/auth"><img src={logo} alt="logo" /></Link>
      }
    </header>
  )
}

