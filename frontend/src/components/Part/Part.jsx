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

  const FORM_CONNECTION_MAPPINGS = {
    puncturedFront: 'Punktering fram',
    puncturedBack: 'Punktering bak',
    changeTireFront: 'Byte däck fram',
    changeTireBack: 'Byte däck bak',
    changeGearCableFront: 'Byte växelvajer fram',
    changeGearCableBack: 'Byte växelvajer bak',
    changeBrakeCableFront: 'Byte bromsvajer fram',
    changeBrakeCableBack: 'Byte bromsvajer bak',
    adjustGearCableFront: 'Justera växel fram',
    adjustGearCableBack: 'Justera växel bak',
    adjustBrakeCableFront: 'Justera broms fram',
    adjustBrakeCableBack: 'Justera broms bak',
    adjustTireFront: 'Rikta hjul fram',
    adjustTireBack: 'Rikta hjul bak',
    changeSpokesFront: 'Byta eker fram',
    changeSpokesBack: 'Byta eker bak',
    changeChain: 'Byte kedja',
    lubricate: 'Smörja',
    pump: 'Pumpa',
    wash: 'Tvätta',
  };

  const getInitialFormConnections = () => {
    const initial = {};
    Object.keys(FORM_CONNECTION_MAPPINGS).forEach(key => {
      initial[key] = false;
    });
    if (part.formConnections && Array.isArray(part.formConnections)) {
      part.formConnections.forEach(label => {
        const foundKey = Object.keys(FORM_CONNECTION_MAPPINGS).find(key => FORM_CONNECTION_MAPPINGS[key] === label);
        if (foundKey) {
          initial[foundKey] = true;
        }
      });
    }
    return initial;
  };

  const [formConnections, setFormConnections] = useState(getInitialFormConnections());


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
            props.authenticate(update);
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
        props.setAlert({
          show: true,
          message: `${partName} tillagd`,
          type: "success"
        })

        if (!openEdit) {
          setOpenEdit(true);
          openDropDown(setOpenPart, openPart);
        }
        part.children.push(res.data);
        update();
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate(addPart);
        }
      })
  }

  const editPart = (e) => {
    const mapDataToPart = (formConnections) => {
      const part = {
        name: editName,
        price: editPrice,
        formConnections: [],
      };

      if (formConnections) {
        console.log(formConnections)

        Object.entries(formConnections).forEach(([key, value]) => {
          if (value && FORM_CONNECTION_MAPPINGS[key]) {
            const label = FORM_CONNECTION_MAPPINGS[key];
            part.formConnections.push(label);
          }
        });
      }

      console.log(part);
      return part;
    };
    const formatedPart = mapDataToPart(formConnections);
    axios.patch(`${backend}/api/part/${part._id}`, formatedPart)
      .then(res => {
        console.log(res.data);
        props.setAlert({
          show: true,
          message: `${editName} ändrad`,
          type: "task"
        })
        setPart({ ...part, name: editName, price: editPrice, formConnections: formConnections });
        if (props.updateParent) {
          props.updateParent();
        }
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate(editPart);

        }
      })
  }

  const deletePart = () => {
    axios.delete(`${backend}/api/part/${part._id}`)
      .then(res => {
        console.log(res.data);
        props.setAlert({
          show: true,
          message: `${part.name} borttagen`,
          type: "task"
        })
        if (props.updateParent) {
          props.updateParent();
          props.setChildren(props.children.filter(child => child._id !== part._id));
        } else {
          props.update();
        }
      })
      .catch(err => {
        console.log(err);
        if (err.status == 401) {
          props.authenticate(deletePart);
        }
      })
  }

  if (children && children.length >= 1) {

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
              <Part part={child} key={child._id} children={children} setChildren={setChildren} authenticate={(req) => { props.authenticate(req) }} updateParent={update} className="child part" setAlert={props.setAlert} />
            ))}

            <div className="part-bottom">
              <div className="edit-part-form">
                <div className="add-top">
                  <h3>Lägg till</h3>
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
          {openEdit ? "" : <span onClick={deletePart}><ion-icon name="trash-outline"></ion-icon></span>}
        </div>

        <span onClick={() => {
          openDropDown(setOpenEdit, openEdit)
          if (!openEdit) {
            editPart()
          }
        }}>{openEdit ? <ion-icon name="create-outline"></ion-icon> : <ion-icon name="save-outline"></ion-icon>}</span>

      </div>
      {openEdit ? null :
        <div className="form-connection">
          <div className="input-row">
            <label htmlFor="puncturedFront">Punktering fram</label>
            <input type="checkbox" name="puncturedFront" id="puncturedFront" onChange={(e) => { setFormConnections({ ...formConnections, puncturedFront: e.target.checked }) }} checked={formConnections.puncturedFront} />
          </div>
          <div className="input-row">
            <label htmlFor="puncturedBack">Punktering bak</label>
            <input type="checkbox" name="puncturedBack" id="puncturedBack" onChange={(e) => { setFormConnections({ ...formConnections, puncturedBack: e.target.checked }) }} checked={formConnections.puncturedBack} />
          </div>
          <div className="input-row">
            <label htmlFor="changeTireFront">Byte däck fram</label>
            <input type="checkbox" name="changeTireFront" id="changeTireFront" onChange={(e) => { setFormConnections({ ...formConnections, changeTireFront: e.target.checked }) }} checked={formConnections.changeTireFront} />
          </div>
          <div className="input-row">
            <label htmlFor="changeTireBack">Byte däck bak</label>
            <input type="checkbox" name="changeTireBack" id="changeTireBack" onChange={(e) => { setFormConnections({ ...formConnections, changeTireBack: e.target.checked }) }} checked={formConnections.changeTireBack} />
          </div>
          <div className="input-row">
            <label htmlFor="changeGearCableFront">Byte växelvajer fram</label>
            <input type="checkbox" name="changeGearCableFront" id="changeGearCableFront" onChange={(e) => { setFormConnections({ ...formConnections, changeGearCableFront: e.target.checked }) }} checked={formConnections.changeGearCableFront} />
          </div>
          <div className="input-row">
            <label htmlFor="changeGearCableBack">Byte växelvajer bak</label>
            <input type="checkbox" name="changeGearCableBack" id="changeGearCableBack" onChange={(e) => { setFormConnections({ ...formConnections, changeGearCableBack: e.target.checked }) }} checked={formConnections.changeGearCableBack} />
          </div>
          <div className="input-row">
            <label htmlFor="changeBrakeCableFront">Byte bromskabel fram</label>
            <input type="checkbox" name="changeBrakeCableFront" id="changeBrakeCableFront" onChange={(e) => { setFormConnections({ ...formConnections, changeBrakeCableFront: e.target.checked }) }} checked={formConnections.changeBrakeCableFront} />
          </div>
          <div className="input-row">
            <label htmlFor="changeBrakeCableBack">Byte bromskabel bak</label>
            <input type="checkbox" name="changeBrakeCableBack" id="changeBrakeCableBack" onChange={(e) => { setFormConnections({ ...formConnections, changeBrakeCableBack: e.target.checked }) }} checked={formConnections.changeBrakeCableBack} />
          </div>
          <div className="input-row">
            <label htmlFor="adjustGearCableFront">Justera växelvajer fram</label>
            <input type="checkbox" name="adjustGearCableFront" id="adjustGearCableFront" onChange={(e) => { setFormConnections({ ...formConnections, adjustGearCableFront: e.target.checked }) }} checked={formConnections.adjustGearCableFront} />
          </div>
          <div className="input-row">
            <label htmlFor="adjustGearCableBack">Justera växelvajer bak</label>
            <input type="checkbox" name="adjustGearCableBack" id="adjustGearCableBack" onChange={(e) => { setFormConnections({ ...formConnections, adjustGearCableBack: e.target.checked }) }} checked={formConnections.adjustGearCableBack} />
          </div>
          <div className="input-row">
            <label htmlFor="adjustBrakeCableFront">Justera bromskabel fram</label>
            <input type="checkbox" name="adjustBrakeCableFront" id="adjustBrakeCableFront" onChange={(e) => { setFormConnections({ ...formConnections, adjustBrakeCableFront: e.target.checked }) }} checked={formConnections.adjustBrakeCableFront} />
          </div>
          <div className="input-row">
            <label htmlFor="adjustBrakeCableBack">Justera bromskabel bak</label>
            <input type="checkbox" name="adjustBrakeCableBack" id="adjustBrakeCableBack" onChange={(e) => { setFormConnections({ ...formConnections, adjustBrakeCableBack: e.target.checked }) }} checked={formConnections.adjustBrakeCableBack} />
          </div>
          <div className="input-row">
            <label htmlFor="adjustTireFront">Rikta däck fram</label>
            <input type="checkbox" name="adjustTireFront" id="adjustTireFront" onChange={(e) => { setFormConnections({ ...formConnections, adjustTireFront: e.target.checked }) }} checked={formConnections.adjustTireFront} />
          </div>
          <div className="input-row">
            <label htmlFor="adjustTireBack">Rikta däck bak</label>
            <input type="checkbox" name="adjustTireBack" id="adjustTireBack" onChange={(e) => { setFormConnections({ ...formConnections, adjustTireBack: e.target.checked }) }} checked={formConnections.adjustTireBack} />
          </div>
          <div className="input-row">
            <label htmlFor="changeSpokesFront">Byte ekrar fram</label>
            <input type="checkbox" name="changeSpokesFront" id="changeSpokesFront" onChange={(e) => { setFormConnections({ ...formConnections, changeSpokesFront: e.target.checked }) }} checked={formConnections.changeSpokesFront} />
          </div>
          <div className="input-row">
            <label htmlFor="changeSpokesBack">Byte ekrar bak</label>
            <input type="checkbox" name="changeSpokesBack" id="changeSpokesBack" onChange={(e) => { setFormConnections({ ...formConnections, changeSpokesBack: e.target.checked }) }} checked={formConnections.changeSpokesBack} />
          </div>
          <div className="input-row">
            <label htmlFor="changeChain">Byte kedja</label>
            <input type="checkbox" name="changeChain" id="changeChain" onChange={(e) => { setFormConnections({ ...formConnections, changeChain: e.target.checked }) }} checked={formConnections.changeChain} />
          </div>
          <div className="input-row">
            <label htmlFor="lubricate">Smörja</label>
            <input type="checkbox" name="lubricate" id="lubricate" onChange={(e) => { setFormConnections({ ...formConnections, lubricate: e.target.checked }) }} checked={formConnections.lubricate} />
          </div>
          <div className="input-row">
            <label htmlFor="pump">Pumpa</label>
            <input type="checkbox" name="pump" id="pump" onChange={(e) => { setFormConnections({ ...formConnections, pump: e.target.checked }) }} checked={formConnections.pump} />
          </div>
          <div className="input-row">
            <label htmlFor="wash">Tvätta</label>
            <input type="checkbox" name="wash" id="wash" onChange={(e) => { setFormConnections({ ...formConnections, wash: e.target.checked }) }} checked={formConnections.wash} />
          </div>
        </div>
      }


      {openEdit ? null :
        part.parent ? null :
          <div className="edit-part-form">
            <div className="add-top">
              <h3>Lägg till</h3>
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