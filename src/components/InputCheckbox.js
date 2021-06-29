import React from "react";

function InputCheckbox({label, onClick, checked}) {
  return (
    <>
      <input 
        type="checkbox" 
        onClick={onClick} 
        className="form-check-input"
        checked={checked} 
      />
      <label className="ml-1">{label}</label>
    </>
  )
}

export default InputCheckbox;