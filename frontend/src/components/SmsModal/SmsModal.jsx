import React, { useState } from 'react';
import './SmsModal.scss'


export default function SmsModal(props) {
  const [lock, setLock] = useState(375);
  return (
    <div className="sms-modal">
      <div className="sms-modal-content">
        <h3>Skicka SMS till {props.customer.name}</h3>
        <div className="price-sms">
          <h3>Skicka prisförslag SMS</h3>
          <button className='primary-button' onClick={props.sendPriceSMS}>Skicka</button>
        </div>
        <div className="done-sms">
          <h3>Skicka klar SMS</h3>
          <div className="input-row">
            <label htmlFor="lock">Lås:</label>
            <select name="lock" id="lock" onChange={(e) => { setLock(e.target.value) }}>
              <option value="375">Inget</option>
              <option value="059">Gul</option>
              <option value="024">Silver</option>
              <option value="692">Svart</option>
              <option value="nothing">Inget lås</option>
            </select>
          </div>
          <div className="buttons">
            <button className='secondary-button' onClick={props.closeModal}>Avbryt</button>
            <button className='primary-button' onClick={() => { props.sendDoneSMS(lock) }}>Skicka</button>
          </div>
        </div>
      </div>
    </div>
  )
}