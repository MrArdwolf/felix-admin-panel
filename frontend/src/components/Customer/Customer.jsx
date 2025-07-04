import React, { useState, useEffect } from 'react'
import Part from '../Part/CustomerPart';
import axios from 'axios';
import './Customer.scss'
import SmsModal from '../SmsModal/SmsModal';

export default function Customer(props) {
  const backend = import.meta.env.VITE_API_URL
  const customer = props.customer;
  const [open, setOpen] = useState(false);
  const [markedParts, setMarkedParts] = useState(customer.parts || []);
  const [customPartPrice, setCustomPartPrice] = useState(customer.partPrices || []);
  const [openParts, setOpenParts] = useState(false);
  const [openSmsModal, setOpenSmsModal] = useState(false);
  const [priceAccepted, setPriceAccepted] = useState(customer.priceAccepted || false);
  const [showButtons, setShowButtons] = useState(false);

  const saveChanges = () => {
    console.log(priceAccepted)
    axios.patch(`${backend}/api/customer/${customer._id}`, {
      parts: markedParts,
      partPrices: customPartPrice,
      priceAccepted: priceAccepted
    })
      .then(res => {
        console.log(res.data);
        props.update();
        props.setAlert({
          show: true,
          message: `${customer.name} ${customer.bikeNumber} sparad`,
          type: "success"
        })
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate(saveChanges);
        }
      })
  }

  const archiveCustomer = () => {
    axios.post(`${backend}/api/archived/add`,
      customer
    )
      .then(res => {
        console.log(res.data);
        props.setAlert({
          show: true,
          message: `${customer.name} ${customer.bikeNumber} arkiverad`,
          type: "success"
        })
        deleteCustomer();
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate(archiveCustomer);
        }
      })
  }

  const deleteCustomer = () => {
    axios.delete(`${backend}/api/customer/${customer._id}`)
      .then(res => {
        console.log(res.data);
        props.update();
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate(deleteCustomer);
        }
      })
  }

  const sendPriceSMS = () => {
    console.log(customer);
    const thingsToFix = props.parts.filter(part => markedParts.includes(part._id));
    const thingsToFixWithChangedPrice = thingsToFix.map(part => {
      const changedPrice = customPartPrice.find(_part => _part.id === part._id);
      return {
        ...part,
        price: changedPrice ? parseInt(changedPrice.price) : part.price
      }
    })

    const totalPrice = thingsToFixWithChangedPrice.reduce((total, part) => total + part.price, 0);

    const thingsToFixFormated = thingsToFixWithChangedPrice.map(part => {
      return part.name + " " + part.price + "kr";
    }).join(', ');

    const message = `Hej, vi har nu kollat över er cykel och här är vad vi rekommenderar att göra. Om allt är ok med er så kommer vi påbörja arbetet och återkomma när den är klar. Betalning sker när cykeln är redo att hämtas.%0A%0AAtt göra/byta: ${thingsToFixFormated}%0A%0ATotalpris delar: ${totalPrice}kr%0A%0A%0A/Felix Cykelmeck`;

    console.log(totalPrice);


    window.open(`sms:${parseInt(customer.phone)}?body=${message}`)

    props.setAlert({
      show: true,
      message: `prisförslag skickad`,
      type: "task"
    })
  }

  const sendDoneSMS = (lock) => {
    console.log(customer);

    const message = `Hej, cykeln är nu redo att hämtas. Om du swishar till 1233740875 så ställer vi ut cykeln bakom staketet. Hoppas du är nöjd med servicen och om du vill får du gärna lämna en recension på Google😊 Koden till låset är ${lock}%0A%0A%0Ahttps://g.page/r/CYBOBRAf1c9oEAE/review/%0A%0A%0AFelix Cykelmeck`;

    console.log(message);


    window.open(`sms:${parseInt(customer.phone)}?body=${message}`)

    props.setAlert({
      show: true,
      message: `Klart besked skickad`,
      type: "task"
    })
  }



  return (
    <div className="customer">
      <div className="customer-top">
        <h2>{customer.name} {customer.bikeNumber}</h2>
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
          <div className="price-accept">
            <h3>Pris godkänd</h3>
            <input type="checkbox" name="priceAccepted" id="" checked={priceAccepted} onChange={() => setPriceAccepted(!priceAccepted)} />
          </div>

          <div className="buttons">
            <button className='primary-button' onClick={saveChanges}>Spara</button>
            <span className='buttons-menu' onClick={() => setShowButtons(!showButtons)}>{showButtons ? <ion-icon name="close"></ion-icon> : <ion-icon name="ellipsis-horizontal"></ion-icon>}</span>
          </div>
          {showButtons && (
            <div className="buttons-dropdown">
              <button className='primary-button' onClick={archiveCustomer}>Arkivera</button>
              <button className='primary-button' onClick={() => { setOpenSmsModal(true) }}>SMS</button>
              {openSmsModal &&
                <SmsModal customer={customer} sendPriceSMS={sendPriceSMS} sendDoneSMS={sendDoneSMS} closeModal={() => { setOpenSmsModal(false) }} />
              }
            </div>
          )}
        </div>
      )}
    </div>
  )
}