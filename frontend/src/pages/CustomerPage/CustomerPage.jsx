import React, { useEffect, useState } from 'react'
import Customer from '../../components/Customer/Customer';
import axios from 'axios';
import './CustomerPage.scss'

export default function CustomerPage(props) {
  const backend = import.meta.env.VITE_API_URL
  const [customers, setCustomers] = useState([]);
  const [parts, setParts] = useState([]);
  useEffect(() => {
    update();
  }, []);

  const update = () => {
    updateCustomers();
    updateParts();
  }

  const updateParts = () => {
    axios.get(`${backend}/api/part/get`)
    .then(res => {
      console.log(res.data);
      setParts(res.data);
    })
    .catch(err => {
      console.log(err);
        if (err.status == 401) {
          props.authenticate(update);
        }
    })
  }

  const updateCustomers = () => {
    
    axios.get(`${backend}/api/customer/get`)
    .then(res => {
      console.log(res.data);
      setCustomers(res.data);
    })
    .catch(err => {
      console.log(err);
        if (err.status == 401) {
          props.authenticate(update);
        }
    })

    
  }

  return (
    <div className="customer-page">
      <h1>Kunder</h1>

      <div className="customer-list">
        {customers.map(customer => {
          return (
            <Customer key={customer._id} customer={customer} parts={parts} update={update} authenticate={() => { props.authenticate() }} setAlert={props.setAlert} />
          )
        })}
      </div>
    </div>
  )
}