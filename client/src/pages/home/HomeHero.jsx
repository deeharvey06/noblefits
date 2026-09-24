import { Button } from "@/design-system";
import ProductMediaLink from "@/pages/home/ProductMediaLink";
import { useNavigate } from "react-router";
import { ROUTES, collectionPath } from "@/config/routes";

const HomeHero = ({ products }) => {
  const [heroPrimary, heroSecondary, heroAccent] = products;
  const navigate = useNavigate();
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__copy">
        <span className="home-eyebrow">Noble Fits / The Edit</span>
        <h1 id="home-hero-title">Build your everyday rotation.</h1>
        <p>
          A visual way into the catalog—clothing, outerwear, sneakers, and
          accessories, with every image leading somewhere useful.
        </p>
        <div className="home-hero__actions">
          <Button size="lg" onClick={() => navigate(ROUTES.shop)}>
            Shop all
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate(collectionPath("womens"))}
          >
            Shop women
          </Button>
        </div>
      </div>

      <div className="home-hero__media" aria-label="Featured products">
        <ProductMediaLink
          product={heroPrimary}
          className="home-hero-card home-hero-card--primary"
        />
        <div className="home-hero__side-stack">
          <ProductMediaLink
            product={heroSecondary}
            className="home-hero-card home-hero-card--secondary"
          />
          <ProductMediaLink
            product={heroAccent}
            className="home-hero-card home-hero-card--accent"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
