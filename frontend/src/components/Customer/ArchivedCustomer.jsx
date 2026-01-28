import React, { useState, useEffect } from 'react'
import Part from '../Part/ArchivedCustomerPart';
import './Customer.scss'
import axios from 'axios';

export default function Customer(props) {
  const backend = import.meta.env.VITE_API_URL
  const customer = props.archived;
  const [open, setOpen] = useState(false);
  const [markedParts, setMarkedParts] = useState(customer.parts);
  const [customPartPrice, setCustomPartPrice] = useState(customer.partPrices);
  const [openParts, setOpenParts] = useState(false);
  const [showAllParts, setShowAllParts] = useState(false);
  const timeCreated = new Date(customer.createdAt);
  const [mechanicComments, setMechanicComments] = useState(customer.mechanicComments || "");

  const getReceipt = () => {
    axios.get(`${backend}/api/receipt/get/${customer._id}`)
      .then(res => {
        console.log(res.data);
        props.setAlert({
          show: true,
          message: `Kvitto för ${customer.name} hämtat`,
          type: "success"
        })
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate(getReceipt);
        }
      })
  }

  const recreateCustomer = () => {
    axios.post(`${backend}/api/customer/recreate`, 
      customer
    )
      .then(res => {
        console.log(res.data);
        props.setAlert({
          show: true,
          message: `Kund ${customer.name} återskapad`,
          type: "success"
        })
        deleteArchivedCustomer();
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate(recreateCustomer);
        }
      })
  }

  const deleteArchivedCustomer = () => {
    axios.delete(`${backend}/api/archived/${customer._id}`)
      .then(res => {
        console.log(res.data);
        props.update();
        props.setAlert({
          show: true,
          message: `Arkiverad kund ${customer.name} raderad`,
          type: "success"
        })
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate(deleteArchivedCustomer);
        }
      })
  }

  return (
    <div className="customer">
      <div className="customer-top">
        <h2>{customer.name} {timeCreated.toLocaleDateString()}</h2>
        <span onClick={() => { setOpen(!open) }} className={`${open ? "open" : ""}`}><ion-icon name="chevron-down-outline"></ion-icon></span>
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
            { customer.comments && (
            <div className="info-line">
              <h4>Kommentar</h4>
              <p>{customer.comments}</p>
            </div>
            )}

            { (customer.partToFix.length > 0 || customer.alsoDo.length > 0) && (
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
            )}

          </div>
          <div className="parts-container">
            <div className="parts-container-top">
              <h3>Delar</h3>
              <span onClick={() => { setOpenParts(!openParts) }} className={`${openParts ? "open" : ""}`}><ion-icon name="chevron-down-outline"></ion-icon></span>
            </div>
            {openParts && (
              <div className="parts-list">
                {
                  props.parts.filter(part => !part.parent).map(part => {
                    return (
                      <Part
                        key={part._id}
                        part={part}
                        allParts={props.allParts}
                        authenticate={props.authenticate}
                        page={"customer"}
                        markedParts={markedParts}
                        setMarkedParts={setMarkedParts}
                        customPartPrice={customPartPrice}
                        setCustomPartPrice={setCustomPartPrice}
                        showAllParts={showAllParts}
                        openParts={openParts}
                      />
                    )
                  })
                }
              </div>
            )}
          </div>
          <div className="mechanic-comments">
            <h3>Dina kommentarer</h3>
            <textarea name="mechanicComments" id="" rows="5" value={mechanicComments} readOnly></textarea>
          </div>
          <div className="buttons">
            <button className='primary-button' onClick={getReceipt}>Kvitto</button>
            <button className='primary-button' onClick={recreateCustomer}>Återskapa</button>
          </div>
        </div>
      )}
    </div>
  )
}