import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import Nav from '../Nav/nav'

export default function Header(props) {
  const location = useLocation();
  const { pathname } = location;

  if (pathname === "/") {
    return (
      <header>
        <h1>App Name</h1>
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
          <Link to="/auth">Log in</Link>
        }
      </header>
    )
  }

