export const Badge = ({
  children,
  variant = "neutral",
  selected = false,
  className = "",
  ...props
}) => (
  <span
    className={`ds-badge ds-badge--${variant} ${className}`.trim()}
    data-selected={selected || undefined}
    {...props}
  >
    {children}
  </span>
);

export const PromotionalLabel = ({ children, variant = "sale", ...props }) => (
  <Badge variant={variant} {...props}>
    {children}
  </Badge>
);

export const PriceDisplay = ({
  price,
  compareAtPrice,
  currency = "$",
  label = "Price",
  className = "",
}) => {
  const hasDiscount =
    typeof compareAtPrice === "number" && compareAtPrice > price;

  return (
    <span className={`ds-price ${className}`.trim()}>
      <span className="sr-only">
        {hasDiscount ? `Sale ${label.toLowerCase()}: ` : `${label}: `}
      </span>
      <span className="ds-price__current">
        {currency}
        {price}
      </span>
      {hasDiscount && (
        <>
          <span className="sr-only">, reduced from </span>
          <del className="ds-price__compare">
            {currency}
            {compareAtPrice}
          </del>
        </>
      )}
    </span>
  );
};

export const RatingDisplay = ({ value, max = 5, count, className = "" }) => {
  const safeValue = Math.max(0, Math.min(value, max));
  const rounded = Math.round(safeValue);

  return (
    <span
      className={`ds-rating ${className}`.trim()}
      role="img"
      aria-label={`${safeValue} out of ${max}${
        typeof count === "number" ? `, ${count} reviews` : ""
      }`}
    >
      <span className="ds-rating__stars" aria-hidden="true">
        {Array.from({ length: max }).map((_, index) => (
          <span
            key={index}
            className={index < rounded ? "is-filled" : "is-empty"}
          >
            ★
          </span>
        ))}
      </span>
      {typeof count === "number" && (
        <span className="ds-rating__count">({count})</span>
      )}
    </span>
  );
};
