const IconButton = ({
  children,
  label,
  variant = "ghost",
  size = "md",
  selected,
  loading = false,
  error = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  const selectedProps =
    typeof selected === "boolean" ? { "aria-pressed": selected } : {};

  return (
    <button
      type={type}
      className={`ds-icon-button ds-icon-button--${variant} ds-icon-button--${size} ${className}`.trim()}
      aria-label={label}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-selected={selected || undefined}
      data-error={error || undefined}
      {...selectedProps}
      {...props}
    >
      {loading ? (
        <span className="ds-button__spinner" aria-hidden="true" />
      ) : (
        children
      )}
    </button>
  );
};

export default IconButton;
