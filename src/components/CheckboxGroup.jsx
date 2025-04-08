import React, { useState } from "react";

const CheckboxGroup = ({
  label,
  name,
  options,
  onChange,
  defaultValues,
  setState,
}) => {
  const [checkedValues, setCheckedValues] = useState(defaultValues || []);

  const handleChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    /* check if checkbox is checked or not and add or remove from checkedValues list */
    if (isChecked) {
      setCheckedValues([...checkedValues, value]);
    } else {
      setCheckedValues(checkedValues.filter((v) => v !== value));
    }

    /* execution of function onChange for add or remove elements from the list for the fetch */
    onChange(
      name,
      isChecked
        ? [...checkedValues, value]
        : checkedValues.filter((v) => v !== value),
      setState
    );
  };

  return (
    <div className="checkbox-group-container">
      {label && <label className="checkbox-group-label">{label}</label>}
      <div className="input-container">
        {options.map((option) => (
          <div className="checkbox-item" key={option}>
            <input
              type="checkbox"
              id={option.toLowerCase()}
              name={name}
              value={option}
              checked={checkedValues.includes(option)}
              onChange={handleChange}
            />
            <label htmlFor={option.toLowerCase()}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
