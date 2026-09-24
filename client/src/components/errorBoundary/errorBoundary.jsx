import { ROUTES } from "@/config/routes";
import { Component } from "react";

import "./errorBoundary.scss";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Noble Fits UI error", error, info);
  }

  componentDidUpdate(previousProps) {
    if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section
          className="error-boundary"
          role="alert"
          aria-labelledby="error-boundary-title"
        >
          <div className="error-boundary__mark" aria-hidden="true">
            !
          </div>
          <h2 id="error-boundary-title">Something went wrong</h2>
          <p>
            This part of Noble Fits could not load. Try again, or return to the
            shop and continue browsing.
          </p>
          <div className="error-boundary__actions">
            <button
              type="button"
              className="ds-button ds-button--primary ds-button--md"
              onClick={this.handleRetry}
            >
              <span className="ds-button__label">Try again</span>
            </button>
            <a
              href={ROUTES.shop}
              className="ds-button ds-button--secondary ds-button--md"
            >
              <span className="ds-button__label">Return to shop</span>
            </a>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
