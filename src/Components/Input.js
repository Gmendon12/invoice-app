import React, {useState} from 'react'
import '../Styles/GlobalStyles.css'

function Input({name,label,type, placeholder, value, onChange, width}) {
  
    return (
    <div className='input-flex'>
        { label && (
             <label htmlFor={name} className='input-label' >{label}</label>
        )}
        <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className='invoice-input'
        style={{width : width}}
        />
    </div>
  )
}

export default Input