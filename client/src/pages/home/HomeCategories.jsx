import Directory from "@/components/directory/Directory";

const HomeCategories = () => {
  return (
    <section className="home-section" aria-labelledby="home-categories-title">
      <div className="home-section__header">
        <div>
          <span className="home-eyebrow">Shop by category</span>
          <h2 id="home-categories-title">Find your lane.</h2>
        </div>
        <p>
          Five collections, each with its own product mix. Pick a category and
          move straight into the merchandise.
        </p>
      </div>
      <Directory />
    </section>
  );
};

export default HomeCategories;
