import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Part.scss'


export default function Part(props) {
  const backend = import.meta.env.VITE_API_URL
  const [part, setPart] = useState(props.part);
  const [children, setChildren] = useState([]);
  const changedPrice = props.customPartPrice.find(_part => _part.id === part._id);
  const [partPrice, setPartPrice] = useState(changedPrice ? changedPrice.price : part.price);
  const [marked, setMarked] = useState(() => {
    let marked = false;
    if (props.markedParts.includes(part._id)) {
      marked = true;
    }
    return marked;
  });

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

  if (part.children && part.children.length >= 1) {

    return (
      <div className={"part"}>
        <div className="part-top">
          <div className="part-info">
            <h3>{part.name}</h3>
          </div>
          <span onClick={() => { openDropDown(setOpenPart, openPart) }} className={`${openPart ? "" : "open"}`}><ion-icon name="chevron-down-outline"></ion-icon></span>
        </div>
        <div className={`part-content ${openPart ? "hidden" : ""}`}>
          {children.map(child => (
            <Part
              part={child}
              key={child._id}
              authenticate={() => { props.authenticate() }}
              updateParent={update}
              markedParts={props.markedParts}
              setMarkedParts={props.setMarkedParts}
              customPartPrice={props.customPartPrice}
              setCustomPartPrice={props.setCustomPartPrice}
              className="child"
            />
          ))}
        </div>

      </div >
    )
  }

  return (
    <div className={`part ${props.className ? props.className : ""} ${marked ? "marked" : ""}`} >
      <div className="part-top">
        <div className="part-info">
          <h3>{part.name}</h3>
          <p>{partPrice}</p>
        </div>
      </div>
    </div>
  )
}