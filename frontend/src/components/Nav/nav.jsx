import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav>
      <Link to="/parts">Delar</Link>
      <Link to="/customers">Kunder</Link>
      <Link to="/archive">Arkiverade Kunder</Link>
      <Link to="/form">Formulär</Link>
      <Link to="/">Logga ut</Link>
    </nav>
  )
}