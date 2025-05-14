import React, { useEffect } from 'react'
import axios from 'axios'

export default function LogoutPage() {
  const backend = import.meta.env.VITE_API_URL
  useEffect(() => {
    axios.get(`${backend}/api/user/auth/logout`)
    .then(res => {
      console.log(res)
      window.location.href = "/"
    })
    .catch(err => {
      console.log(err)
    })
  }, [])
  return (
    <div>LogoutPage</div>
  )
}