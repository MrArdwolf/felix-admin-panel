import React from 'react'
import './ClearFormModal.scss'


export default function AlertModal(props) {
  return (
    <div className="clear-form-modal">
      <div className="clear-form-modal-content">
        <h3>{props.title || "Vill du rensa formuläret?"} </h3>
        <p>{props.message || "Alla svar tas bort från dina frågor och åtgärden kan inte ångras."}</p>
        <div className="buttons">
          <button className='text-button' onClick={props.onClose}>Avbryt</button>
          <button className='text-button' onClick={(e) => {
            e.preventDefault();
            props.onConfirm();
            props.onClose();
          }}>Rensa formuläret</button>
        </div>
      </div>
    </div>
  )
}