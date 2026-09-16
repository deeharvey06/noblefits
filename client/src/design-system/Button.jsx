
const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  selected,
  error = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  className = "",
  type = "button",
  ...props
}) => {
  const selectedProps =
    typeof selected === "boolean" ? { "aria-pressed": selected } : {};

  return (
    <button
      type={type}
      className={`ds-button ds-button--${variant} ds-button--${size} ${
        fullWidth ? "ds-button--full" : ""
      } ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      data-error={error || undefined}
      data-selected={selected || undefined}
      {...selectedProps}
      {...props}
    >
      {loading && <span className="ds-button__spinner" aria-hidden="true" />}
      {!loading && startIcon && (
        <span className="ds-button__icon" aria-hidden="true">
          {startIcon}
        </span>
      )}
      <span className="ds-button__label">{children}</span>
      {!loading && endIcon && (
        <span className="ds-button__icon" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
