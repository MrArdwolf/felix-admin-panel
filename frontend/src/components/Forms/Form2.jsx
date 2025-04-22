import React from 'react'
import './Form.scss'


export default function Form() {
  return (
    <form action="" className="Form1">
      <div className="inputs">
        <div className="input-row">
          <label>Kan ni kolla/fixa</label>
          <div className="front-back-row">
            <span>Fram</span>
            <span>Bak</span>
          </div>
          <div className="checkbox-row">
            <label htmlFor="punctured">Punktering</label>
            <input type="checkbox" name="punctured" id="punctured-front" />
            <input type="checkbox" name="punctured" id="punctured-back" />
          </div>
          <div className="checkbox-row">
            <label htmlFor="punctured">Byte däck</label>
            <input type="checkbox" name="punctured" id="punctured-front" />
            <input type="checkbox" name="punctured" id="punctured-back" />
          </div>
          <div className="checkbox-row">
            <label htmlFor="punctured">Byte växelvajer</label>
            <input type="checkbox" name="punctured" id="punctured-front" />
            <input type="checkbox" name="punctured" id="punctured-back" />
          </div>
          <div className="checkbox-row">
            <label htmlFor="punctured">Byte bromsvajer</label>
            <input type="checkbox" name="punctured" id="punctured-front" />
            <input type="checkbox" name="punctured" id="punctured-back" />
          </div>
          <div className="checkbox-row">
            <label htmlFor="punctured">Justera växel</label>
            <input type="checkbox" name="punctured" id="punctured-front" />
            <input type="checkbox" name="punctured" id="punctured-back" />
          </div>
          <div className="checkbox-row">
            <label htmlFor="punctured">Justera broms</label>
            <input type="checkbox" name="punctured" id="punctured-front" />
            <input type="checkbox" name="punctured" id="punctured-back" />
          </div>
          <div className="checkbox-row">
            <label htmlFor="punctured">Rikta hjul</label>
            <input type="checkbox" name="punctured" id="punctured-front" />
            <input type="checkbox" name="punctured" id="punctured-back" />
          </div>
          <div className="checkbox-row">
            <label htmlFor="punctured">Byta eker</label>
            <input type="checkbox" name="punctured" id="punctured-front" />
            <input type="checkbox" name="punctured" id="punctured-back" />
          </div>
        </div>


        <div className="input-row">
          <label htmlFor="also-do">Utför även</label>
          <div className="checkbox-row">
            <input type="checkbox" name="change-chain" id="change-chain" />
            <label htmlFor="change-chain">Byte kedja</label>
          </div>
          <div className="checkbox-row">
            <input type="checkbox" name="lubricate" id="lubricate" />
            <label htmlFor="lubricate">Smörja</label>
          </div>
          <div className="checkbox-row">
            <input type="checkbox" name="pump" id="pump" />
            <label htmlFor="pump">Pumpa</label>
          </div>
          <div className="checkbox-row">
            <input type="checkbox" name="wash" id="wash" />
            <label htmlFor="wash">Tvätta</label>
          </div>


        </div>
      </div>
      <button>Bakåt</button>
      <button type="submit">Nästa</button>
      <button>Rensa formuläret</button>
    </form>
  )
}