import React, { useState } from 'react'
import "./FormPage.css"
import Form from "../../components/Forms/Form1"
import Form2 from "../../components/Forms/Form2"
import FormLast from "../../components/Forms/FormLast"

export default function FormPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [showAlert, setShowAlert] = useState(false);



  return (
    <div className="FormPage">
      {
        step === 1 && <Form setStep={setStep} setFormData={setFormData} setShowAlert={setShowAlert} />
      }
      {
        step === 2 && <Form2 setStep={setStep} setFormData={setFormData} setShowAlert={setShowAlert} />
      }
      {
        step === 3 && <FormLast setStep={setStep} setFormData={setFormData} setShowAlert={setShowAlert} />
      }
    </div>
  )
}