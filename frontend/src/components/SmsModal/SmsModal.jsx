import React, { useState } from 'react';


export default function SmsModal(props) {
  const [lock, setLock] = useState(375);
  return (
    <div className="sms-modal">
      <div className="sms-modal-content">
        <div className="price-sms">
          <h3>Skicka prisförslag SMS</h3>
          <p>Skicka SMS till {props.customer.name}</p>
          <button onClick={props.sendPriceSMS}>Skicka</button>
        </div>
        <div className="done-sms">
          <h3>Skicka klar SMS</h3>
          <p>Skicka SMS till {props.customer.name}</p>
          <label htmlFor="lock">Lås:</label>
          <select name="lock" id="lock" onChange={(e) => { setLock(e.target.value) }}>
            <option value="375">Inget</option>
            <option value="059">Gul</option>
            <option value="024">Silver</option>
            <option value="692">Svart</option>
          </select>
          <button onClick={() => {props.sendDoneSMS(lock)}}>Skicka</button>

          <button onClick={props.closeModal}>Avbryt</button>
        </div>
      </div>
    </div>
  )
}