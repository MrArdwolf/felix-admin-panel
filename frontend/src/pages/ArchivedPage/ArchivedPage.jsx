import React, { useEffect, useState } from 'react'
import ArchivedCustomer from '../../components/Customer/ArchivedCustomer';
import axios from 'axios';
import './ArchivedPage.scss'

export default function ArchivedPage(props) {
  const backend = import.meta.env.VITE_API_URL
  const [archivedCustomers, setArchivedCustomers] = useState([]);
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
        if (err.status === 401) {
          props.authenticate(update);
        }
    })
  }

  const updateCustomers = () => {

    console.log("Updating archived customers");
    axios.get(`${backend}/api/archived/get`)
    .then(res => {
      console.log(res.data);
      setArchivedCustomers(res.data);
    })
    .catch(err => {
      console.log(err);
        if (err.status == 401) {
          props.authenticate(update);
        }
    })

    
  }

  return (
    <div className='archived-page'>
      <h1>Arkiverade Kunder</h1>

      <div className="archived-list">
        {archivedCustomers.map(archived => {
          return (
            <ArchivedCustomer key={archived._id} archived={archived} parts={parts} allParts={parts} update={update} authenticate={() => { props.authenticate() }} setAlert={props.setAlert}/>
          )
        })}
      </div>
    </div>
  )
}