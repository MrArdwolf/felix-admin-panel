import React, { useEffect, useState } from 'react'
import axios from 'axios';



export default function Part(props) {
  const backend = import.meta.env.VITE_API_URL
  const { part } = props;
  const [children, setChildren] = useState([]);

  useEffect(() => {
    update();
  }, [])

  const update = () => {
    if (part.children && part.children.length >= 1) {
      console.log(part);
      axios.get(`${backend}/api/part/get/${part._id}`)
        .then(res => {
          console.log(res.data);
          setChildren(res.data);
        })
        .catch(err => {
          console.log(err);
          if (err.status == 401) {
            props.authenticate();
          }
        })
    }

  }

  if (part.children && part.children.length >= 1) {

    return (
      <div>
        <h3>{part.name}</h3>
        {children.map(child => (
          <Part part={child} key={child._id} />
        ))}
      </div>
    )
  }

  return (
    <div>
      <h3>{part.name}</h3>
    </div>
  )
}