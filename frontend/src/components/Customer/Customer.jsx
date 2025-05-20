import React, { useState, useEffect } from 'react'
import Part from '../Part/CustomerPart';
import axios from 'axios';
import './Customer.scss'


export default function Customer(props) {
  const backend = import.meta.env.VITE_API_URL
  const customer = props.customer;
  const [open, setOpen] = useState(false);
  const [markedParts, setMarkedParts] = useState(customer.parts || []);
  const [customPartPrice, setCustomPartPrice] = useState(customer.partPrices || []);
  const [openParts, setOpenParts] = useState(false);

  const saveChanges = () => {
    axios.patch(`${backend}/api/customer/${customer._id}`, {
      parts: markedParts,
      partPrices: customPartPrice
    })
      .then(res => {
        console.log(res.data);
        props.update();
      })
      .catch(err => {
        console.log(err);
      })
  }

  const archiveCustomer = () => {
    axios.post(`${backend}/api/archived/add`,
      customer
    )
      .then(res => {
        console.log(res.data);
        axios.delete(`${backend}/api/customer/${customer._id}`)
          .then(res => {
            console.log(res.data);
            props.update();
          })
          .catch(err => {
            console.log(err);
          })
      })
      .catch(err => {
        console.log(err);
      })
  }

  const sendSMS = () => {
    
  }

  return (
    <div className="customer">
      <div className="customer-top">
        <h2>{customer.name} {customer.bikeNumber}</h2>
        <span><button onClick={() => { setOpen(!open) }}>open</button></span>
      </div>
      {open && (
        <div className='customer-content'>
          <h3>Info</h3>
          <div className="info-content">
            <div className="info-line">
              <h4>Namn</h4>
              <p>{customer.name}</p>
            </div>
            <div className="info-line">
              <h4>Email</h4>
              <p>{customer.email}</p>
            </div>
            <div className="info-line">
              <h4>Mobilnummer</h4>
              <p>{customer.phone}</p>
            </div>
            <div className="info-line">
              <h4>Beskrivning av cykel</h4>
              <p>{customer.bikeDescription}</p>
            </div>
            <div className="info-line">
              <h4>Cykel nummer</h4>
              <p>{customer.bikeNumber}</p>
            </div>

            <div className="info-line">
              <h4>Saker att kolla på</h4>
              {
                customer.partToFix.map(part => {
                  return (
                    <p key={part}>{part}</p>
                  )
                })
              }
              {
                customer.alsoDo.map(part => {
                  return (
                    <p key={part}>{part}</p>
                  )
                })
              }
            </div>

          </div>
          <div className="parts-container">
            <div className="parts-container-top">
              <h3>Delar</h3>
              <button onClick={() => { setOpenParts(!openParts) }}>Open parts</button>
            </div>
            {openParts && (
              <div className="parts-list">
                {
                  props.parts.filter(part => !part.parent).map(part => {
                    return (
                      <Part
                        key={part._id}
                        part={part}
                        authenticate={props.authenticate}
                        page={"customer"} markedParts={markedParts}
                        setMarkedParts={setMarkedParts}
                        customPartPrice={customPartPrice}
                        setCustomPartPrice={setCustomPartPrice}
                      />
                    )
                  })
                }
              </div>
            )}
          </div>
          <div className="buttons">
            <button onClick={archiveCustomer}>Arkivera</button>
            <button onClick={saveChanges}>Save changes</button>
            <a href={`sms:0725161408?body=Hejsan ${customer.name}!%0AHär kommer en prisuppfattning`}>
              <button>Skicka SMS</button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}