import { Badge, ResilientImage } from "@/design-system";

const ProductGallery = ({
  product,
  images,
  activeImageIndex,
  onImageSelect,
}) => {
  const activeImage = images[activeImageIndex] || images[0];
  return (
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
              onClick={() => onImageSelect(index)}
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
  );
};

export default ProductGallery;
