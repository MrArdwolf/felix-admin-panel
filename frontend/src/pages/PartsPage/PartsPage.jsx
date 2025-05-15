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
          props.authenticate();
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
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate();
        }
      })
  }

  return (
    <div className='parts-page'>
      <h1>Parts</h1>
      <div className="parts-container">
        {parts.filter(part => !part.parent).map(part => (
          <Part part={part} key={part._id} authenticate={() => { props.authenticate() }} />
        ))}
      </div>

      <div className="add-part">
        <h3>Add</h3>
        <button onClick={openAddPart}>{`${addButton ? "Add" : "Close"}`}</button>
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
            <div className="input-row">
              <button onClick={(e) => { addPart(e) }}>Add</button>
            </div>
          </div>
        }
      </div>
    </div>
  )
}