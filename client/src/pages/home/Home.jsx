import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

import Directory from "../../components/directory/Directory";
import { Button, ProductCard, ResilientImage } from "../../design-system";
import { addItem } from "../../redux/cart/actions";
import { selectDirectorySections } from "../../redux/directory/directorySelector";
import { fetchCollectionsStart } from "../../redux/shop/actions";
import { getLocalCatalog } from "../../redux/shop/catalogFallback";
import {
  selectCollections,
  selectIsCollectionFetching,
  selectShopError,
} from "../../redux/shop/shopSelector";
import { getProductPath } from "../../utils/productRoutes";
import { buildHomepageMedia } from "./homeMedia";

import "./home.scss";

const LOCAL_CATALOG = getLocalCatalog();

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

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sections = useSelector(selectDirectorySections);
  const collections = useSelector(selectCollections);
  const isFetching = useSelector(selectIsCollectionFetching);
  const errorMessage = useSelector(selectShopError);

  useEffect(() => {
    if (!collections && !isFetching && !errorMessage) {
      dispatch(fetchCollectionsStart());
    }
  }, [collections, dispatch, errorMessage, isFetching]);

  const displayCollections = collections || LOCAL_CATALOG;
  const reservedCategoryImages = sections.map((section) => section.imageUrl);
  const media = buildHomepageMedia(displayCollections, reservedCategoryImages);

  const [heroPrimary, heroSecondary, heroAccent] = media.hero;
  const [outerwearPrimary, outerwearSecondary] = media.outerwear;

  const handleAddToCart = (product) => {
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
      })
    );
  };

  return (
    <div className="homepage">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero__copy">
          <span className="home-eyebrow">Noble Fits / The Edit</span>
          <h1 id="home-hero-title">Build your everyday rotation.</h1>
          <p>
            A visual way into the catalog—clothing, outerwear, sneakers, and accessories,
            with every image leading somewhere useful.
          </p>
          <div className="home-hero__actions">
            <Button size="lg" onClick={() => navigate("/shop")}>Shop all</Button>
            <Button size="lg" variant="secondary" onClick={() => navigate("/shop/womens")}>Shop women</Button>
          </div>
        </div>

        <div className="home-hero__media" aria-label="Featured products">
          <ProductMediaLink product={heroPrimary} className="home-hero-card home-hero-card--primary" />
          <div className="home-hero__side-stack">
            <ProductMediaLink product={heroSecondary} className="home-hero-card home-hero-card--secondary" />
            <ProductMediaLink product={heroAccent} className="home-hero-card home-hero-card--accent" />
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="home-categories-title">
        <div className="home-section__header">
          <div>
            <span className="home-eyebrow">Shop by category</span>
            <h2 id="home-categories-title">Find your lane.</h2>
          </div>
          <p>Five collections, each with its own product mix. Pick a category and move straight into the merchandise.</p>
        </div>
        <Directory />
      </section>

      <section className="home-section home-product-edit" aria-labelledby="home-edit-title">
        <div className="home-section__header home-section__header--with-action">
          <div>
            <span className="home-eyebrow">Across the catalog</span>
            <h2 id="home-edit-title">The Noble Edit.</h2>
          </div>
          <div className="home-section__header-copy">
            <p>Four real products, each pulled from a different current collection.</p>
            <Button variant="tertiary" size="sm" onClick={() => navigate("/shop")}>View all</Button>
          </div>
        </div>

        <div className="home-product-grid">
          {media.edit.map((product) => (
            <ProductCard
              key={`${product.collectionKey}-${product.id}`}
              name={product.name}
              imageUrl={product.imageUrl}
              imageAlt={product.name}
              price={product.price}
              productHref={getProductPath(product.collectionRoute, product.id)}
              onAddToCart={() => handleAddToCart(product)}
            >
              <span className="home-product-card__collection">{product.collectionTitle}</span>
            </ProductCard>
          ))}
        </div>
      </section>

      <section className="home-visual-journal" aria-labelledby="home-journal-title">
        <div className="home-visual-journal__intro">
          <span className="home-eyebrow">More ways in</span>
          <h2 id="home-journal-title">A closer look at the catalog.</h2>
          <p>Use the imagery to move between accessories, footwear, and everyday layers without repeating the same campaign shots.</p>
        </div>
        <div className="home-visual-journal__grid">
          {media.visualJournal.map((product, index) => (
            <ProductMediaLink
              key={`${product.collectionKey}-${product.id}`}
              product={product}
              className={`home-journal-card home-journal-card--${index + 1}`}
            />
          ))}
        </div>
      </section>

      {outerwearPrimary && (
        <section className="home-editorial" aria-labelledby="home-editorial-title">
          <div className="home-editorial__media">
            <ResilientImage src={outerwearPrimary.imageUrl} alt={outerwearPrimary.name} loading="lazy" />
            {outerwearSecondary && (
              <ResilientImage
                className="home-editorial__inset"
                src={outerwearSecondary.imageUrl}
                alt={outerwearSecondary.name}
                loading="lazy"
              />
            )}
          </div>
          <div className="home-editorial__copy">
            <span className="home-eyebrow">Collection focus</span>
            <h2 id="home-editorial-title">Outerwear, up close.</h2>
            <p>Move from denim layers to trenches and shearling pieces already in the Noble Fits jacket collection.</p>
            <Button variant="secondary" onClick={() => navigate("/shop/jackets")}>Shop jackets</Button>
          </div>
        </section>
      )}

      <section className="home-closing" aria-labelledby="home-closing-title">
        <span className="home-eyebrow">All collections</span>
        <h2 id="home-closing-title">Keep exploring.</h2>
        <p>Browse the complete catalog across Men, Women, Jackets, Sneakers, and Hats.</p>
        <Button size="lg" onClick={() => navigate("/shop")}>Shop the catalog</Button>
      </section>
    </div>
  );
};

export default Home;
