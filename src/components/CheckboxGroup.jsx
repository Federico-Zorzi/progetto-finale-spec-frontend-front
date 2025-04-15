import React, { useEffect, useRef, useState } from "react";

const CheckboxGroup = ({
  label,
  name,
  options,
  onChange,
  defaultValues,
  setState,
}) => {
  const [checkedValues, setCheckedValues] = useState(defaultValues || []);
  const isInitialRender = useRef(true);

  /* check if its not the first render and I check the initial defaults, if they change */
  useEffect(() => {
    if (!isInitialRender.current) {
      setCheckedValues(defaultValues || []);
    }
    isInitialRender.current = false;
  }, [defaultValues]);

  /* Function for change checkbox group values */
  const handleChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    /* check if checkbox is checked or not and add or remove from checked values to the list */
    if (isChecked) {
      setCheckedValues((prevCheckedValues) => [...prevCheckedValues, value]);
    } else {
      setCheckedValues((prevCheckedValues) =>
        prevCheckedValues.filter((v) => v !== value)
      );
    }

    /* execution of function onChange for add or remove elements from the list for the fetch */
    onChange(
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
