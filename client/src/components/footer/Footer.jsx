import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

import logoUrl from "../../assets/crown.svg";
import { signOutStart } from "../../redux/user/actions";
import { selectCurrentUser } from "../../redux/user/userSelector";

import "./footer.scss";

const shopLinks = [
  ["Shop", "/shop"],
  ["Men", "/shop/mens"],
  ["Women", "/shop/womens"],
  ["Jackets", "/shop/jackets"],
  ["Sneakers", "/shop/sneakers"],
  ["Hats", "/shop/hats"],
];

const Footer = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  return (
    <footer className="site-footer">
      <div className="site-footer__bar ds-container">
        <Link className="site-footer__logo" to="/" aria-label="Noble Fits home">
          <img src={logoUrl} alt="" aria-hidden="true" />
          <span>Noble Fits</span>
        </Link>

        <nav className="site-footer__links" aria-label="Footer shop navigation">
          {shopLinks.map(([label, href]) => (
            <Link key={href} to={href}>{label}</Link>
          ))}
        </nav>

        <nav className="site-footer__account" aria-label="Footer account navigation">
          <Link to={currentUser ? "/account" : "/signin"}>
            {currentUser ? "Account" : "Sign in"}
          </Link>
          <Link to="/checkout">Bag</Link>
          {currentUser && (
            <button type="button" onClick={() => dispatch(signOutStart())}>Sign out</button>
          )}
        </nav>
      </div>

      <div className="site-footer__legal ds-container">
        <span>© {new Date().getFullYear()} Noble Fits</span>
        <span>Product-first fashion commerce.</span>
      </div>
    </footer>
  );
};

export default Footer;
