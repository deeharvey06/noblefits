
import "./spinner.scss";

const Spinner = ({ label = "Loading" }) => (
  <div className="spinner-overlay" role="status" aria-live="polite">
    <span className="spinner" aria-hidden="true" />
    <span className="sr-only">{label}</span>
  </div>
);

export default Spinner;
