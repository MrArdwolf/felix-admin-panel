import React, { useEffect, useState } from 'react'
import ArchivedCustomer from '../../components/Customer/ArchivedCustomer';
import axios from 'axios';

export default function ArchivedPage() {
  const backend = import.meta.env.VITE_API_URL
  const [archivedCustomers, setArchivedCustomers] = useState([]);
  const [parts, setParts] = useState([]);
  useEffect(() => {
    update();
  }, []);

  const update = () => {
    axios.get(`${backend}/api/part/get`)
    .then(res => {
      console.log(res.data);
      setParts(res.data);
    })
    .catch(err => {
      console.log(err);
    })

    
    axios.get(`${backend}/api/archived/get`)
    .then(res => {
      console.log(res.data);
      setArchivedCustomers(res.data);
    })
    .catch(err => {
      console.log(err);
    })

    
  }

  return (
    <div>
      <h1>Kunder</h1>

      <div className="archived-list">
        {archivedCustomers.map(archived => {
          return (
            <ArchivedCustomer key={archived._id} archived={archived} parts={parts} update={update}/>
          )
        })}
      </div>
    </div>
  )
}