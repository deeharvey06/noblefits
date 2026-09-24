import { CATEGORY_LINKS, ROUTES } from "@/config/routes";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppLink as Link,
  AppNavLink as NavLink,
} from "@/components/navigation/AppLink";

import logoUrl from "@/assets/crown.svg";
import { Drawer, IconButton } from "@/design-system";
import { selectCartHidden } from "@/redux/cart/cartSelectors";
import { signOutStart } from "@/redux/user/actions";
import { selectCurrentUser } from "@/redux/user/userSelector";
import CartDropdown from "@/components/cartDropdown/CartDropdown";
import CartIcon from "@/components/cartIcon/CartIcon";
import SearchPanel from "@/components/searchPanel/SearchPanel";

import "./header.scss";

const categories = CATEGORY_LINKS;

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M4 7h16M4 12h16M4 17h16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle
      cx="11"
      cy="11"
      r="6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const AccountIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle
      cx="12"
      cy="8"
      r="3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M5.5 20c.7-4 3-6 6.5-6s5.8 2 6.5 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>
);

const Header = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const cartHidden = useSelector(selectCartHidden);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const openSearch = () => {
    setMobileMenuOpen(false);
    setSearchOpen(true);
  };

  const handleSignOut = () => {
    setMobileMenuOpen(false);
    dispatch(signOutStart());
  };

  return (
    <>
      <div className="announcement-bar">
        <div className="announcement-bar__inner ds-container">
          <span>Noble Fits</span>
          <Link to={ROUTES.shop}>
            Shop the collection <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <header className="site-header">
        <div className="site-header__main ds-container">
          <div className="site-header__mobile-menu">
            <IconButton
              label="Open navigation menu"
              aria-haspopup="dialog"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-site-navigation"
              onClick={() => setMobileMenuOpen(true)}
              className="site-header__icon-button"
            >
              <MenuIcon />
            </IconButton>
          </div>

          <Link
            className="site-header__brand"
            to={ROUTES.home}
            aria-label="Noble Fits home"
          >
            <img
              className="site-header__logo"
              src={logoUrl}
              alt=""
              aria-hidden="true"
            />
            <span className="site-header__wordmark">Noble Fits</span>
          </Link>

          <nav
            className="site-header__primary-nav"
            aria-label="Primary navigation"
          >
            <NavLink
              to={ROUTES.home}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
              end
            >
              Home
            </NavLink>
            <NavLink
              to={ROUTES.shop}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              Shop
            </NavLink>
          </nav>

          <div className="site-header__actions">
            <button
              type="button"
              className="site-header__text-action site-header__search-action"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              aria-controls="site-search-drawer"
              onClick={openSearch}
            >
              <SearchIcon />
              <span>Search</span>
            </button>

            <Link
              className="site-header__text-action site-header__account-action"
              to={currentUser ? ROUTES.account : ROUTES.signIn}
            >
              <AccountIcon />
              <span>{currentUser ? "Account" : "Sign in"}</span>
            </Link>

            <CartIcon />
          </div>

          {!cartHidden && <CartDropdown />}
        </div>

        <nav
          className="site-header__category-nav"
          aria-label="Shop by category"
        >
          <div className="site-header__category-inner ds-container">
            {categories.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  isActive ? "is-active" : undefined
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <Drawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="Menu"
        side="left"
        id="mobile-site-navigation"
        className="mobile-navigation-drawer"
      >
        <nav className="mobile-navigation" aria-label="Mobile navigation">
          <div className="mobile-navigation__primary">
            <NavLink
              to={ROUTES.home}
              onClick={closeMobileMenu}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
              end
            >
              Home
            </NavLink>
            <NavLink
              to={ROUTES.shop}
              onClick={closeMobileMenu}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              Shop all
            </NavLink>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-controls="site-search-drawer"
              onClick={openSearch}
            >
              Search <span aria-hidden="true">⌕</span>
            </button>
          </div>

          <div className="mobile-navigation__section">
            <p>Shop by category</p>
            {categories.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  isActive ? "is-active" : undefined
                }
              >
                {label}
                <span aria-hidden="true">→</span>
              </NavLink>
            ))}
          </div>

          <div className="mobile-navigation__section mobile-navigation__account">
            <p>Account</p>
            {currentUser ? (
              <>
                <Link to={ROUTES.account} onClick={closeMobileMenu}>
                  Account
                </Link>
                <button type="button" onClick={handleSignOut}>
                  Sign out
                </button>
              </>
            ) : (
              <Link to={ROUTES.signIn} onClick={closeMobileMenu}>
                Sign in
              </Link>
            )}
            <Link to={ROUTES.checkout} onClick={closeMobileMenu}>
              Bag & checkout
            </Link>
          </div>
        </nav>
      </Drawer>

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;
