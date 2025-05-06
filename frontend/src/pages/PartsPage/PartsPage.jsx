import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Part from '../../components/Part/Part';



export default function PartsPage(props) {
  const backend = import.meta.env.VITE_API_URL

  const [parts, setParts] = useState([]);

  useEffect(() => {
    update();
  }, [])

  const update = () => {
    axios.get(`${backend}/api/part/get`)
      .then(res => {
        console.log(res.data);
        setParts(res.data);
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate();
        }
      })
  }

  if (!props.user) {
    window.location.href = "/form";
  }

  return (
    <div>PartsPage
      <button onClick={update}>test</button>
      {parts.filter(part => !part.parent).map(part => (
        <Part part={part} key={part._id} />
      ))}
    </div>
  )
}