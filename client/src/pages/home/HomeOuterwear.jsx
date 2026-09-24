import { Button, ResilientImage } from "@/design-system";
import { useNavigate } from "react-router";
import { collectionPath } from "@/config/routes";

const HomeOuterwear = ({ products }) => {
  const [outerwearPrimary, outerwearSecondary] = products;
  const navigate = useNavigate();
  if (!outerwearPrimary) return null;
  return (
    <section className="home-editorial" aria-labelledby="home-editorial-title">
      <div className="home-editorial__media">
        <ResilientImage
          src={outerwearPrimary.imageUrl}
          alt={outerwearPrimary.name}
          loading="lazy"
        />
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
        <p>
          Move from denim layers to trenches and shearling pieces already in the
          Noble Fits jacket collection.
        </p>
        <Button
          variant="secondary"
          onClick={() => navigate(collectionPath("jackets"))}
        >
          Shop jackets
        </Button>
      </div>
    </section>
  );
};

export default HomeOuterwear;
