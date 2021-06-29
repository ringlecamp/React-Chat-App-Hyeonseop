import React from "react";

function InputSelect({label, value, onChange, options}) {
  const renderOptions = options.map((op) => {
    return (
      <option value={op.value} key={op.value}>
        {op.text}
      </option>
    )
  })
  return (
    <>
      <label className="form-label">{label}</label>
      <select 
        value={value}
        onChange={onChange}
        className="form-select"
      >
        <option disabled value=""></option>
        {renderOptions}
      </select>
    </>
  );
}

export default InputSelect;