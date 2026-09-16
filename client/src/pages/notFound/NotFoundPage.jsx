import { useEffect } from "react";
import { Link } from "react-router";

import "./notFoundPage.scss";

const NotFoundPage = () => {
  useEffect(() => {
    document.title = "Page not found | Noble Fits";
  }, []);

  return (
    <section className="not-found-page ds-container" aria-labelledby="not-found-title">
      <p className="not-found-page__eyebrow">404</p>
      <h1 id="not-found-title">We couldn’t find that page.</h1>
      <p className="not-found-page__copy">
        The address may have changed, or the page may no longer exist. Continue browsing from the
        shop or return home.
      </p>
      <div className="not-found-page__actions">
        <Link to="/shop" className="ds-button ds-button--primary ds-button--md">
          <span className="ds-button__label">Browse the shop</span>
        </Link>
        <Link to="/" className="ds-button ds-button--secondary ds-button--md">
          <span className="ds-button__label">Return home</span>
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
