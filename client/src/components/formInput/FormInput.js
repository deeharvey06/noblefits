import React from "react";

import "./formInput.scss";

const FormInput = ({ handleChange, label, ...otherProps }) => {
  const renderlabel = () =>
    label && (
      <label
        className={`${
          otherProps.value.length ? "shrink" : ""
        } form-input-label`}
      >
        {label}
      </label>
    );

  return (
    <div className="group">
      <input className="form-input" onChange={handleChange} {...otherProps} />
      {renderlabel()}
    </div>
  );
};

export default FormInput;
