import React, { useEffect, useState } from 'react'
import Customer from '../../components/Customer/Customer';
import axios from 'axios';
import './CustomerPage.scss'

export default function CustomerPage() {
  const backend = import.meta.env.VITE_API_URL
  const [customers, setCustomers] = useState([]);
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

    
    axios.get(`${backend}/api/customer/get`)
    .then(res => {
      console.log(res.data);
      setCustomers(res.data);
    })
    .catch(err => {
      console.log(err);
    })

    
  }

  return (
    <div className="customer-page">
      <h1>Kunder</h1>

      <div className="customer-list">
        {customers.map(customer => {
          return (
            <Customer key={customer._id} customer={customer} parts={parts} update={update}/>
          )
        })}
      </div>
    </div>
  )
}