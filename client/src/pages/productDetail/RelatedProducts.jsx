import { AppLink as Link } from "@/components/navigation/AppLink";
import { collectionPath } from "@/config/routes";
import { useCartActions } from "@/hooks/useCartActions";
import { getProductPath } from "@/utils/productRoutes";
import { ProductCard } from "@/design-system";

const RelatedProducts = ({
  relatedProducts,
  collectionTitle,
  collectionId,
}) => {
  const { addToCart } = useCartActions();
  if (!relatedProducts.length) return null;
  return (
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
        <Link to={collectionPath(collectionId)}>View the collection</Link>
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
              actionLabel={relatedUnavailable ? "Unavailable" : "Add to cart"}
              onAddToCart={
                relatedUnavailable ? undefined : () => addToCart(relatedProduct)
              }
            />
          );
        })}
      </div>
    </section>
  );
};

export default RelatedProducts;
