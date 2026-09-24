import ProductMediaLink from "@/pages/home/ProductMediaLink";

const HomeJournal = ({ products }) => {
  return (
    <section
      className="home-visual-journal"
      aria-labelledby="home-journal-title"
    >
      <div className="home-visual-journal__intro">
        <span className="home-eyebrow">More ways in</span>
        <h2 id="home-journal-title">A closer look at the catalog.</h2>
        <p>
          Use the imagery to move between accessories, footwear, and everyday
          layers without repeating the same campaign shots.
        </p>
      </div>
      <div className="home-visual-journal__grid">
        {products.map((product, index) => (
          <ProductMediaLink
            key={`${product.collectionKey}-${product.id}`}
            product={product}
            className={`home-journal-card home-journal-card--${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeJournal;
