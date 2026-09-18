import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

import { Button } from "../../design-system";
import { signOutStart } from "../../redux/user/actions";
import {
  selectCurrentUser,
  selectUserError,
  selectUserErrorContext,
  selectUserStatus,
} from "../../redux/user/userSelector";

import "./accountPage.scss";

const formatCreatedAt = (createdAt) => {
  if (!createdAt) return "Not available";
  const value =
    typeof createdAt?.toDate === "function"
      ? createdAt.toDate()
      : new Date(createdAt);
  if (Number.isNaN(value.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);
};

const AccountPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const status = useSelector(selectUserStatus);
  const authError = useSelector(selectUserError);
  const errorContext = useSelector(selectUserErrorContext);
  const displayName = currentUser?.displayName || "Noble Fits customer";
  const signOutError = errorContext === "sign-out" && authError;

  return (
    <div className="account-page ds-container">
      <header className="account-page__header">
        <p className="account-page__eyebrow">Your account</p>
        <h1>Welcome, {displayName}.</h1>
        <p>
          Review the identity information currently stored with your Noble Fits
          account and manage your sign-in session.
        </p>
      </header>

      <div className="account-page__layout">
        <div className="account-page__primary">
          <section className="account-section" aria-labelledby="profile-title">
            <div className="account-section__heading">
              <p className="account-section__eyebrow">Profile</p>
              <h2 id="profile-title">Account details</h2>
              <p>
                These details come from your existing Firebase account profile.
              </p>
            </div>

            <dl className="account-profile-list">
              <div>
                <dt>Display name</dt>
                <dd>{currentUser?.displayName || "Not provided"}</dd>
              </div>
              <div>
                <dt>Email address</dt>
                <dd>{currentUser?.email || "Not available"}</dd>
              </div>
              <div>
                <dt>Member since</dt>
                <dd>{formatCreatedAt(currentUser?.createdAt)}</dd>
              </div>
            </dl>
          </section>

          <section className="account-section" aria-labelledby="commerce-title">
            <div className="account-section__heading">
              <p className="account-section__eyebrow">Shopping</p>
              <h2 id="commerce-title">What this account currently supports</h2>
            </div>

            <div className="account-capabilities">
              <div>
                <h3>Shopping bag</h3>
                <p>
                  Your bag is stored on this browser through the existing Redux
                  persistence layer; it is not currently synchronized to your
                  account.
                </p>
                <Link to="/checkout">Review bag & checkout</Link>
              </div>
              <div>
                <h3>Orders & fulfillment</h3>
                <p>
                  The current application does not store order history, shipping
                  addresses, fulfillment status, or tracking information in an
                  account record.
                </p>
              </div>
              <div>
                <h3>Saved payment methods</h3>
                <p>
                  Noble Fits does not currently store payment methods in your
                  profile. Card entry is handled at checkout through Stripe
                  Elements.
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside
          className="account-session"
          aria-labelledby="account-access-title"
        >
          <p className="account-section__eyebrow">Access</p>
          <h2 id="account-access-title">Account session</h2>
          <p>
            Sign out of this browser when you are finished using your account.
          </p>
          {signOutError && (
            <p className="account-session__error" role="alert">
              We could not sign you out. Try again.
            </p>
          )}
          <Button
            type="button"
            variant="secondary"
            fullWidth
            loading={status === "signing-out"}
            onClick={() => dispatch(signOutStart())}
          >
            Sign out
          </Button>
        </aside>
      </div>
    </div>
  );
};

export { formatCreatedAt };
export default AccountPage;
