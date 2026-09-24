import { useSearchParams } from "react-router";

import SignIn from "@/components/signIn/SignIn";
import SignUp from "@/components/signUp/SignUp";
import { ResilientImage, Tabs } from "@/design-system";
import SHOP_DATA from "@/redux/shop/shopData";

import "./signinandsignup.scss";

const heroProduct = SHOP_DATA.womens.items[5];
const accentProduct = SHOP_DATA.sneakers.items[3];

const SignInAndSignUp = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId =
    searchParams.get("mode") === "register" ? "register" : "signin";

  const setMode = (mode) => {
    setSearchParams(mode === "register" ? { mode: "register" } : {}, {
      replace: true,
    });
  };

  return (
    <div className="auth-page ds-container">
      <section
        className="auth-story"
        aria-label="Noble Fits account introduction"
      >
        <ResilientImage
          className="auth-story__image"
          src={heroProduct.imageUrl}
          alt=""
          loading="eager"
          fetchPriority="high"
        />
        <div className="auth-story__shade" aria-hidden="true" />
        <div className="auth-story__copy">
          <p className="auth-page__eyebrow">Noble Fits account</p>
          <h1>One place for your Noble Fits identity.</h1>
          <p>
            Sign in to access your profile. Your shopping bag stays on this
            browser for now.
          </p>
        </div>
        <div className="auth-story__accent" aria-hidden="true">
          <ResilientImage src={accentProduct.imageUrl} alt="" loading="lazy" />
        </div>
      </section>

      <section className="auth-workspace" aria-label="Account access">
        <header className="auth-workspace__header">
          <p className="auth-page__eyebrow">Account access</p>
          <h2>
            {activeId === "signin" ? "Welcome back." : "Join Noble Fits."}
          </h2>
          <p>
            {activeId === "signin"
              ? "Sign in and get back to the catalog."
              : "Create an account with the Firebase-backed registration flow."}
          </p>
        </header>

        <Tabs
          idPrefix="account-access"
          activeId={activeId}
          onChange={setMode}
          items={[
            { id: "signin", label: "Sign in", panel: <SignIn /> },
            { id: "register", label: "Create account", panel: <SignUp /> },
          ]}
        />
      </section>
    </div>
  );
};

export default SignInAndSignUp;
