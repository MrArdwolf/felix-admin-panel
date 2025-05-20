import React, { useState, useEffect } from 'react'
import Part from '../Part/ArchivedCustomerPart';
import './Customer.scss'

export default function Customer(props) {
  const customer = props.archived;
  const [open, setOpen] = useState(false);
  const [markedParts, setMarkedParts] = useState(customer.parts);
  const [customPartPrice, setCustomPartPrice] = useState(customer.partPrices);
  const [openParts, setOpenParts] = useState(false);

  return (
    <div className="customer">
      <div className="customer-top">
        <h2>{customer.name}</h2>
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
                        page={"customer"}
                        markedParts={markedParts}
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
        </div>
      )}
    </div>
  )
}