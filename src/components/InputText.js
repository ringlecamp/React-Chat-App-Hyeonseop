import React from "react";

function InputText({label, type, value, onChange, placeholder, maxlength}) {
    return (
        <>
            {label ? <label className="form-label">{label}</label> : ''}
            <input 
                type={type} 
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="form-control"
                maxlength={maxlength}
            />
        </>
    );
}

export default InputText;