import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

import { Breadcrumbs } from "../../design-system";
import { selectCollections } from "../../redux/shop/shopSelector";
import { findProductByRoute } from "../../utils/productRoutes";

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

  if (pathname === "/") return null;

  const items = [{ label: "Home", href: "/" }];

  if (pathname.startsWith("/shop")) {
    items.push({ label: "Shop", href: "/shop" });
    const [, , collectionId, productId] = pathname.split("/");
    if (collectionId) {
      items.push({
        label: collectionLabels[collectionId] || collectionId,
        href: `/shop/${collectionId}`,
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
  } else if (pathname === "/search") {
    items.push({ label: "Search", href: "/search" });
  } else if (pathname === "/checkout") {
    items.push({ label: "Bag & checkout", href: "/checkout" });
  } else if (pathname === "/signin") {
    items.push({ label: "Sign in", href: "/signin" });
  } else if (pathname === "/forgot-password") {
    items.push({ label: "Password reset", href: "/forgot-password" });
  } else if (pathname === "/account") {
    items.push({ label: "Account", href: "/account" });
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
