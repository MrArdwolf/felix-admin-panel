import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function LogoutPage(props) {
  const backend = import.meta.env.VITE_API_URL
  const navigate = useNavigate()
  useEffect(() => {
    axios.get(`${backend}/api/user/auth/logout`)
    .then(res => {
      console.log(res)
        props.setAlert({
          show: true,
          message: `Du är nu utloggad`,
          type: "task"
        })
        navigate('/auth')
    })
    .catch(err => {
      console.log(err)
    })
  }, [])
  return (
    <div>Loggar ut...</div>
  )
}