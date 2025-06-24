import React, { useState } from 'react'
import './Form.scss'

import ClearFormModal from '../ClearFormModal/ClearFormModal';


export default function Form(props) {
  const [form1Data, setForm1Data] = useState(props.formData.form1Data || {
    name: '',
    phone: '',
    email: '',
    description: '',
    detailsOrNot: '',
  });
  const [showAlert, setShowAlert] = useState(false);

  const nextForm = (e) => {
    e.preventDefault();
    // props.setStep(props.step + 1);
    console.log(form1Data);
    props.setFormData({ ...props.formData, form1Data: form1Data });
    console.log(props.formData);
    if (form1Data.detailsOrNot === 'details') {
      props.setStep(2);
    } else {
      props.setStep(3);
    }
  }

  const handleChange = (e) => {
    setForm1Data({ ...form1Data, [e.target.name]: e.target.value });
  }

  const resetForm = () => {
    window.location.reload();
  }

  return (
    <form action="" className="customer-form" onSubmit={nextForm}>

      <ol>
        <li>Lås fast din cykel med lås i cykelstället. <p><span>NOTERA:</span> Lås den inte med din egen nyckel!</p></li>
        <li>Fyll i det här formuläret.</li>
        <li>Vi hör av oss via sms med prisförslag.</li>
      </ol>

      <p>* Anger obligatorisk fråga</p>

      <div className="inputs">
        <div className="input-row">
          <label htmlFor="name">Namn*</label>
          <input type="text" id="name" onChange={handleChange} name="name" value={form1Data.name} required />
        </div>
        <div className="input-row">
          <label htmlFor="phone">Mobilnummer*</label>
          <input type="tel" id="phone" onChange={handleChange} name="phone" pattern="(\+[0-9]{2}|0)[0-9]{9}" title='t.ex. 0712345678 eller +46712345678' value={form1Data.phone} required />
        </div>
        <div className="input-row">
          <label htmlFor="email">Email*</label>
          <input type="text" id="email" onChange={handleChange} name="email" pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" value={form1Data.email} required />
        </div>
        <div className="input-row">
          <label htmlFor="description">Beskrivning av cykel* <p>Skriv gärna färg och märke.</p></label>
          <input type="text" id="description" onChange={handleChange} name="description" value={form1Data.description} required />
        </div>
        <div className="input-row radio">
          <label>Översyn eller detalj?*</label>
          <div className="inner-row">
            <input
              type="radio"
              id='noDetails'
              name='detailsOrNot'
              value={"noDetails"}
              checked={form1Data.detailsOrNot === 'noDetails'}
              onChange={handleChange} />
            <label htmlFor="noDetails"><span>Kolla min cykel i helhet och kom med en rekommendation med pris</span></label>
          </div>
          <div className="inner-row">
            <input
              required
              type="radio"
              id='details'
              name='detailsOrNot'
              value={"details"}
              checked={form1Data.detailsOrNot === 'details'}
              onChange={handleChange} />
            <label htmlFor="details"><span>Jag vill ange i mer detalj</span></label>
          </div>
        </div>
      </div>
      <div className="buttons">
        <button type='submit' className='primary-button'>Nästa</button>
        <button className='text-button' onClick={(e) => {
          e.preventDefault();
          setShowAlert(true);
        }}>Rensa formuläret</button>
        {showAlert && <ClearFormModal onClose={() => setShowAlert(false)} onConfirm={resetForm} />}
      </div>
    </form>
  )
}