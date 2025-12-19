import React, { useState, useEffect, use } from 'react'
import Part from '../Part/CustomerPart';
import axios from 'axios';
import './Customer.scss'
import SmsModal from '../SmsModal/SmsModal';

export default function Customer(props) {
  const backend = import.meta.env.VITE_API_URL
  const [customer, setCustomer] = useState(props.customer);
  const [open, setOpen] = useState(false);
  const [markedParts, setMarkedParts] = useState(customer.parts || []);
  const [customPartPrice, setCustomPartPrice] = useState(customer.partPrices || []);
  const [openParts, setOpenParts] = useState(false);
  const [showAllParts, setShowAllParts] = useState(false);
  const [openSmsModal, setOpenSmsModal] = useState(false);
  const [priceAccepted, setPriceAccepted] = useState(customer.priceAccepted || false);
  const [priceSent, setPriceSent] = useState(customer.priceSent || false);
  const [bikeDone, setBikeDone] = useState(customer.bikeDone || false);
  const [showButtons, setShowButtons] = useState(false);
  const [mechanicComments, setMechanicComments] = useState(customer.mechanicComments || "");
  const [groupedCustomerIds, setGroupedCustomerIds] = useState(customer.customerConnection || []);
  const [openGroupSelect, setOpenGroupSelect] = useState(false);
  const [editCustomerInfo, setEditCustomerInfo] = useState(false);


  const saveChanges = () => {
    setShowAllParts(false);
    console.log(priceAccepted)
    console.log(groupedCustomerIds);
    console.log(priceSent);
    axios.patch(`${backend}/api/customer/${customer._id}`, {
      parts: markedParts,
      partPrices: customPartPrice,
      priceAccepted: priceAccepted,
      priceSent: priceSent,
      bikeDone: bikeDone,
      mechanicComments: mechanicComments,
      customerConnection: groupedCustomerIds,
      customerInfo: {
        email: customer.email,
        phone: customer.phone
      }
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
  };

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

  const priceFormating = () => {
    const thingsToFix = markedParts.map(mp => {
      const part = props.parts.find(p => p._id === mp._id);
      if (!part) return null;
      const changedPrice = customPartPrice.find(_part => _part.id === part._id);
      return {
        ...part,
        price: changedPrice ? parseInt(changedPrice.price) : part.price,
        quantity: mp.quantity
      };
    }).filter(Boolean);

    const totalPrice = thingsToFix.reduce((total, part) => total + part.price * part.quantity, 0);

    const thingsToFixFormated = thingsToFix.map(part => {
      return "x" + part.quantity + " " + part.name + " " + (part.price * part.quantity) + "kr";
    }).join(', ');

    return { thingsToFixFormated, totalPrice };
  }

  const sendPriceSMS = () => {
    console.log(customer);

    const { thingsToFixFormated, totalPrice } = priceFormating();

    const message = `Hej, vi har nu kollat över er cykel och här är vad vi rekommenderar att göra. Om allt är ok med er så kommer vi påbörja arbetet och återkomma när den är klar. Betalning sker när cykeln är redo att hämtas.%0A%0AAtt göra/byta: ${thingsToFixFormated}%0A%0ATotalpris delar: ${totalPrice}kr%0A%0A%0A/Felix Cykelmeck`;

    console.log(totalPrice);

    window.open(`sms:${(customer.phone)}?body=${message}`)

    props.setAlert({
      show: true,
      message: `prisförslag skickad`,
      type: "task"
    })
  }

  const sendDoneSMS = (lock) => {
    console.log(customer);

    let message = `Hej, cykeln är nu redo att hämtas. Om du swishar till 1233740875 så ställer vi ut cykeln bakom staketet. Hoppas du är nöjd med servicen och om du vill får du gärna lämna en recension på Google😊 Koden till låset är ${lock}%0A%0A%0Ahttps://g.page/r/CYBOBRAf1c9oEAE/review/%0A%0A%0AFelix Cykelmeck`;

    if (lock === "nothing") {
      message = `Hej, cykeln är nu redo att hämtas. Om du swishar till 1233740875 så ställer vi ut cykeln bakom staketet. Hoppas du är nöjd med servicen och om du vill får du gärna lämna en recension på Google😊 %0A%0A%0Ahttps://g.page/r/CYBOBRAf1c9oEAE/review/%0A%0A%0AFelix Cykelmeck`;
    }


    console.log(message);


    window.open(`sms:${(customer.phone)}?body=${message}`)

    props.setAlert({
      show: true,
      message: `Klart besked skickad`,
      type: "task"
    })
  }

  const priceAcceptedIndication = () => {
    if (bikeDone) {
      return "bike-done";
    } else if (priceAccepted) {
      return "price-accepted";
    } else if (priceSent === true && !priceAccepted) {
      return "price-acceptance-pending";
    } else {
      return "";
    }
  }


  return (
    <div className={`customer ${priceAcceptedIndication()}`}>
      <div className="customer-top">
        <h2>{customer.name} {customer.bikeNumber}</h2>
        <span onClick={() => { setOpen(!open) }} className={`primary-button ${open ? "open" : ""}`}><ion-icon name="chevron-down-outline"></ion-icon></span>
      </div>
      {open && (
        <div className='customer-content'>
          <div className="customer-info-top">
            <h3>Info</h3>
            <div className="right">
              <span onClick={() => { setEditCustomerInfo(!editCustomerInfo) }} className='primary-button' >{editCustomerInfo ? <ion-icon name="close-outline"></ion-icon> : <ion-icon name="pencil-outline"></ion-icon>}</span>
            </div>
          </div>
          <div className="info-content">
            <div className="info-line">
              <h4>Namn</h4>
                <p>{customer.name}</p>
            </div>
            <div className="info-line">
              <h4>Email</h4>
              {editCustomerInfo ? (
                <input type="text" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
              ) : (
                <p>{customer.email}</p>
              )}
            </div>
            <div className="info-line">
              <h4>Mobilnummer</h4>
              {editCustomerInfo ? (
                <input type="text" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
              ) : (
                <p>{customer.phone}</p>
              )}
            </div>
            <div className="info-line">
              <h4>Beskrivning av cykel</h4>
                <p>{customer.bikeDescription}</p>
            </div>
            <div className="info-line">
              <h4>Cykel nummer</h4>
                <p>{customer.bikeNumber}</p>
            </div>
            {customer.comments && (
              <div className="info-line">
                <h4>Kommentar</h4>
                <p>{customer.comments}</p>
              </div>
            )}

            {(customer.partToFix.length > 0 || customer.alsoDo.length > 0) && (
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
              <div className="right">
                <span onClick={() => { setShowAllParts(!showAllParts) }} className='primary-button' >{showAllParts ? <ion-icon name="close-outline"></ion-icon> : <ion-icon name="pencil-outline"></ion-icon>}</span>
                <span onClick={() => { setOpenParts(!openParts) }} className={`primary-button ${openParts ? "open" : ""}`}><ion-icon name="chevron-down-outline"></ion-icon></span>
              </div>
            </div>
            {openParts && (
              <div className="parts-list">
                {!showAllParts && !markedParts || !showAllParts && markedParts.length === 0 && (
                  <p>Inga delar valda</p>
                )}
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
          <div className="total-price">
            <h3>Total pris: {priceFormating().totalPrice} kr</h3>
          </div>

          {(!props.connectedCustomerList.flat().includes(customer) || customer.customerConnection.length > 0) &&
            <div className="group-together-customers">
              <div className="group-together-customers-top">
                <h3>Gruppera kunder</h3>
                <span onClick={() => { setOpenGroupSelect(!openGroupSelect) }} className={`primary-button ${openGroupSelect ? "open" : ""}`}><ion-icon name="chevron-down-outline"></ion-icon></span>
              </div>
              {openGroupSelect && (
                <div className="group-together-customers-list">
                  {props.customers
                    .filter(c => c._id !== customer._id)
                    .filter(c => {
                      // Show if in same group as current customer, or not in any group
                      const isInSameGroup = props.connectedCustomerList.some(group => group.some(groupCustomer => groupCustomer._id === customer._id) && group.some(groupCustomer => groupCustomer._id === c._id));
                      const isInOtherGroup = props.connectedCustomerList.some(group => !group.some(groupCustomer => groupCustomer._id === customer._id) && group.some(groupCustomer => groupCustomer._id === c._id));
                      return isInSameGroup || !isInOtherGroup;
                    })
                    .map(c => {
                      const checked = groupedCustomerIds.includes(c._id);
                      return (
                        <div className="input-row" key={c._id}>
                          <label htmlFor={c._id}>{c.name} {c.bikeNumber}</label>
                          <input
                            type="checkbox"
                            name={c._id}
                            id={c._id}
                            checked={checked}
                            onChange={e => {
                              setGroupedCustomerIds(prev => {
                                if (e.target.checked) {
                                  return [...prev, c._id];
                                } else {
                                  return prev.filter(id => id !== c._id);
                                }
                              })
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          }

          <div className="mechanic-comments">
            <h3>Dina kommentarer</h3>
            <textarea name="mechanicComments" id="" rows="5" value={mechanicComments} onChange={(e) => setMechanicComments(e.target.value)} placeholder='Skriv dina kommentarer här...'></textarea>
          </div>
          <div className="price-accept">
            <h3>Pris godkänd</h3>
            <input type="checkbox" name="priceAccepted" id="" checked={priceAccepted} onChange={() => setPriceAccepted(!priceAccepted)} />
          </div>
          <div className="price-accept">
            <h3>Pris SMS skickat</h3>
            <input type="checkbox" name="priceSent" id="" checked={priceSent} onChange={() => setPriceSent(!priceSent)} />
          </div>
          <div className="price-accept">
            <h3>Cykel klar</h3>
            <input type="checkbox" name="bikeDone" id="" checked={bikeDone} onChange={() => setBikeDone(!bikeDone)} />
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