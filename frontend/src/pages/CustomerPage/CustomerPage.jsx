import React, { useEffect, useState } from 'react'
import Customer from '../../components/Customer/Customer';
import axios from 'axios';
import './CustomerPage.scss'

export default function CustomerPage(props) {
  const backend = import.meta.env.VITE_API_URL
  const [customers, setCustomers] = useState([]);

  const [parts, setParts] = useState([]);
  const [connectedCustomerList, setConnectedCustomerList] = useState([]);
  const [nonConnectedCustomers, setNonConnectedCustomers] = useState([]);
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

  // Update connectedCustomerList whenever customers changes
  useEffect(() => { 
    const tempConnectedCustomerList = [];
    customers.forEach(customer => {
      if (customer.customerConnection && customer.customerConnection.length > 0) {
        const connectedCustomers = handleRenderCustomerConnection(customer._id);
        tempConnectedCustomerList.push(connectedCustomers);
      }
    });
    setConnectedCustomerList(tempConnectedCustomerList);

    // Flatten all connected customers into a set
    const connectedIds = new Set(tempConnectedCustomerList.flat().map(c => c._id));
    const nonConnected = customers.filter(c => !connectedIds.has(c._id));
    setNonConnectedCustomers(nonConnected);
  }, [customers]);

  const handleRenderCustomerConnection = (customerId) => {
    const customersConnectedToCustomer = []
    const customer = customers.find(c => c._id === customerId);
    customersConnectedToCustomer.push(customer);

    customer.customerConnection.forEach(connectionId => {
      const connectedCustomer = customers.find(c => c._id === connectionId);
      if (connectedCustomer) {
        customersConnectedToCustomer.push(connectedCustomer);
        // console.log(customersConnectedToCustomer);
      }
    });
    return customersConnectedToCustomer;

  }



  return (
    <div className="customer-page">
      <h1>Kunder</h1>

      <div className="customer-list">
        {connectedCustomerList.map((customerGroup, idx) => (
          <div className="customer-connection" key={idx}>
            <h3>{customerGroup[0].name} {customerGroup.map(customer => customer.bikeNumber).join(", ")}</h3>
            {customerGroup.map(customer => (
              <Customer key={customer._id} customer={customer} parts={parts} allParts={parts} update={update} authenticate={() => { props.authenticate() }} setAlert={props.setAlert} nonConnectedCustomers={nonConnectedCustomers} customers={customers} connectedCustomerList={connectedCustomerList} />
            ))}
          </div>
        ))}
      </div>

      <div className="customer-list">
        {nonConnectedCustomers.map(customer => {
          if (customer.customerConnection.length > 0) {
            return null;
          }
          return (
            <Customer key={customer._id} customer={customer} parts={parts} allParts={parts} update={update} authenticate={() => { props.authenticate() }} setAlert={props.setAlert} nonConnectedCustomers={nonConnectedCustomers} customers={customers} connectedCustomerList={connectedCustomerList} />
          )
        })}
      </div>
    </div>
  )
}