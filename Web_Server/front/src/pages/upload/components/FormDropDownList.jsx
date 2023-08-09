import React from 'react';
import { FormSelect, FormInput } from '../../../utils/Form.styled';
import Cancel from '../../../assets/icons/cancel.png';

function FormDropDownList({ options, onOptionChange }) {
  const [value, setValue] = React.useState();
  const [textMode, setTextMode] = React.useState(false);
  const handleChange = (e) => {
    const value = e.target.value;
    if (value === 'other') {
      setTextMode(true);
      return;
    }
    setValue(value);
    onOptionChange(value);
  };
  return (
    <>
      {textMode ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormInput onChange={(e) => onOptionChange(e.target.value)} />
          <img
            src={Cancel}
            height={20}
            onClick={() => setTextMode(false)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      ) : (
        <FormSelect value={value} onChange={handleChange}>
          {options.map((o, i) => (
            <option value={o} key={i}>
              {o}
            </option>
          ))}
        </FormSelect>
      )}
    </>
  );
}
export default FormDropDownList;
