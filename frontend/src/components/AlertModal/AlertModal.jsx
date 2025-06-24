import { useEffect, useState } from 'react';
import './AlertModal.scss';



export default function AlertModal(props) {

  if (props.show) {
    setTimeout(() => {
      props.colseAlert();
    }, 2000);
  }

  return (
    <div className={`alert-modal ${props.type} ${props.show ? "show" : ""}`}>
      <div className="alert-modal-content">
        <p>{props.message}</p>
      </div>
    </div>
  )
}