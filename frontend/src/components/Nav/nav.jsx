import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Nav.scss'

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation();
  const { pathname } = location;

  if (pathname === "/") {
    return (
      <div className="menu-container">
        <nav>
          <Link to="/parts">Delar</Link>
          <Link to="/customers">Kunder</Link>
          <Link to="/archive">Arkiverade Kunder</Link>
          <Link to="/form">Formulär</Link>
          <Link to="/logout">Logga ut</Link>
        </nav>
      </div>
    )
  }

  return (
    <div className="menu-container">
      {isOpen ? (
        <div className="menu-open">
          <span onClick={() => { setIsOpen(!isOpen) }}><ion-icon name="close"></ion-icon></span>
          <nav>
            <Link to="/parts" onClick={() => { setIsOpen(!isOpen) }}>Delar</Link>
            <Link to="/customers" onClick={() => { setIsOpen(!isOpen) }}>Kunder</Link>
            <Link to="/archive" onClick={() => { setIsOpen(!isOpen) }}>Arkiverade Kunder</Link>
            <Link to="/form" onClick={() => { setIsOpen(!isOpen) }}>Formulär</Link>
            <Link to="/logout" onClick={() => { setIsOpen(!isOpen) }}>Logga ut</Link>
          </nav>
        </div>
      ) : (
        <div className="menu-closed">
          <span onClick={() => { setIsOpen(!isOpen) }}><ion-icon name="menu"></ion-icon></span>
        </div>
      )}
    </div>
  )
}