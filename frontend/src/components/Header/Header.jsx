import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './header.scss'
import Nav from '../Nav/nav'
import logo from '../../assets/Logo.avif'

export default function Header(props) {
  const location = useLocation();
  const { pathname } = location;

  if (pathname === "/") {
    return (
      <header>
        <img src={logo} alt="logo" />
      </header>
    )
  }
    return (
      <header>
        <h1>App Name</h1>
        {props.user ?
          <menu>
            <Nav />
          </menu>
          :
          <Link to="/auth"><img src={logo} alt="logo" /></Link>
        }
      </header>
    )
  }

