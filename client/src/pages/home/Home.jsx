import { useCartActions } from "@/hooks/useCartActions";
import { useHomeMedia } from "@/pages/home/useHomeMedia";
import HomeHero from "@/pages/home/HomeHero";
import HomeCategories from "@/pages/home/HomeCategories";
import HomeProductEdit from "@/pages/home/HomeProductEdit";
import HomeJournal from "@/pages/home/HomeJournal";
import HomeOuterwear from "@/pages/home/HomeOuterwear";
import HomeClosing from "@/pages/home/HomeClosing";

import "./home.scss";

const Home = () => {
  const media = useHomeMedia();
  const { addToCart } = useCartActions();
  return (
    <div className="homepage">
      <HomeHero products={media.hero} />
      <HomeCategories />
      <HomeProductEdit products={media.edit} onAddToCart={addToCart} />
      <HomeJournal products={media.visualJournal} />
      <HomeOuterwear products={media.outerwear} />
      <HomeClosing />
    </div>
  );
};

export default Home;
