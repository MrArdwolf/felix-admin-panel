import React, { useState } from 'react'
import './Form.scss'

import AlertModal from '../AlertModal/AlertModal';


export default function Form(props) {
  const [form2Data, setForm2Data] = useState(props.formData.form2Data || {
    puncturedFront: false,
    puncturedBack: false,
    changeTireFront: false,
    changeTireBack: false,
    changeGearCableFront: false,
    changeGearCableBack: false,
    changeBrakeCableFront: false,
    changeBrakeCableBack: false,
    adjustGearCableFront: false,
    adjustGearCableBack: false,
    adjustBrakeCableFront: false,
    adjustBrakeCableBack: false,
    adjustTireFront: false,
    adjustTireBack: false,
    changeSpokesFront: false,
    changeSpokesBack: false,
    changeChain: false,
    lubricate: false,
    pump: false,
    wash: false,
  });
  const [showAlert, setShowAlert] = useState(false);

  const nextForm = (e) => {
    e.preventDefault();
    // props.setStep(props.step + 1);
    console.log(form2Data);
    props.setFormData({ ...props.formData, form2Data: form2Data });
    console.log(props.formData);
    props.setStep(3);

  }

  const resetForm = () => {
    setForm2Data({
      puncturedFront: false,
      puncturedBack: false,
      changeTireFront: false,
      changeTireBack: false,
      changeGearCableFront: false,
      changeGearCableBack: false,
      changeBrakeCableFront: false,
      changeBrakeCableBack: false,
      adjustGearCableFront: false,
      adjustGearCableBack: false,
      adjustBrakeCableFront: false,
      adjustBrakeCableBack: false,
      adjustTireFront: false,
      adjustTireBack: false,
      changeSpokesFront: false,
      changeSpokesBack: false,
      changeChain: false,
      lubricate: false,
      pump: false,
      wash: false,
    });
    props.setStep(1);
  }

  return (
    <form action="" className="customer-form" onSubmit={nextForm}>
      <div className="inputs">
        <div className="input-row">
          <label>Kan ni kolla/fixa</label>
          <div className="front-back-row">
            <span>Fram</span>
            <span>Bak</span>
          </div>
          <div className="checkbox-row">
            <label htmlFor="punctured">Punktering</label>
            <input type="checkbox" name="punctured" id="punctured-front" onChange={(e) => { setForm2Data({ ...form2Data, puncturedFront: e.target.checked }); }} checked={form2Data.puncturedFront === true} />
            <input type="checkbox" name="punctured" id="punctured-back" onChange={(e) => { setForm2Data({ ...form2Data, puncturedBack: e.target.checked }); }} checked={form2Data.puncturedBack === true} />
          </div>
          <div className="checkbox-row">
            <label htmlFor="change-tire">Byte däck</label>
            <input type="checkbox" name="change-tire" id="change-tire-front" onChange={(e) => { setForm2Data({ ...form2Data, changeTireFront: e.target.checked }); }} checked={form2Data.changeTireFront === true} />
            <input type="checkbox" name="change-tire" id="change-tire-back" onChange={(e) => { setForm2Data({ ...form2Data, changeTireBack: e.target.checked }); }} checked={form2Data.changeTireBack === true} />
          </div>
          <div className="checkbox-row">
            <label htmlFor="change-gear-cable">Byte växelvajer</label>
            <input type="checkbox" name="change-gear-cable" id="change-gear-cable-front" onChange={(e) => { setForm2Data({ ...form2Data, changeGearCableFront: e.target.checked }); }} checked={form2Data.changeGearCableFront === true} />
            <input type="checkbox" name="change-gear-cable" id="change-gear-cable-back" onChange={(e) => { setForm2Data({ ...form2Data, changeGearCableBack: e.target.checked }); }} checked={form2Data.changeGearCableBack === true} />
          </div>
          <div className="checkbox-row">
            <label htmlFor="change-break-cable">Byte bromsvajer</label>
            <input type="checkbox" name="change-break-cable" id="change-break-cable-front" onChange={(e) => { setForm2Data({ ...form2Data, changeBrakeCableFront: e.target.checked }); }} checked={form2Data.changeBrakeCableFront === true} />
            <input type="checkbox" name="change-break-cable" id="change-break-cable-back" onChange={(e) => { setForm2Data({ ...form2Data, changeBrakeCableBack: e.target.checked }); }} checked={form2Data.changeBrakeCableBack === true} />
          </div>
          <div className="checkbox-row">
            <label htmlFor="adjust-gear-cable">Justera växel</label>
            <input type="checkbox" name="adjust-gear-cable" id="adjust-gear-cable-front" onChange={(e) => { setForm2Data({ ...form2Data, adjustGearCableFront: e.target.checked }); }} checked={form2Data.adjustGearCableFront === true} />
            <input type="checkbox" name="adjust-gear-cable" id="adjust-gear-cable-back" onChange={(e) => { setForm2Data({ ...form2Data, adjustGearCableBack: e.target.checked }); }} checked={form2Data.adjustGearCableBack === true} />
          </div>
          <div className="checkbox-row">
            <label htmlFor="adjust-break-cable">Justera broms</label>
            <input type="checkbox" name="adjust-break-cable" id="adjust-break-cable-front" onChange={(e) => { setForm2Data({ ...form2Data, adjustBrakeCableFront: e.target.checked }); }} checked={form2Data.adjustBrakeCableFront === true} />
            <input type="checkbox" name="adjust-break-cable" id="adjust-break-cable-back" onChange={(e) => { setForm2Data({ ...form2Data, adjustBrakeCableBack: e.target.checked }); }} checked={form2Data.adjustBrakeCableBack === true} />
          </div>
          <div className="checkbox-row">
            <label htmlFor="adjust-tire">Rikta hjul</label>
            <input type="checkbox" name="adjust-tire" id="adjust-tire-front" onChange={(e) => { setForm2Data({ ...form2Data, adjustTireFront: e.target.checked }); }} checked={form2Data.adjustTireFront === true} />
            <input type="checkbox" name="adjust-tire" id="adjust-tire-back" onChange={(e) => { setForm2Data({ ...form2Data, adjustTireBack: e.target.checked }); }} checked={form2Data.adjustTireBack === true} />
          </div>
          <div className="checkbox-row">
            <label htmlFor="change-spokes">Byta eker</label>
            <input type="checkbox" name="change-spokes" id="change-spokes-front" onChange={(e) => { setForm2Data({ ...form2Data, changeSpokesFront: e.target.checked }); }} checked={form2Data.changeSpokesFront === true} />
            <input type="checkbox" name="change-spokes" id="change-spokes-back" onChange={(e) => { setForm2Data({ ...form2Data, changeSpokesBack: e.target.checked }); }} checked={form2Data.changeSpokesBack === true} />
          </div>
        </div>


        <div className="input-row">
          <label htmlFor="also-do">Utför även</label>
          <div className="checkbox-row">
            <input type="checkbox" name="change-chain" id="change-chain" onChange={(e) => { setForm2Data({ ...form2Data, changeChain: e.target.checked }); }} checked={form2Data.changeChain === true} />
            <label htmlFor="change-chain">Byte kedja</label>
          </div>
          <div className="checkbox-row">
            <input type="checkbox" name="lubricate" id="lubricate" onChange={(e) => { setForm2Data({ ...form2Data, lubricate: e.target.checked }); }} checked={form2Data.lubricate === true} />
            <label htmlFor="lubricate">Smörja</label>
          </div>
          <div className="checkbox-row">
            <input type="checkbox" name="pump" id="pump" onChange={(e) => { setForm2Data({ ...form2Data, pump: e.target.checked }); }} checked={form2Data.pump === true} />
            <label htmlFor="pump">Pumpa</label>
          </div>
          <div className="checkbox-row">
            <input type="checkbox" name="wash" id="wash" onChange={(e) => { setForm2Data({ ...form2Data, wash: e.target.checked }); }} checked={form2Data.wash === true} />
            <label htmlFor="wash">Tvätta</label>
          </div>


        </div>
      </div>
      <button onClick={(e) => {
          e.preventDefault();
          props.setStep(1);
        }}>Bakåt</button>
      <button type="submit">Nästa</button>
      <button onClick={(e) => {
        e.preventDefault();
        setShowAlert(true);
      }}>Rensa formuläret</button>
      {showAlert && <AlertModal onClose={() => setShowAlert(false)} onConfirm={resetForm} />}
    </form>
  )
}