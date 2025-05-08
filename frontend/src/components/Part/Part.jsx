import React, { useEffect, useState } from 'react'
import axios from 'axios';



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
    e.preventDefault();
    axios.patch(`${backend}/api/part/${part._id}`, {
      name: editName,
      price: editPrice
    })
      .then(res => {
        console.log(res.data);
        openDropDown(setOpenEdit, openEdit);
        setPart({name: editName, price: editPrice});
        props.updateParent();
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
      <div>
        <h3>{
          openEdit ? part.name :
            <div className="edit-part-form">
              <div className="input-row">
                <input type="text" name="name" id="name" placeholder='Namn' value={editName} onChange={(e) => { setEditName(e.target.value) }} />
              </div>
            </div>
        }</h3>
        <button onClick={() => { openDropDown(setOpenPart, openPart) }}>{`${openPart ? "Open" : "Close"}`}</button>
        {openPart ? null :
          <div className="part-content">
            {children.map(child => (
              <Part part={child} key={child._id} authenticate={() => { props.authenticate() }} updateParent={update} />
            ))}


            {
              openEdit ? null :
                <button onClick={(e) => { editPart(e) }}>Save</button>
            }
            <button onClick={() => { openDropDown(setOpenEdit, openEdit) }}>{`${openEdit ? "Edit Parent" : "Close Edit"}`}</button>
            <h3>Add</h3>
            <button onClick={() => { openDropDown(setAddButton, addButton) }}>{`${addButton ? "Add" : "Close"}`}</button>
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
        }
      </div >
    )
  }

  return (
    <div>
      <h3>{part.name}</h3>
      <p>{part.price}</p>

      <button onClick={() => { openDropDown(setOpenEdit, openEdit) }}>{`${openEdit ? "Edit Part" : "Close"}`}</button>
      {openEdit ? null :
        <div className="edit-part-form">
          <div className="input-row">
            <label htmlFor="name">Namn</label>
            <input type="text" name="name" id="name" placeholder='Namn' value={editName} onChange={(e) => { setEditName(e.target.value) }} />
          </div>
          <div className="input-row">
            <label htmlFor="price">Pris</label>
            <input type="text" name="price" id="price" placeholder='Pris' value={editPrice} onChange={(e) => { setEditPrice(e.target.value) }} />
          </div>
          <div className="input-row">
            <button onClick={(e) => { editPart(e) }}>Edit</button>
          </div>


          <h3>Add</h3>
          <button onClick={() => { openDropDown(setAddButton, addButton) }}>{`${addButton ? "Add" : "Close"}`}</button>
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
                <button onClick={(e) => { addPart(e) }}>Add child</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  )
}