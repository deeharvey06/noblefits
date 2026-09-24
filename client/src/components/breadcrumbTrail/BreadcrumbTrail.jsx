import { ROUTES, collectionPath } from "@/config/routes";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

import { Breadcrumbs } from "@/design-system";
import { selectCollections } from "@/redux/shop/shopSelector";
import { findProductByRoute } from "@/utils/productRoutes";

import "./breadcrumbTrail.scss";

const collectionLabels = {
  hats: "Hats",
  jackets: "Jackets",
  sneakers: "Sneakers",
  womens: "Women",
  mens: "Men",
};

const BreadcrumbTrail = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const collections = useSelector(selectCollections);

  if (pathname === ROUTES.home) return null;

  const items = [{ label: "Home", href: ROUTES.home }];

  if (pathname.startsWith(ROUTES.shop)) {
    items.push({ label: "Shop", href: ROUTES.shop });
    const [, , collectionId, productId] = pathname.split("/");
    if (collectionId) {
      items.push({
        label: collectionLabels[collectionId] || collectionId,
        href: collectionPath(collectionId),
      });
    }
    if (collectionId && productId) {
      const { product } = findProductByRoute(
        collections,
        collectionId,
        productId,
      );
      items.push({
        label: product?.name || "Product",
        href: pathname,
      });
    }
  } else if (pathname === ROUTES.search) {
    items.push({ label: "Search", href: ROUTES.search });
  } else if (pathname === ROUTES.checkout) {
    items.push({ label: "Bag & checkout", href: ROUTES.checkout });
  } else if (pathname === ROUTES.signIn) {
    items.push({ label: "Sign in", href: ROUTES.signIn });
  } else if (pathname === ROUTES.forgotPassword) {
    items.push({ label: "Password reset", href: ROUTES.forgotPassword });
  } else if (pathname === ROUTES.account) {
    items.push({ label: "Account", href: ROUTES.account });
  }

  const routerItems = items.map((item, index) => ({
    ...item,
    onClick:
      index < items.length - 1
        ? (event) => {
            event.preventDefault();
            navigate(item.href);
          }
        : undefined,
  }));

  return <Breadcrumbs items={routerItems} className="site-breadcrumbs" />;
};

export default BreadcrumbTrail;
