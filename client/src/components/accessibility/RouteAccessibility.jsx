import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

const titleCase = (value) =>
  value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const getRouteLabel = (pathname) => {
  if (pathname === "/") return "Home";
  if (pathname === "/shop") return "Shop";
  if (pathname === "/checkout") return "Bag and checkout";
  if (pathname === "/search") return "Search";
  if (pathname === "/account") return "Account";
  if (pathname === "/signin") return "Sign in";
  if (pathname === "/forgot-password") return "Password recovery";

  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "shop" && parts.length >= 3) return "Product details";
  if (parts[0] === "shop" && parts[1]) {
    const normalized =
      parts[1] === "mens"
        ? "Men"
        : parts[1] === "womens"
          ? "Women"
          : titleCase(parts[1]);
    return `${normalized} collection`;
  }

  return "Page not found";
};

const RouteAccessibility = () => {
  const location = useLocation();
  const firstRender = useRef(true);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const routeLabel = getRouteLabel(location.pathname);
    document.title =
      routeLabel === "Home" ? "Noble Fits" : `${routeLabel} | Noble Fits`;

    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      const main = document.getElementById("main-content");
      if (main) main.focus({ preventScroll: true });
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      setAnnouncement(`${routeLabel} page loaded.`);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  return (
    <div
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {announcement}
    </div>
  );
};

export default RouteAccessibility;
