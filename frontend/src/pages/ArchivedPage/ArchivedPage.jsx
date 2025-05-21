import React, { useEffect, useState } from 'react'
import ArchivedCustomer from '../../components/Customer/ArchivedCustomer';
import axios from 'axios';
import './ArchivedPage.scss'

export default function ArchivedPage() {
  const backend = import.meta.env.VITE_API_URL
  const [archivedCustomers, setArchivedCustomers] = useState([]);
  const [parts, setParts] = useState([]);
  useEffect(() => {
    updateParts();
    updateCustomers();
  }, []);

  const updateParts = () => {
    axios.get(`${backend}/api/part/get`)
    .then(res => {
      console.log(res.data);
      setParts(res.data);
    })
    .catch(err => {
      console.log(err);
        if (err.status == 401) {
          props.authenticate(updateParts);
        }
    })
  }

  const updateCustomers = () => {

    
    axios.get(`${backend}/api/archived/get`)
    .then(res => {
      console.log(res.data);
      setArchivedCustomers(res.data);
    })
    .catch(err => {
      console.log(err);
        if (err.status == 401) {
          props.authenticate(updateCustomers);
        }
    })

    
  }

  return (
    <div className='archived-page'>
      <h1>Arkiverade Kunder</h1>

      <div className="archived-list">
        {archivedCustomers.map(archived => {
          return (
            <ArchivedCustomer key={archived._id} archived={archived} parts={parts} update={update} authenticate={() => { props.authenticate() }}/>
          )
        })}
      </div>
    </div>
  )
}