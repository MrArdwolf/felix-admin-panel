import React, { useState } from 'react'
import "./FormPage.scss"
import Form from "../../components/Forms/Form1"
import Form2 from "../../components/Forms/Form2"
import FormLast from "../../components/Forms/FormLast"
import axios from 'axios'

export default function FormPage(props) {
  const backend = import.meta.env.VITE_API_URL
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});


  const sendFormData = () => {

    const FORM_FIELD_MAPPINGS = {
      puncturedFront: { category: 'partToFix', label: 'Punktering fram' },
      puncturedBack: { category: 'partToFix', label: 'Punktering bak' },
      changeTireFront: { category: 'partToFix', label: 'Byte däck fram' },
      changeTireBack: { category: 'partToFix', label: 'Byte däck bak' },
      changeGearCableFront: { category: 'partToFix', label: 'Byte växelvajer fram' },
      changeGearCableBack: { category: 'partToFix', label: 'Byte växelvajer bak' },
      changeBrakeCableFront: { category: 'partToFix', label: 'Byte bromsvajer fram' },
      changeBrakeCableBack: { category: 'partToFix', label: 'Byte bromsvajer bak' },
      adjustGearCableFront: { category: 'partToFix', label: 'Justera växel fram' },
      adjustGearCableBack: { category: 'partToFix', label: 'Justera växel bak' },
      adjustBrakeCableFront: { category: 'partToFix', label: 'Justera broms fram' },
      adjustBrakeCableBack: { category: 'partToFix', label: 'Justera broms bak' },
      adjustTireFront: { category: 'partToFix', label: 'Rikta hjul fram' },
      adjustTireBack: { category: 'partToFix', label: 'Rikta hjul bak' },
      changeSpokesFront: { category: 'partToFix', label: 'Byta eker fram' },
      changeSpokesBack: { category: 'partToFix', label: 'Byta eker bak' },
      changeChain: { category: 'alsoDo', label: 'Byte kedja' },
      lubricate: { category: 'alsoDo', label: 'Smörja' },
      pump: { category: 'alsoDo', label: 'Pumpa' },
      wash: { category: 'alsoDo', label: 'Tvätta' },
    };

    const mapFormDataToCustomer = (formData) => {
      const customer = {
      name: formData.form1Data.name,
      phone: formData.form1Data.phone,
      email: formData.form1Data.email,
      bikeDescription: formData.form1Data.description,
      partToFix: [],
      alsoDo: [],
      comments: formData.form3Data.comment,
      servicePackage: formData.form1Data.servicePackage,
      };

      if (formData.form2Data) {
        console.log(formData.form2Data)

        Object.entries(formData.form2Data).forEach(([key, value]) => {
          if (value && FORM_FIELD_MAPPINGS[key]) {
            const { category, label } = FORM_FIELD_MAPPINGS[key];
            customer[category].push(label);
          }
        });
      }

      return customer;
    };

    const customer = mapFormDataToCustomer(formData);
    console.log(customer)
    axios.post(`${backend}/api/customer/add`, customer)
      .then(res => {
        console.log(res.data)
        props.setAlert({
          show: true,
          message: `Formuläret har skickats in!`,
          type: "success"
        })
      })
      .catch(err => {
        console.log(err)
        props.setAlert({
          show: true,
          message: `Ett fel uppstod!`,
          type: "error"
        })
      })
  }

  if (step === 4) {
    sendFormData();
    setStep(5);
  }

  if (step > 4) {

    return (
      <div className="FormPage">
        <h1>Tack för din inlämning av cykel!</h1>
        <p>Välkommen åter!</p>
      </div>
    )
  }

  return (
    <div className="FormPage">
      <h1>Felix Cykelmeck: Lämna in</h1>
      {
        step === 1 && <Form setStep={setStep} setFormData={setFormData} formData={formData} />
      }
      {
        step === 2 && <Form2 setStep={setStep} setFormData={setFormData} formData={formData} />
      }
      {
        step === 3 && <FormLast setStep={setStep} setFormData={setFormData} formData={formData} />
      }
    </div>
  )
}