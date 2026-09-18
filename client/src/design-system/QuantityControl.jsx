import IconButton from "./IconButton";

const QuantityControl = ({
  value,
  onDecrease,
  onIncrease,
  min = 0,
  max = Infinity,
  disabled = false,
  label = "Quantity",
  className = "",
}) => {
  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && value < max;

  return (
    <div
      className={`ds-quantity ${className}`.trim()}
      role="group"
      aria-label={label}
    >
      <IconButton
        label={`Decrease ${label.toLowerCase()}`}
        size="sm"
        onClick={onDecrease}
        disabled={!canDecrease}
      >
        <span aria-hidden="true">−</span>
      </IconButton>
      <output
        className="ds-quantity__value"
        aria-live="polite"
        aria-label={`${label}: ${value}`}
      >
        {value}
      </output>
      <IconButton
        label={`Increase ${label.toLowerCase()}`}
        size="sm"
        onClick={onIncrease}
        disabled={!canIncrease}
      >
        <span aria-hidden="true">+</span>
      </IconButton>
    </div>
  );
};

export default QuantityControl;
