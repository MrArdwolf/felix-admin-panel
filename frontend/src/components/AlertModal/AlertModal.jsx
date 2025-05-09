import React from 'react'


export default function AlertModal(props) {
  return (
    <div className="alert-modal">
      <div className="alert-modal-content">
        <h3>{props.title || "Vill du rensa formuläret?"} </h3>
        <p>{props.message || "Alla svar tas bort från dina frågor och åtgärden kan inte ångras."}</p>
        <button onClick={props.onClose}>Avbryt</button>
        <button onClick={(e) => {
          e.preventDefault();
          props.onConfirm();
          props.onClose();
        }}>Rensa formuläret</button>
      </div>
    </div>
  )
}