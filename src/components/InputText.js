import React from "react";

function InputText({label, type, value, onChange, placeholder, maxLength}) {
    return (
        <>
            {label ? <label className="form-label">{label}</label> : ''}
            <input 
                type={type} 
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="form-control"
                maxLength={maxLength}
            />
        </>
    );
}

export default InputText;