import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";

import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  Notification,
  PriceDisplay,
  ProductCard,
  QuantityControl,
  RatingDisplay,
  ResilientImage,
} from "../../design-system";
import Spinner from "../../components/spinner/Spinner";
import { addItem } from "../../redux/cart/actions";
import { fetchCollectionsStart } from "../../redux/shop/actions";
import {
  selectCollections,
  selectIsCollectionFetching,
  selectShopError,
} from "../../redux/shop/shopSelector";
import {
  findProductByRoute,
  getProductImages,
  getProductPath,
  getRelatedProducts,
  normalizeCollectionDisplayTitle,
} from "../../utils/productRoutes";

import "./productDetailPage.scss";

const normalizeSpecifications = (specifications) => {
  if (!specifications) return [];
  if (Array.isArray(specifications)) {
    return specifications
      .map((item) =>
        typeof item === "string"
          ? { label: "Detail", value: item }
          : { label: item?.label, value: item?.value },
      )
      .filter((item) => item.label && item.value);
  }

  if (typeof specifications === "object") {
    return Object.entries(specifications).map(([label, value]) => ({
      label,
      value,
    }));
  }

  return [];
};

const ProductDetailPage = () => {
  const { collectionId, productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const collections = useSelector(selectCollections);
  const isFetching = useSelector(selectIsCollectionFetching);
  const errorMessage = useSelector(selectShopError);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedMessage, setAddedMessage] = useState("");

  useEffect(() => {
    if (!collections && !isFetching && !errorMessage) {
      dispatch(fetchCollectionsStart());
    }
  }, [collections, dispatch, errorMessage, isFetching]);

  const routeKey = `${collectionId}/${productId}`;
  const [previousRouteKey, setPreviousRouteKey] = useState(routeKey);
  if (previousRouteKey !== routeKey) {
    setPreviousRouteKey(routeKey);
    setQuantity(1);
    setActiveImageIndex(0);
    setAddedMessage("");
  }

  const { collection, product } = useMemo(
    () => findProductByRoute(collections, collectionId, productId),
    [collectionId, collections, productId],
  );

  const images = useMemo(() => getProductImages(product), [product]);
  const relatedProducts = useMemo(
    () => getRelatedProducts(collection, productId, 4),
    [collection, productId],
  );

  useEffect(() => {
    if (!product) return undefined;
    const previousTitle = document.title;
    document.title = `${product.name} | Noble Fits`;
    return () => {
      document.title = previousTitle;
    };
  }, [product]);

  if (isFetching && !collections) return <Spinner />;

  if (errorMessage && !collections) {
    return (
      <ErrorState
        eyebrow="Product unavailable"
        title="We could not load this product."
        description="Try loading the catalog again."
        actionLabel="Try again"
        onAction={() => dispatch(fetchCollectionsStart())}
      />
    );
  }

  if (!product || !collection) {
    return (
      <EmptyState
        eyebrow="Product not found"
        title="This product is unavailable."
        description="The product may have moved or no longer exists in this collection."
        actionLabel="Browse the collection"
        onAction={() =>
          navigate(collectionId ? `/shop/${collectionId}` : "/shop")
        }
      />
    );
  }

  const collectionTitle = normalizeCollectionDisplayTitle(collection.title);
  const isUnavailable =
    product.available === false || product.inStock === false;
  const availabilityLabel =
    product.availability ||
    (typeof product.inStock === "boolean"
      ? product.inStock
        ? "In stock"
        : "Unavailable"
      : null);
  const specifications = normalizeSpecifications(product.specifications);
  const activeImage = images[activeImageIndex] || images[0];

  const cartItem = {
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    price: product.price,
  };

  const addQuantityToCart = () => {
    if (isUnavailable) return;
    for (let index = 0; index < quantity; index += 1) {
      dispatch(addItem(cartItem));
    }
    setAddedMessage(
      `${quantity} ${quantity === 1 ? "item" : "items"} added to your bag.`,
    );
  };

  return (
    <article className="product-detail-page">
      <div className="product-detail-layout">
        <section
          className="product-gallery"
          aria-label={`${product.name} product gallery`}
        >
          <div className="product-gallery__stage">
            {activeImage ? (
              <ResilientImage
                key={activeImage.src}
                src={activeImage.src}
                alt={activeImage.alt || product.name}
                className="product-gallery__image"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <div
                className="product-gallery__missing"
                role="img"
                aria-label="Product image unavailable"
              >
                Image unavailable
              </div>
            )}
            {product.badge && (
              <Badge
                variant={product.badgeVariant || "neutral"}
                className="product-gallery__badge"
              >
                {product.badge}
              </Badge>
            )}
          </div>

          {images.length > 1 && (
            <div
              className="product-gallery__thumbnails"
              aria-label="Choose product image"
            >
              {images.map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  className="product-gallery__thumbnail"
                  data-selected={index === activeImageIndex || undefined}
                  aria-label={`View image ${index + 1} of ${images.length}`}
                  aria-pressed={index === activeImageIndex}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <ResilientImage
                    src={image.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="product-purchase" aria-labelledby="product-title">
          <Link
            className="product-purchase__collection"
            to={`/shop/${collectionId}`}
          >
            {collectionTitle}
          </Link>
          <h1 id="product-title">{product.name}</h1>

          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            className="product-purchase__price"
          />

          {typeof product.rating === "number" && (
            <RatingDisplay value={product.rating} count={product.reviewCount} />
          )}

          {availabilityLabel && (
            <p
              className={`product-purchase__availability${isUnavailable ? " is-unavailable" : ""}`}
            >
              {availabilityLabel}
            </p>
          )}

          {product.description && (
            <p className="product-purchase__description">
              {product.description}
            </p>
          )}

          <div className="product-purchase__controls">
            <div className="product-purchase__quantity">
              <span className="product-purchase__control-label">Quantity</span>
              <QuantityControl
                value={quantity}
                min={1}
                disabled={isUnavailable}
                onDecrease={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                onIncrease={() => setQuantity((current) => current + 1)}
                label={`Quantity for ${product.name}`}
              />
            </div>

            <Button
              size="lg"
              fullWidth
              disabled={isUnavailable}
              onClick={addQuantityToCart}
            >
              {isUnavailable ? "Unavailable" : "Add to bag"}
            </Button>
          </div>

          {addedMessage && (
            <Notification
              status="success"
              title="Added to bag"
              onDismiss={() => setAddedMessage("")}
              className="product-purchase__notification"
            >
              <span>{addedMessage}</span> <Link to="/checkout">View bag</Link>
            </Notification>
          )}

          <div className="product-purchase__checkout-note">
            <span aria-hidden="true">↗</span>
            <p>Card entry at checkout is handled through Stripe.</p>
          </div>
        </section>
      </div>

      {(specifications.length > 0 ||
        product.shippingInfo ||
        product.returnsInfo ||
        product.trustInfo) && (
        <section
          className="product-information"
          aria-labelledby="product-information-title"
        >
          <div className="product-information__heading">
            <span className="product-detail-eyebrow">Product information</span>
            <h2 id="product-information-title">Details that matter.</h2>
          </div>

          <div className="product-information__grid">
            {specifications.length > 0 && (
              <div className="product-information__block">
                <h3>Specifications</h3>
                <dl className="product-specifications">
                  {specifications.map(({ label, value }) => (
                    <div key={`${label}-${value}`}>
                      <dt>{label}</dt>
                      <dd>{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {product.shippingInfo && (
              <div className="product-information__block">
                <h3>Shipping</h3>
                <p>{product.shippingInfo}</p>
              </div>
            )}
            {product.returnsInfo && (
              <div className="product-information__block">
                <h3>Returns</h3>
                <p>{product.returnsInfo}</p>
              </div>
            )}
            {product.trustInfo && (
              <div className="product-information__block">
                <h3>Purchase information</h3>
                <p>{product.trustInfo}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section
          className="product-related"
          aria-labelledby="related-products-title"
        >
          <div className="product-related__heading">
            <div>
              <span className="product-detail-eyebrow">
                More from {collectionTitle}
              </span>
              <h2 id="related-products-title">Continue exploring.</h2>
            </div>
            <Link to={`/shop/${collectionId}`}>View the collection</Link>
          </div>

          <div className="product-related__grid">
            {relatedProducts.map((relatedProduct) => {
              const relatedUnavailable =
                relatedProduct.available === false ||
                relatedProduct.inStock === false;
              return (
                <ProductCard
                  key={relatedProduct.id}
                  name={relatedProduct.name}
                  imageUrl={relatedProduct.imageUrl}
                  imageAlt={relatedProduct.name}
                  price={relatedProduct.price}
                  compareAtPrice={relatedProduct.compareAtPrice}
                  badge={relatedProduct.badge}
                  badgeVariant={relatedProduct.badgeVariant}
                  rating={
                    typeof relatedProduct.rating === "number"
                      ? relatedProduct.rating
                      : undefined
                  }
                  reviewCount={
                    typeof relatedProduct.reviewCount === "number"
                      ? relatedProduct.reviewCount
                      : undefined
                  }
                  productHref={getProductPath(collectionId, relatedProduct.id)}
                  disabled={relatedUnavailable}
                  actionLabel={
                    relatedUnavailable ? "Unavailable" : "Add to cart"
                  }
                  onAddToCart={
                    relatedUnavailable
                      ? undefined
                      : () =>
                          dispatch(
                            addItem({
                              id: relatedProduct.id,
                              name: relatedProduct.name,
                              imageUrl: relatedProduct.imageUrl,
                              price: relatedProduct.price,
                            }),
                          )
                  }
                />
              );
            })}
          </div>
        </section>
      )}

      <div
        className="product-mobile-purchase"
        aria-label="Mobile purchase action"
      >
        <div className="product-mobile-purchase__summary">
          <strong>{product.name}</strong>
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
          />
        </div>
        <Button disabled={isUnavailable} onClick={addQuantityToCart}>
          {isUnavailable ? "Unavailable" : `Add ${quantity} to bag`}
        </Button>
      </div>
    </article>
  );
};

export default ProductDetailPage;
