import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Part from '../../components/Part/Part';
import './PartsPage.scss'



export default function PartsPage(props) {
  const backend = import.meta.env.VITE_API_URL

  const [parts, setParts] = useState([]);
  const [addButton, setAddButton] = useState(true);
  const [partName, setPartName] = useState("");
  const [partPrice, setPartPrice] = useState("");

  useEffect(() => {
    update();
  }, [])

  const update = () => {
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

  if (!props.user) {
    window.location.href = "/form";
  }

  const openAddPart = () => {
    setAddButton(!addButton);
  }

  const addPart = (e) => {
    e.preventDefault();
    axios.post(`${backend}/api/part/add`, {
      name: partName,
      price: partPrice,
    })
      .then(res => {
        console.log(res.data);
        update();
        setPartName("");
        setPartPrice("");
        setAddButton(true);
        props.setAlert({
          show: true,
          message: `${partName} tillagd`,
          type: "success"
        })
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate(addPart);
        } else if (err.response.data.error === "Missing data") {
          props.setAlert({
            show: true,
            message: "Fyll i alla fält",
            type: "error"
          })
        } else {
          props.setAlert({
            show: true,
            message: "Något gick fel",
            type: "error"
          })
        }
      })
  }

  return (
    <div className='parts-page'>
      
      <h1>Delar/Uppgifter</h1>
      <div className="parts-container">
        <div className="add-part">

          <div className="add-top">
            <h3>Lägg till</h3>
            <span className='primary-button' onClick={openAddPart}>{addButton ? <ion-icon name="add-outline"></ion-icon> : <ion-icon name="close-outline"></ion-icon>}</span>
          </div>
          {addButton ? null :
            <div className="add-part-form">
              <div className="input-row">
                <label htmlFor="name">Namn</label>
                <input type="text" name="name" id="name" placeholder='Namn' value={partName} onChange={(e) => { setPartName(e.target.value) }} />
              </div>
              <div className="input-row">
                <label htmlFor="price">Pris</label>
                <input type="text" name="price" id="price" placeholder='Pris' value={partPrice} onChange={(e) => { setPartPrice(e.target.value) }} />
              </div>
              <div className="button-row">
                <span className='primary-button' onClick={(e) => { addPart(e) }}><ion-icon name="add-outline"></ion-icon></span>
              </div>
            </div>
          }
        </div>
        {parts.filter(part => !part.parent).map(part => (
          <Part part={part} key={part._id} authenticate={(req) => { props.authenticate(req) }} update={update} setAlert={props.setAlert} />
        ))}

        
      </div>
    </div>
  )
}