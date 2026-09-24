import { Button, ProductCard } from "@/design-system";
import { getProductPath } from "@/utils/productRoutes";
import { useNavigate } from "react-router";
import { ROUTES } from "@/config/routes";

const HomeProductEdit = ({ products, onAddToCart }) => {
  const navigate = useNavigate();
  return (
    <section
      className="home-section home-product-edit"
      aria-labelledby="home-edit-title"
    >
      <div className="home-section__header home-section__header--with-action">
        <div>
          <span className="home-eyebrow">Across the catalog</span>
          <h2 id="home-edit-title">The Noble Edit.</h2>
        </div>
        <div className="home-section__header-copy">
          <p>
            Four real products, each pulled from a different current collection.
          </p>
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => navigate(ROUTES.shop)}
          >
            View all
          </Button>
        </div>
      </div>

      <div className="home-product-grid">
        {products.map((product) => (
          <ProductCard
            key={`${product.collectionKey}-${product.id}`}
            name={product.name}
            imageUrl={product.imageUrl}
            imageAlt={product.name}
            price={product.price}
            productHref={getProductPath(product.collectionRoute, product.id)}
            onAddToCart={() => onAddToCart(product)}
          >
            <span className="home-product-card__collection">
              {product.collectionTitle}
            </span>
          </ProductCard>
        ))}
      </div>
    </section>
  );
};

export default HomeProductEdit;
