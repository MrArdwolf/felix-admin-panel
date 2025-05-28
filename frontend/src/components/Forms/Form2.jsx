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
    window.location.reload();
  }

  return (
    <form action="" className="customer-form" onSubmit={nextForm}>
      <div className="inputs">
        <div className="input-row input-row-checkbox">
          <label>Kan ni kolla/fixa</label>
          <div className="front-back-row-container">
            <div className="front-back-row">
              <span>Fram</span>
              <span>Bak</span>
            </div>
          </div>
          <div className="checkbox-row">
            <label htmlFor="punctured">Punktering</label>
            <div className="checkbox-container">
              <div className="input-checkbox">
                <input type="checkbox" name="punctured" id="punctured-front" onChange={(e) => { setForm2Data({ ...form2Data, puncturedFront: e.target.checked }); }} checked={form2Data.puncturedFront === true} />
              </div>
              <div className="input-checkbox">
                <input type="checkbox" name="punctured" id="punctured-back" onChange={(e) => { setForm2Data({ ...form2Data, puncturedBack: e.target.checked }); }} checked={form2Data.puncturedBack === true} />
              </div>
            </div>
          </div>
          <div className="checkbox-row">
            <label htmlFor="change-tire">Byte däck</label>
            <div className="checkbox-container">
              <div className="input-checkbox">
                <input type="checkbox" name="change-tire" id="change-tire-front" onChange={(e) => { setForm2Data({ ...form2Data, changeTireFront: e.target.checked }); }} checked={form2Data.changeTireFront === true} />
              </div>
              <div className="input-checkbox">
                <input type="checkbox" name="change-tire" id="change-tire-back" onChange={(e) => { setForm2Data({ ...form2Data, changeTireBack: e.target.checked }); }} checked={form2Data.changeTireBack === true} />
              </div>
            </div>
          </div>
          <div className="checkbox-row">
            <label htmlFor="change-gear-cable">Byte växelvajer</label>
            <div className="checkbox-container">
              <div className="input-checkbox">
                <input type="checkbox" name="change-gear-cable" id="change-gear-cable-front" onChange={(e) => { setForm2Data({ ...form2Data, changeGearCableFront: e.target.checked }); }} checked={form2Data.changeGearCableFront === true} />
              </div>
              <div className="input-checkbox">
                <input type="checkbox" name="change-gear-cable" id="change-gear-cable-back" onChange={(e) => { setForm2Data({ ...form2Data, changeGearCableBack: e.target.checked }); }} checked={form2Data.changeGearCableBack === true} />
              </div>
            </div>
          </div>
          <div className="checkbox-row">
            <label htmlFor="change-break-cable">Byte bromsvajer</label>
            <div className="checkbox-container">
              <div className="input-checkbox">
                <input type="checkbox" name="change-break-cable" id="change-break-cable-front" onChange={(e) => { setForm2Data({ ...form2Data, changeBrakeCableFront: e.target.checked }); }} checked={form2Data.changeBrakeCableFront === true} />
              </div>
              <div className="input-checkbox">
                <input type="checkbox" name="change-break-cable" id="change-break-cable-back" onChange={(e) => { setForm2Data({ ...form2Data, changeBrakeCableBack: e.target.checked }); }} checked={form2Data.changeBrakeCableBack === true} />
              </div>
            </div>
          </div>
          <div className="checkbox-row">
            <label htmlFor="adjust-gear-cable">Justera växel</label>
            <div className="checkbox-container">
              <div className="input-checkbox">
                <input type="checkbox" name="adjust-gear-cable" id="adjust-gear-cable-front" onChange={(e) => { setForm2Data({ ...form2Data, adjustGearCableFront: e.target.checked }); }} checked={form2Data.adjustGearCableFront === true} />
              </div>
              <div className="input-checkbox">
                <input type="checkbox" name="adjust-gear-cable" id="adjust-gear-cable-back" onChange={(e) => { setForm2Data({ ...form2Data, adjustGearCableBack: e.target.checked }); }} checked={form2Data.adjustGearCableBack === true} />
              </div>
            </div>
          </div>
          <div className="checkbox-row">
            <label htmlFor="adjust-break-cable">Justera broms</label>
            <div className="checkbox-container">
              <div className="input-checkbox">
                <input type="checkbox" name="adjust-break-cable" id="adjust-break-cable-front" onChange={(e) => { setForm2Data({ ...form2Data, adjustBrakeCableFront: e.target.checked }); }} checked={form2Data.adjustBrakeCableFront === true} />
              </div>
              <div className="input-checkbox">
                <input type="checkbox" name="adjust-break-cable" id="adjust-break-cable-back" onChange={(e) => { setForm2Data({ ...form2Data, adjustBrakeCableBack: e.target.checked }); }} checked={form2Data.adjustBrakeCableBack === true} />
              </div>
            </div>
          </div>
          <div className="checkbox-row">
            <label htmlFor="adjust-tire">Rikta hjul</label>
            <div className="checkbox-container">
              <div className="input-checkbox">
                <input type="checkbox" name="adjust-tire" id="adjust-tire-front" onChange={(e) => { setForm2Data({ ...form2Data, adjustTireFront: e.target.checked }); }} checked={form2Data.adjustTireFront === true} />
              </div>
              <div className="input-checkbox">
                <input type="checkbox" name="adjust-tire" id="adjust-tire-back" onChange={(e) => { setForm2Data({ ...form2Data, adjustTireBack: e.target.checked }); }} checked={form2Data.adjustTireBack === true} />
              </div>
            </div>
          </div>
          <div className="checkbox-row">
            <label htmlFor="change-spokes">Byta eker</label>
            <div className="checkbox-container">
              <div className="input-checkbox">
                <input type="checkbox" name="change-spokes" id="change-spokes-front" onChange={(e) => { setForm2Data({ ...form2Data, changeSpokesFront: e.target.checked }); }} checked={form2Data.changeSpokesFront === true} />
              </div>
              <div className="input-checkbox">
                <input type="checkbox" name="change-spokes" id="change-spokes-back" onChange={(e) => { setForm2Data({ ...form2Data, changeSpokesBack: e.target.checked }); }} checked={form2Data.changeSpokesBack === true} />
              </div>
            </div>
          </div>
        </div>


        <div className="input-row input-row-checkbox single-checkbox">
          <label htmlFor="also-do">Utför även</label>
          <div className="checkbox-row">
            <div className="input-checkbox">
              <input type="checkbox" name="change-chain" id="change-chain" onChange={(e) => { setForm2Data({ ...form2Data, changeChain: e.target.checked }); }} checked={form2Data.changeChain === true} />
            </div>
            <label htmlFor="change-chain">Byte kedja</label>
          </div>
          <div className="checkbox-row">
            <div className="input-checkbox">
              <input type="checkbox" name="lubricate" id="lubricate" onChange={(e) => { setForm2Data({ ...form2Data, lubricate: e.target.checked }); }} checked={form2Data.lubricate === true} />
            </div>
            <label htmlFor="lubricate">Smörja</label>
          </div>
          <div className="checkbox-row">
            <div className="input-checkbox">
              <input type="checkbox" name="pump" id="pump" onChange={(e) => { setForm2Data({ ...form2Data, pump: e.target.checked }); }} checked={form2Data.pump === true} />
            </div>
            <label htmlFor="pump">Pumpa</label>
          </div>
          <div className="checkbox-row">
            <div className="input-checkbox">
              <input type="checkbox" name="wash" id="wash" onChange={(e) => { setForm2Data({ ...form2Data, wash: e.target.checked }); }} checked={form2Data.wash === true} />
            </div>
            <label htmlFor="wash">Tvätta</label>
          </div>


        </div>
      </div>
      <div className="buttons">
        <div className="buttons-left">
          <button className='secondary-button' onClick={(e) => {
            e.preventDefault();
            props.setStep(1);
          }}>Bakåt</button>
          <button type="submit" className='primary-button'>Nästa</button>
          <button className='text-button' onClick={(e) => {
            e.preventDefault();
            setShowAlert(true);
          }}>Rensa formuläret</button>
          {showAlert && <AlertModal onClose={() => setShowAlert(false)} onConfirm={resetForm} />}
        </div>
      </div>
    </form>
  )
}