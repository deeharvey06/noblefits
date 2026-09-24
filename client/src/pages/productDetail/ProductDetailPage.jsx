import { ROUTES, collectionPath } from "@/config/routes";
import { AppLink as Link } from "@/components/navigation/AppLink";
import { useNavigate, useParams } from "react-router";
import {
  Button,
  EmptyState,
  ErrorState,
  Notification,
  PriceDisplay,
  QuantityControl,
  RatingDisplay,
} from "@/design-system";
import Spinner from "@/components/spinner/Spinner";
import ProductGallery from "@/pages/productDetail/ProductGallery";
import ProductInformation from "@/pages/productDetail/ProductInformation";
import RelatedProducts from "@/pages/productDetail/RelatedProducts";
import { useProductDetails } from "@/pages/productDetail/useProductDetails";
import "./productDetailPage.scss";

const ProductDetails = ({ collectionId, productId }) => {
  const navigate = useNavigate();
  const {
    collections,
    isFetching,
    errorMessage,
    retry,
    product,
    collection,
    quantity,
    setQuantity,
    activeImageIndex,
    setActiveImageIndex,
    addedMessage,
    setAddedMessage,
    images,
    relatedProducts,
    collectionTitle,
    isUnavailable,
    availabilityLabel,
    specifications,
    addQuantityToCart,
  } = useProductDetails(collectionId, productId);
  if (isFetching && !collections) return <Spinner />;

  if (errorMessage && !collections) {
    return (
      <ErrorState
        eyebrow="Product unavailable"
        title="We could not load this product."
        description="Try loading the catalog again."
        actionLabel="Try again"
        onAction={retry}
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
          navigate(collectionId ? collectionPath(collectionId) : ROUTES.shop)
        }
      />
    );
  }

  return (
    <article className="product-detail-page">
      <div className="product-detail-layout">
        <ProductGallery
          product={product}
          images={images}
          activeImageIndex={activeImageIndex}
          onImageSelect={setActiveImageIndex}
        />

        <section className="product-purchase" aria-labelledby="product-title">
          <Link
            className="product-purchase__collection"
            to={collectionPath(collectionId)}
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
              <span>{addedMessage}</span>{" "}
              <Link to={ROUTES.checkout}>View bag</Link>
            </Notification>
          )}

          <div className="product-purchase__checkout-note">
            <span aria-hidden="true">↗</span>
            <p>Card entry at checkout is handled through Stripe.</p>
          </div>
        </section>
      </div>

      <ProductInformation product={product} specifications={specifications} />

      <RelatedProducts
        relatedProducts={relatedProducts}
        collectionTitle={collectionTitle}
        collectionId={collectionId}
      />

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

const ProductDetailPage = () => {
  const { collectionId, productId } = useParams();
  return (
    <ProductDetails
      key={`${collectionId}/${productId}`}
      collectionId={collectionId}
      productId={productId}
    />
  );
};

export default ProductDetailPage;
