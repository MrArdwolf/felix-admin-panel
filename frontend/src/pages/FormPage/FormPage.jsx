import React, { useState } from 'react'
import "./FormPage.css"
import Form from "../../components/Forms/Form1"
import Form2 from "../../components/Forms/Form2"
import FormLast from "../../components/Forms/FormLast"
import axios from 'axios'

export default function FormPage() {
  const backend = import.meta.env.VITE_API_URL
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});


  const sendFormData = () => {
    const customer = {
      name: formData.form1Data.name,
      phone: formData.form1Data.phone,
      email: formData.form1Data.email,
      bikeDescription: formData.form1Data.description,
      partToFix: [],
      alsoDo: [],
      comments: formData.form3Data.comment,
    }

    console.log(formData)

      if (formData.form2Data.puncturedFront) {
        customer.partToFix.push('puncturedFront')
      }
      if (formData.form2Data.puncturedBack) {
        customer.partToFix.push('puncturedBack')
      }
      if (formData.form2Data.changeTireFront) {
        customer.partToFix.push('changeTireFront')
      }
      if (formData.form2Data.changeTireBack) {
        customer.partToFix.push('changeTireBack')
      }
      if (formData.form2Data.changeGearCableFront) {
        customer.partToFix.push('changeGearCableFront')
      }
      if (formData.form2Data.changeGearCableBack) {
        customer.partToFix.push('changeGearCableBack')
      }
      if (formData.form2Data.changeBrakeCableFront) {
        customer.partToFix.push('changeBrakeCableFront')
      }
      if (formData.form2Data.changeBrakeCableBack) {
        customer.partToFix.push('changeBrakeCableBack')
      }
      if (formData.form2Data.adjustGearCableFront) {
        customer.partToFix.push('adjustGearCableFront')
      }
      if (formData.form2Data.adjustGearCableBack) {
        customer.partToFix.push('adjustGearCableBack')
      }
      if (formData.form2Data.adjustBrakeCableFront) {
        customer.partToFix.push('adjustBrakeCableFront')
      }
      if (formData.form2Data.adjustBrakeCableBack) {
        customer.partToFix.push('adjustBrakeCableBack')
      }
      if (formData.form2Data.adjustTireFront) {
        customer.partToFix.push('adjustTireFront')
      }
      if (formData.form2Data.adjustTireBack) {
        customer.partToFix.push('adjustTireBack')
      }
      if (formData.form2Data.changeSpokesFront) {
        customer.partToFix.push('changeSpokesFront')
      }
      if (formData.form2Data.changeSpokesBack) {
        customer.partToFix.push('changeSpokesBack')
      }
      if (formData.form2Data.changeChain) {
        customer.alsoDo.push('changeChain')
      }
      if (formData.form2Data.lubricate) {
        customer.alsoDo.push('lubricate')
      }
      if (formData.form2Data.pump) {
        customer.alsoDo.push('pump')
      }
      if (formData.form2Data.wash) {
        customer.alsoDo.push('wash')
      }
    


  console.log(customer)
    axios.post(`${backend}/api/customer/add`, customer)
    .then(res => {
      console.log(res.data)
    })
    .catch(err => {
      console.log(err)
    })
  }

if (step === 4) {
  sendFormData();
  setStep(5);
}

if (step > 4) {
  
  return (
    <div className="FormPage">
      <h1>Tack för din beställning!</h1>
      <p>Vi hör av oss med offert inom 24h.</p>
      <p>Välkommen åter!</p>
    </div>
  )
}

  return (
    <div className="FormPage">
      {
        step === 1 && <Form setStep={setStep} setFormData={setFormData} formData={formData}  />
      }
      {
        step === 2 && <Form2 setStep={setStep} setFormData={setFormData} formData={formData}  />
      }
      {
        step === 3 && <FormLast setStep={setStep} setFormData={setFormData} formData={formData}  />
      }
    </div>
  )
}