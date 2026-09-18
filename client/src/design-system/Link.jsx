const DSLink = ({
  children,
  as: Component = "a",
  variant = "default",
  disabled = false,
  selected = false,
  className = "",
  ...props
}) => {
  const disabledProps = disabled ? { "aria-disabled": true, tabIndex: -1 } : {};

  return (
    <Component
      className={`ds-link ds-link--${variant} ${className}`.trim()}
      data-selected={selected || undefined}
      {...disabledProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default DSLink;
