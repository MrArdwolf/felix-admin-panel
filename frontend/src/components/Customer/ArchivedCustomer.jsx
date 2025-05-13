import React, { useState, useEffect } from 'react'
import Part from '../Part/ArchivedCustomerPart';

export default function Customer(props) {
  const customer = props.archived;
  const [open, setOpen] = useState(false);
  const [markedParts, setMarkedParts] = useState(customer.parts);
  const [customPartPrice, setCustomPartPrice] = useState(customer.partPrices);
  const [openParts, setOpenParts] = useState(false);

  return (
    <div>
      <h2>{customer.name}</h2>
      <span><button onClick={() => { setOpen(!open) }}>open</button></span>
      {open && (
        <div>
          <div className="info-container">
            <h3>Info</h3>
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
            <h3>Delar</h3>
            <button onClick={() => { setOpenParts(!openParts) }}>Open parts</button>
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