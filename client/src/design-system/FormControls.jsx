
const FieldShell = ({
  id,
  label,
  required,
  error,
  hint,
  children,
  className = "",
}) => {
  const message = error || hint;
  const messageId = message ? `${id}-message` : undefined;

  return (
    <div
      className={`ds-field ${error ? "ds-field--error" : ""} ${className}`.trim()}
    >
      {label && (
        <label className="ds-field__label" htmlFor={id}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      {children(messageId)}
      {message && (
        <div
          id={messageId}
          className="ds-field__message"
          role={error ? "alert" : undefined}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export const InputField = ({
  id,
  name,
  label,
  error,
  hint,
  required,
  className = "",
  inputClassName = "",
  ...props
}) => {
  const inputId = id || name;

  return (
    <FieldShell
      id={inputId}
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      {(messageId) => (
        <input
          id={inputId}
          name={name}
          className={`ds-input ${inputClassName}`.trim()}
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
          aria-errormessage={error ? messageId : undefined}
          required={required}
          {...props}
        />
      )}
    </FieldShell>
  );
};

export const SelectField = ({
  id,
  name,
  label,
  error,
  hint,
  required,
  children,
  className = "",
  selectClassName = "",
  ...props
}) => {
  const selectId = id || name;

  return (
    <FieldShell
      id={selectId}
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      {(messageId) => (
        <select
          id={selectId}
          name={name}
          className={`ds-select ${selectClassName}`.trim()}
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
          aria-errormessage={error ? messageId : undefined}
          required={required}
          {...props}
        >
          {children}
        </select>
      )}
    </FieldShell>
  );
};

export const TextAreaField = ({
  id,
  name,
  label,
  error,
  hint,
  required,
  className = "",
  textareaClassName = "",
  ...props
}) => {
  const textareaId = id || name;

  return (
    <FieldShell
      id={textareaId}
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      {(messageId) => (
        <textarea
          id={textareaId}
          name={name}
          className={`ds-textarea ${textareaClassName}`.trim()}
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
          aria-errormessage={error ? messageId : undefined}
          required={required}
          {...props}
        />
      )}
    </FieldShell>
  );
};

export const Checkbox = ({
  id,
  label,
  error = false,
  disabled = false,
  className = "",
  ...props
}) => (
  <label
    className={`ds-choice ${error ? "ds-choice--error" : ""} ${
      disabled ? "ds-choice--disabled" : ""
    } ${className}`.trim()}
    htmlFor={id}
  >
    <input
      id={id}
      type="checkbox"
      className="ds-choice__input"
      disabled={disabled}
      aria-invalid={error}
      {...props}
    />
    <span className="ds-choice__control" aria-hidden="true" />
    <span className="ds-choice__label">{label}</span>
  </label>
);

export const Radio = ({
  id,
  label,
  error = false,
  disabled = false,
  className = "",
  ...props
}) => (
  <label
    className={`ds-choice ds-choice--radio ${error ? "ds-choice--error" : ""} ${
      disabled ? "ds-choice--disabled" : ""
    } ${className}`.trim()}
    htmlFor={id}
  >
    <input
      id={id}
      type="radio"
      className="ds-choice__input"
      disabled={disabled}
      aria-invalid={error}
      {...props}
    />
    <span className="ds-choice__control" aria-hidden="true" />
    <span className="ds-choice__label">{label}</span>
  </label>
);
