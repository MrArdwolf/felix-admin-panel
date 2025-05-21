import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Part.scss'



export default function Part(props) {
  const backend = import.meta.env.VITE_API_URL
  const [part, setPart] = useState(props.part);
  const [children, setChildren] = useState([]);
  const [partName, setPartName] = useState("");
  const [partPrice, setPartPrice] = useState("");
  const [addButton, setAddButton] = useState(true);
  const [openEdit, setOpenEdit] = useState(true);
  const [editName, setEditName] = useState(part.name);
  const [editPrice, setEditPrice] = useState(part.price);

  const [openPart, setOpenPart] = useState(true);

  useEffect(() => {
    update();
  }, [])

  const update = () => {
    if (part.children && part.children.length >= 1) {
      console.log(part);
      axios.get(`${backend}/api/part/get/${part._id}`)
        .then(res => {
          console.log(res.data);
          setChildren(res.data);
        })
        .catch(err => {
          console.log(err);
          if (err.status == 401) {
            props.authenticate();
          }
        })
    }

  }

  const openDropDown = (setButton, button) => {
    setButton(!button);
  }

  const addPart = (e) => {
    e.preventDefault();
    axios.post(`${backend}/api/part/add`, {
      name: partName,
      price: partPrice,
      parent: part._id
    })
      .then(res => {
        console.log("new part", res.data);
        setPartName("");
        setPartPrice("");
        openDropDown(setAddButton, addButton);
        openDropDown(setOpenEdit, openEdit);
        openDropDown(setOpenPart, openPart);
        part.children.push(res.data);
        update();
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate();
        }
      })
  }

  const editPart = (e) => {
    axios.patch(`${backend}/api/part/${part._id}`, {
      name: editName,
      price: editPrice
    })
      .then(res => {
        console.log(res.data);
        setPart({ ...part, name: editName, price: editPrice });
        if (props.updateParent) {
          props.updateParent();
        }
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate();
        }
      })
  }

  if (part.children && part.children.length >= 1) {

    return (
      <div className="part">
        <div className="part-top">
          <div className="part-info">
            {
              openEdit ? <h3>{part.name}</h3> :
                <div className="edit-parent-form">
                  <div className="input-row">
                    <input type="text" name="name" id="name" placeholder='Namn' value={editName} onChange={(e) => { setEditName(e.target.value) }} />
                  </div>
                  <span onClick={(e) => { editPart(e) }}><ion-icon name="save-outline"></ion-icon></span>
                </div>
            }
          </div>
          <span onClick={() => { openDropDown(setOpenPart, openPart) }} className={`${openPart ? "" : "open"}`}><ion-icon name="chevron-down-outline"></ion-icon></span>
        </div>
        {openPart ? null :
          <div className="part-content">
            {children.map(child => (
              <Part part={child} key={child._id} authenticate={() => { props.authenticate() }} updateParent={update} className="child part" />
            ))}

            <div className="part-bottom">
              <div className="edit-part-form">
                <div className="add-top">
                  <h3>Add</h3>
                  <span onClick={() => { openDropDown(setAddButton, addButton) }}>{addButton ? <ion-icon name="add-outline"></ion-icon> : <ion-icon name="close-outline"></ion-icon>}</span>
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
                      <span onClick={(e) => { addPart(e) }}><ion-icon name="add-outline"></ion-icon></span>
                    </div>
                  </div>
                }
              </div>

              <span onClick={() => { openDropDown(setOpenEdit, openEdit) }} className='edit-parent-button'>{openEdit ? <ion-icon name="create-outline"></ion-icon> : <ion-icon name="close-outline"></ion-icon>}</span>
            </div>
          </div>
        }
      </div >
    )
  }

  return (
    <div className={props.className || "part"}>
      <div className="part-top">
        <div className="part-info">
          {
            openEdit ? <h3>{part.name}</h3> :
              <div className="input-row">
                <input type="text" name="name" id="name" placeholder='Namn' value={editName} onChange={(e) => { setEditName(e.target.value) }} />
              </div>
          }
          {
            openEdit ? <p>{part.price} kr</p> :
              <div className="input-row">
                <input type="text" name="name" id="name" placeholder='Namn' value={editPrice} onChange={(e) => { setEditPrice(e.target.value) }} />
              </div>
          }
        </div>

        <span onClick={() => {
          openDropDown(setOpenEdit, openEdit)
          if (!openEdit) {
            editPart()
          }
        }}>{openEdit ? <ion-icon name="create-outline"></ion-icon> : <ion-icon name="save-outline"></ion-icon>}</span>

      </div>
      {openEdit ? null :
        <div className="edit-part-form">
          <div className="add-top">
            <h3>Add</h3>
            <span onClick={() => { openDropDown(setAddButton, addButton) }}>{addButton ? <ion-icon name="add-outline"></ion-icon> : <ion-icon name="close-outline"></ion-icon>}</span>
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
                <span onClick={(e) => { addPart(e) }}><ion-icon name="add-outline"></ion-icon></span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  )
}