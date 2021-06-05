import React from "react";

const Form = ({
  newName,
  handleNameInput,
  newNumber,
  handleNumberInput,
  addPerson,
}) => (
  <form>
    <div className="input">
      Name: <input value={newName} onChange={handleNameInput} id="name" />
    </div>
    <div className="input">
      Number:{" "}
      <input value={newNumber} onChange={handleNumberInput} id="number" />
    </div>
    <div className="btn">
      <button type="submit" onClick={addPerson}>
        Add
      </button>
    </div>
  </form>
);

export default Form;
