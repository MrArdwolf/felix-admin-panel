import React from 'react'
import './Form.scss'


export default function Form() {
  return (
    <form action="" className="customer-form">

      <p>1. Lås fast din cykel med vajer och lås i vänstra staketet. </p>
      <p>NOTERA: Lås den inte med din egen nyckel!</p>
      <p>2. Fyll i det här formuläret.</p>
      <p>3. Vi hör av oss via sms med offert.</p>

      <p>* Anger obligatorisk fråga</p>

      <div className="inputs">
        <div className="input-row">
          <label htmlFor="name">Namn*</label>
          <input type="text" id="name" />
        </div>
        <div className="input-row">
          <label htmlFor="phone">Mobilnummer*</label>
          <input type="text" id="phone" />
        </div>
        <div className="input-row">
          <label htmlFor="email">Email*</label>
          <input type="text" id="email" />
        </div>
        <div className="input-row">
          <label htmlFor="description">Beskrivning av cykel* <p>Skriv gärna färg och märke.</p></label>
          <input type="text" id="description" />
        </div>
        <div className="input-row">
          <label>Översyn eller detalj?*</label>
          <div className="inner-row">
            <input type="radio" name='detailsOrNot' />
            <label htmlFor="noDetails">Kolla min cykel i helhet och kom med en rekommendation med pris</label>
          </div>
          <div className="inner-row">
            <input type="radio" name='detailsOrNot' />
            <label htmlFor="details">Jag vill ange i mer detalj</label>
          </div>
        </div>
      </div>
      <button type="submit">Nästa</button>
      <button>Rensa formuläret</button>
    </form>
  )
}