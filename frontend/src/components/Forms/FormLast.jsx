import React, { useState } from 'react'
import './Form.scss'

import AlertModal from '../AlertModal/AlertModal';


export default function Form(props) {
  const [form3Data, setForm3Data] = useState(props.formData.form3Data || {
    comment: '',
  });
  const [showAlert, setShowAlert] = useState(false);

  const nextForm = (e) => {
    e.preventDefault();
    // props.setStep(props.step + 1);
    console.log(form3Data);
    props.setFormData({ ...props.formData, form3Data: form3Data });
    props.setStep(4);
  }

  const handleChange = (e) => {
    setForm3Data({ ...form3Data, [e.target.name]: e.target.value });
  }

  const resetForm = () => {
    setForm3Data({
      comment: '',
    });
  }
  return (
    <form action="" className="customer-form" onSubmit={nextForm}>
      <div className="inputs">
        <div className="input-row">
          <label htmlFor="comment">Kommentar <p>Här kan du skriva mer fritt om vad du behöver få gjort.</p></label>
          <input type="text" id="comment" value={form3Data.comment} onChange={handleChange} name="comment" />
        </div>
      </div>
      <button className='secondary-button' onClick={(e) => {
          e.preventDefault();
          if (props.formData.form1Data.detailsOrNot === 'details') {
            props.setStep(2);
          } else {
            props.setStep(1);
          }
        }}>Bakåt</button>
      <button type="submit" className='primary-button'>Skicka</button>
      <button onClick={(e) => {
        e.preventDefault();
        setShowAlert(true);
      }}>Rensa formuläret</button>
      {showAlert && <AlertModal onClose={() => setShowAlert(false)} onConfirm={resetForm} />}
    </form>
  )
}