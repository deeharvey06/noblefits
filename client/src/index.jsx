import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./redux/store";
import Spinner from "./components/spinner/Spinner";
import ErrorBoundary from "./components/errorBoundary/errorBoundary";

import "./styles/design-system.scss";
import "./design-system/components.scss";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Noble Fits could not find the #root element.");
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate loading={<Spinner />} persistor={persistor}>
          <ErrorBoundary resetKey="application-root">
            <App />
          </ErrorBoundary>
        </PersistGate>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
