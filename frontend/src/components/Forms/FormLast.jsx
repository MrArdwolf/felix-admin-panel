import React from 'react'
import './Form.scss'


export default function Form() {
  return (
    <form action="" className="customer-form">
      <div className="inputs">
        <div className="input-row">
          <label htmlFor="comment">Kommentar <p>Här kan du skriva mer fritt om vad du behöver få gjort.</p></label>
          <input type="text" id="comment" />
        </div>
      </div>
      <button className='secondary-button'>Bakåt</button>
      <button type="submit" className='primary-button'>Skicka</button>
      <button className='text-button'>Rensa formuläret</button>
    </form>
  )
}