import { Link, NavLink } from "react-router";

// Keep the router-specific link implementation behind the app's navigation boundary.
export const AppLink = ({ children, ...props }) => (
  <Link {...props}>{children}</Link>
);
export const AppNavLink = ({ children, ...props }) => (
  <NavLink {...props}>{children}</NavLink>
);
