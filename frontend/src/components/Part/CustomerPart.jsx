import React, { useEffect, useState } from 'react'
import './Part.scss'



export default function Part(props) {
  // part is always the full part object, with children populated or as ids
  const [part, setPart] = useState(props.part);
  const allParts = props.allParts || [];
  // Helper to find a part by id in allParts tree
  const findPartById = (id) => {
    const search = (parts) => {
      for (const p of parts) {
        if (p._id === id) return p;
        if (p.children && p.children.length > 0) {
          const found = search(p.children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(allParts);
  };
  const children = [];
  // children: always array of part objects
  const childrenIds = part.children || [];
  if (childrenIds.length > 0) {
    // children is array of ids, map to objects
    children.push(...childrenIds.map(id => findPartById(id)).filter(Boolean));
  }
  const changedPrice = props.customPartPrice.find(_part => _part.id === part._id);
  const [partPrice, setPartPrice] = useState(changedPrice ? changedPrice.price : part.price);
  const [openEdit, setOpenEdit] = useState(true);
  // Find if this part is marked and get its quantity
  const markedPartObj = props.markedParts.find(mp => mp._id === part._id);
  const [marked, setMarked] = useState(!!markedPartObj);
  const [quantity, setQuantity] = useState(markedPartObj ? markedPartObj.quantity : 1);

  const [openPart, setOpenPart] = useState(true);

  // When global openParts flag is set, open any part that is marked or has a marked descendant
  useEffect(() => {
    if (!props.openParts) return;
    const shouldOpen = marked || checkMarkedChildren();
    if (shouldOpen) {
      setOpenPart(false); // false == expanded
    }
  }, [props.openParts, props.markedParts]);

  // No per-part fetching, all children are included in props.part

  const openDropDown = (setButton, button) => {
    setButton(!button);
  }



  const markPart = (e) => {
    // Prevent marking if clicking on quantity controls
    if (
      e.target.closest('.quantity-controls') ||
      e.target.type === 'number' ||
      e.target.tagName === 'BUTTON'
    ) {
      return;
    }
    e.preventDefault();
    if (props.showAllParts) {
      if (marked) {
        props.setMarkedParts(props.markedParts.filter(mp => mp._id !== part._id));
      } else {
        props.setMarkedParts([...props.markedParts, { _id: part._id, quantity }]);
      }
      setMarked(!marked);
    }
  }

  // Update quantity in markedParts
  const updateQuantity = (newQuantity) => {
    setQuantity(newQuantity);
    if (marked) {
      props.setMarkedParts(props.markedParts.map(mp => mp._id === part._id ? { ...mp, quantity: newQuantity } : mp));
    }
  }

  const customPrice = (price) => {
    const otherParts = props.customPartPrice.filter(_part => _part.id !== part._id);
    props.setCustomPartPrice([...otherParts, { id: part._id, price: parseInt(price) }]);
    console.log(props.customPartPrice);
    console.log(price);
  }

  // Recursively check if any descendant is marked, using allParts for lookup
  const checkMarkedChildren = () => {
    if (children.length >= 1) {
      const findPartById = (id) => {
        // allParts is a tree, so recursively search
        const search = (parts) => {
          for (const p of parts) {
            if (p._id === id) return p;
            if (p.children && p.children.length > 0) {
              const found = search(p.children);
              if (found) return found;
            }
          }
          return null;
        };
        return search(allParts);
      };
      const isMarkedRecursive = (partObj) => {
        if (props.markedParts.some(mp => mp._id === partObj._id)) return true;
        if (partObj.children && partObj.children.length > 0) {
          for (const childIdOrObj of partObj.children) {
            let childObj = childIdOrObj;
            // If children are just ids, look up the full object
            if (typeof childIdOrObj === 'string' || typeof childIdOrObj === 'number') {
              childObj = findPartById(childIdOrObj);
            }
            if (childObj && isMarkedRecursive(childObj)) return true;
          }
        }
        return false;
      };
      return children.some(child => isMarkedRecursive(child));
    }
    return false;
  }


  if (part.children && part.children.length >= 1) {
    const markedChildren = checkMarkedChildren();
    if (!props.showAllParts && !marked && !markedChildren) {
      return null;
    }

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
              authenticate={props.authenticate}
              markedParts={props.markedParts}
              setMarkedParts={props.setMarkedParts}
              customPartPrice={props.customPartPrice}
              setCustomPartPrice={props.setCustomPartPrice}
              showAllParts={props.showAllParts}
              allParts={allParts}
              className="child"
            />
          ))}
        </div>

      </div >
    )
  }

  // Always show marked parts, even if showAllParts is false
  if (!props.showAllParts && !marked && !(part.children && part.children.length >= 1 && checkMarkedChildren())) {
    return null;
  }

  return (
    <div className={`part ${props.className ? props.className : ""} ${marked ? "marked" : ""}`} >
      <div className="part-top">
        <div className="part-info" onClick={markPart}>
          <div className="part-name">
          <h3>{part.name}</h3>

          {openEdit ? <p>{partPrice}</p> :
            <input
              className="price-input"
              autoFocus={true}
              type="text"
              name="price"
              id="price"
              placeholder='Pris'
              value={partPrice}
              onChange={(e) => {
                setPartPrice(e.target.value)
                customPrice(e.target.value)
              }}
            />
          }
          </div>

          {marked && (
            <div className="quantity-controls">
              <button className='text-button' onClick={() => updateQuantity(Math.max(1, quantity - 1))}>-</button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => updateQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '40px', textAlign: 'center' }}
              />
              <button className='text-button' onClick={() => updateQuantity(quantity + 1)}>+</button>
            </div>
          )}

        </div>
        <span onClick={() => { openDropDown(setOpenEdit, openEdit) }}>{openEdit ? <ion-icon name="create-outline"></ion-icon> : <ion-icon name="close-outline"></ion-icon>}</span>
      </div>
      
    </div>
  )
}