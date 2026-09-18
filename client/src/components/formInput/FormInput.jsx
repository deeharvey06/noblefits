import "./formInput.scss";

const FormInput = ({ handleChange, label, ...otherProps }) => {
  const inputId = otherProps.id || otherProps.name;
  const hasValue = Boolean(otherProps.value);

  const renderLabel = () =>
    label && (
      <label
        htmlFor={inputId}
        className={`${hasValue ? "shrink" : ""} form-input-label`}
      >
        {label}
      </label>
    );

  return (
    <div className="group">
      <input
        id={inputId}
        className="form-input"
        onChange={handleChange}
        {...otherProps}
      />
      {renderLabel()}
    </div>
  );
};

export default FormInput;
