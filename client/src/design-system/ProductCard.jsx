import { useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router";

import Button from "./Button";
import ResilientImage from "./ResilientImage";
import { Badge, PriceDisplay, RatingDisplay } from "./CommerceDisplay";

const ProductCard = ({
  name,
  eyebrow,
  imageUrl,
  imageAlt,
  price,
  compareAtPrice,
  badge,
  badgeVariant = "neutral",
  rating,
  reviewCount,
  onAddToCart,
  actionLabel = "Add to cart",
  disabled = false,
  loading = false,
  selected = false,
  productHref,
  headingLevel = 3,
  className = "",
  children,
}) => {
  const Heading = [2, 3, 4].includes(headingLevel) ? `h${headingLevel}` : "h3";
  const [added, setAdded] = useState(false);
  const feedbackTimerRef = useRef(null);

  useEffect(() => () => {
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
  }, []);

  const handleAddToCart = () => {
    if (!onAddToCart || disabled) return;
    onAddToCart();
    setAdded(true);
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => setAdded(false), 1200);
  };

  if (loading) {
    return (
      <article className={`ds-product-card ds-product-card--loading ${className}`.trim()} aria-busy="true">
        <div className="ds-skeleton ds-product-card__image" aria-hidden="true" />
        <div className="ds-product-card__body">
          <div className="ds-skeleton ds-skeleton--text ds-skeleton--wide" />
          <div className="ds-skeleton ds-skeleton--text ds-skeleton--short" />
        </div>
        <span className="sr-only">Loading product</span>
      </article>
    );
  }

  return (
    <article
      className={`ds-product-card ${className}`.trim()}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
    >
      {productHref ? (
        <RouterLink
          className="ds-product-card__media-link"
          to={productHref}
          aria-label={`View ${name}`}
        >
          <div className="ds-product-card__media">
            <ResilientImage
              className="ds-product-card__image"
              src={imageUrl}
              alt={imageAlt || name}
              loading="lazy"
              decoding="async"
            />
            {badge && (
              <Badge variant={badgeVariant} className="ds-product-card__badge">
                {badge}
              </Badge>
            )}
          </div>
        </RouterLink>
      ) : (
        <div className="ds-product-card__media">
          <ResilientImage
            className="ds-product-card__image"
            src={imageUrl}
            alt={imageAlt || name}
            loading="lazy"
            decoding="async"
          />
          {badge && (
            <Badge variant={badgeVariant} className="ds-product-card__badge">
              {badge}
            </Badge>
          )}
        </div>
      )}
      <div className="ds-product-card__body">
        {eyebrow && <span className="ds-product-card__eyebrow">{eyebrow}</span>}
        <Heading className="ds-product-card__title">
          {productHref ? <RouterLink to={productHref}>{name}</RouterLink> : name}
        </Heading>
        <PriceDisplay price={price} compareAtPrice={compareAtPrice} />
        {typeof rating === "number" && (
          <RatingDisplay value={rating} count={reviewCount} />
        )}
        {children}
        {(onAddToCart || disabled) && (
          <Button
            variant="secondary"
            fullWidth
            onClick={handleAddToCart}
            disabled={disabled}
            data-success={added || undefined}
          >
            {added ? "Added to bag" : actionLabel}
          </Button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
