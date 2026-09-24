import { ROUTES } from "@/config/routes";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { AppLink as Link } from "@/components/navigation/AppLink";

import "./notFoundPage.scss";

const NotFoundPage = () => {
  useDocumentTitle("Page not found | Noble Fits");

  return (
    <section
      className="not-found-page ds-container"
      aria-labelledby="not-found-title"
    >
      <p className="not-found-page__eyebrow">404</p>
      <h1 id="not-found-title">We couldn’t find that page.</h1>
      <p className="not-found-page__copy">
        The address may have changed, or the page may no longer exist. Continue
        browsing from the shop or return home.
      </p>
      <div className="not-found-page__actions">
        <Link
          to={ROUTES.shop}
          className="ds-button ds-button--primary ds-button--md"
        >
          <span className="ds-button__label">Browse the shop</span>
        </Link>
        <Link
          to={ROUTES.home}
          className="ds-button ds-button--secondary ds-button--md"
        >
          <span className="ds-button__label">Return home</span>
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
