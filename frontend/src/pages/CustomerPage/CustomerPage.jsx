import React, { useEffect, useState } from 'react'
import Customer from '../../components/Customer/Customer';
import axios from 'axios';
import './CustomerPage.scss'
import SmsModal from '../../components/SmsModal/SmsModal';

export default function CustomerPage(props) {
  const backend = import.meta.env.VITE_API_URL
  const [customers, setCustomers] = useState([]);

  const [parts, setParts] = useState([]);
  const [connectedCustomerList, setConnectedCustomerList] = useState([]);
  const [nonConnectedCustomers, setNonConnectedCustomers] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [openSmsModal, setOpenSmsModal] = useState(false);
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

  const archiveCustomer = (customerGroup) => {
    customerGroup.forEach(customer => {
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
          deleteCustomer(customer);
        })
        .catch(err => {
          console.log(err);
          if (err.status == 401) {
            props.authenticate(archiveCustomer);
          }
        })
    });

  }

  const deleteCustomer = (customer) => {
    axios.delete(`${backend}/api/customer/${customer._id}`)
      .then(res => {
        console.log(res.data);
        update();
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate(deleteCustomer);
        }
      })
  }

  const sendPriceSMS = (customerGroup) => {
    const messageArray = [`Hej, vi har nu kollat över era cyklar och här är vad vi rekommenderar att göra. Om allt är ok med er så kommer vi påbörja arbetet och återkomma när den är klar. Betalning sker när cyklarna är redo att hämtas.%0A%0AAtt göra/byta:%0A%0A`];
    const CGTotalPrice = [0];

    customerGroup.forEach((customer, index) => {
    console.log(customer);
    // Get marked parts with quantity
    const thingsToFix = customer.parts.map(mp => {
      const part = parts.find(p => p._id === mp._id);
      if (!part) return null;
      const changedPrice = customer.partPrices.find(_part => _part.id === part._id);
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

    CGTotalPrice.push(totalPrice);
    console.log(customer);
    const message = `Cykel ${customer.bikeDescription}: ${thingsToFixFormated}%0A%0ATotalpris delar: ${totalPrice}kr%0A%0A%0A`;
    messageArray.push(message);
    });

    console.log(CGTotalPrice);

    messageArray.push(`Totalpris ${CGTotalPrice.reduce((a, b) => a + b, 0)}kr%0A%0A%0A/Felix Cykelmeck`)

    window.open(`sms:${(customerGroup[0].phone)}?body=${messageArray.join("")}`)

    props.setAlert({
      show: true,
      message: `prisförslag skickad`,
      type: "task"
    })
  }

  const sendDoneSMS = (locks, customerGroup) => {
    const locksToUse = locks.map((lock, index) => {
      const formattedLock = `${customerGroup[index].bikeDescription} - kod ${lock.lock}`;
      return formattedLock;
    });

    console.log(locksToUse);

    let message = `Hej, cyklarna är nu redo att hämtas. Om du swishar till 1233740875 så ställer vi ut cyklarna bakom staketet. Hoppas du är nöjd med servicen och om du vill får du gärna lämna en recension på Google😊 Koden till låsen är:%0A%0A${locksToUse.join("%0A")}%0A%0A%0Ahttps://g.page/r/CYBOBRAf1c9oEAE/review/%0A%0A%0AFelix Cykelmeck`;

    if (locks.filter(lock => lock.lock && lock.lock !== "nothing").length === 0) {
      message = `Hej, cyklarna är nu redo att hämtas. Om du swishar till 1233740875 så ställer vi ut cyklarna bakom staketet. Hoppas du är nöjd med servicen och om du vill får du gärna lämna en recension på Google😊 %0A%0A%0Ahttps://g.page/r/CYBOBRAf1c9oEAE/review/%0A%0A%0AFelix Cykelmeck`;
    }


    console.log(message);


    window.open(`sms:${(customerGroup[0].phone)}?body=${message}`)

    props.setAlert({
      show: true,
      message: `Klart besked skickad`,
      type: "task"
    })
  }



  return (
    <div className="customer-page">
      <h1>Kunder</h1>

      <div className="customer-list">
        {connectedCustomerList.map((customerGroup, idx) => (
          <div className="customer-connection" key={idx}>
            <div className="customer-group-top">
            <h3>{customerGroup[0].name} {customerGroup.map(customer => customer.bikeNumber).join(", ")}</h3>
            <span className='buttons-menu' onClick={() => setShowButtons(!showButtons)}>{showButtons ? <ion-icon name="close"></ion-icon> : <ion-icon name="ellipsis-horizontal"></ion-icon>}</span>
            </div>
            {showButtons && (
              <div className="buttons-dropdown">
                <button className='primary-button' onClick={() => archiveCustomer(customerGroup)}>Arkivera</button>
                <button className='primary-button' onClick={() => { setOpenSmsModal(true) }}>SMS</button>
                {openSmsModal &&
                  <SmsModal customerGroup={customerGroup} sendPriceSMS={sendPriceSMS} sendDoneSMS={sendDoneSMS} closeModal={() => { setOpenSmsModal(false) }} />
                }
              </div>
            )}
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