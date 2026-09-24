import { Button } from "@/design-system";
import { useNavigate } from "react-router";
import { ROUTES } from "@/config/routes";

const HomeClosing = () => {
  const navigate = useNavigate();
  return (
    <section className="home-closing" aria-labelledby="home-closing-title">
      <span className="home-eyebrow">All collections</span>
      <h2 id="home-closing-title">Keep exploring.</h2>
      <p>
        Browse the complete catalog across Men, Women, Jackets, Sneakers, and
        Hats.
      </p>
      <Button size="lg" onClick={() => navigate(ROUTES.shop)}>
        Shop the catalog
      </Button>
    </section>
  );
};

export default HomeClosing;
