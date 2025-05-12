import React, { useState } from 'react'
import './Form.scss'

import AlertModal from '../AlertModal/AlertModal';


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
    setForm1Data({
      name: '',
      phone: '',
      email: '',
      description: '',
      detailsOrNot: '',
    });
  }

  return (
    <form action="" className="customer-form" onSubmit={nextForm}>

      <p>1. Lås fast din cykel med vajer och lås i vänstra staketet.</p>
      <p>NOTERA: Lås den inte med din egen nyckel!</p>
      <p>2. Fyll i det här formuläret.</p>
      <p>3. Vi hör av oss via sms med offert.</p>

      <p>* Anger obligatorisk fråga</p>

      <div className="inputs">
        <div className="input-row">
          <label htmlFor="name">Namn*</label>
          <input type="text" id="name" onChange={handleChange} name="name" value={form1Data.name} required />
        </div>
        <div className="input-row">
          <label htmlFor="phone">Mobilnummer*</label>
          <input type="text" id="phone" onChange={handleChange} name="phone" value={form1Data.phone} required />
        </div>
        <div className="input-row">
          <label htmlFor="email">Email*</label>
          <input type="text" id="email" onChange={handleChange} name="email" value={form1Data.email} required />
        </div>
        <div className="input-row">
          <label htmlFor="description">Beskrivning av cykel* <p>Skriv gärna färg och märke.</p></label>
          <input type="text" id="description" onChange={handleChange} name="description" value={form1Data.description} required />
        </div>
        <div className="input-row">
          <label>Översyn eller detalj?*</label>
          <div className="inner-row">
            <input
              type="radio"
              id='noDetails'
              name='detailsOrNot'
              value={"noDetails"}
              checked={form1Data.detailsOrNot === 'noDetails'}
              onChange={handleChange} />
            <label htmlFor="noDetails">Kolla min cykel i helhet och kom med en rekommendation med pris</label>
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
            <label htmlFor="details">Jag vill ange i mer detalj</label>
          </div>
        </div>
      </div>
      <button type='submit'>Nästa</button>
      <button onClick={(e) => {
        e.preventDefault();
        setShowAlert(true);
      }}>Rensa formuläret</button>
      {showAlert && <AlertModal onClose={() => setShowAlert(false)} onConfirm={resetForm} />}
    </form>
  )
}