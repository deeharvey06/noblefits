import { AppLink as Link } from "@/components/navigation/AppLink";
import { ResilientImage } from "@/design-system";
import { getProductPath } from "@/utils/productRoutes";

const ProductMediaLink = ({ product, className = "" }) => {
  if (!product) return null;

  return (
    <Link
      className={className}
      to={getProductPath(product.collectionRoute, product.id)}
      aria-label={`View ${product.name}`}
    >
      <ResilientImage
        src={product.imageUrl}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <span className="home-media-label">
        <span>{product.name}</span>
        <span>{product.collectionTitle}</span>
      </span>
    </Link>
  );
};

export default ProductMediaLink;
