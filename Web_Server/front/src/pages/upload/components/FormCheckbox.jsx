import React from 'react';
import './FormChekbox.css';

function FormCheckbox({ children, onStateChange }) {
  const toggle = (e) => {
    onStateChange(e.target.checked);
  };

  return (
    <div className='checkbox-rect'>
      <input
        type='checkbox'
        id='form-checkbox'
        className='form-checkbox'
        onChange={toggle}
      ></input>
      <label
        htmlFor='form-checkbox'
        style={{ fontSize: '0.75rem', margin: '0 5px' }}
      >
        {children}
      </label>
    </div>
  );
}

export default FormCheckbox;
