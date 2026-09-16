import { cloneElement, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import IconButton from "./IconButton";


const overlayExitDuration = 220;

const requestFrame = (callback) =>
  window.requestAnimationFrame ? window.requestAnimationFrame(callback) : window.setTimeout(callback, 0);

const cancelFrame = (frameId) =>
  window.cancelAnimationFrame ? window.cancelAnimationFrame(frameId) : window.clearTimeout(frameId);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const useOverlayPresence = (open) => {
  const [present, setPresent] = useState(open);
  const [state, setState] = useState(open ? "opening" : "closed");

  useEffect(() => {
    let frameId;
    let timeoutId;

    if (open) {
      setPresent(true);
      setState("opening");
      frameId = requestFrame(() => setState("open"));
    } else if (present) {
      setState("closed");
      timeoutId = window.setTimeout(
        () => setPresent(false),
        prefersReducedMotion() ? 0 : overlayExitDuration
      );
    }

    return () => {
      if (frameId) cancelFrame(frameId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [open, present]);

  return { present, state };
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const useModalBehavior = (open, onClose, containerRef) => {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useLayoutEffect(() => {
    if (!open) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const appRoot = document.getElementById("root");
    const rootHadInert = appRoot?.hasAttribute("inert") || false;
    const previousAriaHidden = appRoot?.getAttribute("aria-hidden");

    document.body.style.overflow = "hidden";
    if (appRoot) {
      appRoot.setAttribute("inert", "");
      appRoot.setAttribute("aria-hidden", "true");
    }

    const container = containerRef.current;
    const focusable = container
      ? Array.from(container.querySelectorAll(focusableSelector))
      : [];

    if (focusable.length) {
      focusable[0].focus();
    } else if (container) {
      container.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && onCloseRef.current) {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !container) return;

      const activeFocusable = Array.from(
        container.querySelectorAll(focusableSelector)
      );

      if (!activeFocusable.length) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = activeFocusable[0];
      const last = activeFocusable[activeFocusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      if (appRoot) {
        if (!rootHadInert) appRoot.removeAttribute("inert");
        if (previousAriaHidden === null) appRoot.removeAttribute("aria-hidden");
        else appRoot.setAttribute("aria-hidden", previousAriaHidden);
      }

      if (previousFocus && previousFocus.focus) previousFocus.focus();
    };
  }, [open, containerRef]);
};

const OverlayPortal = ({ children }) => {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
};

export const Dialog = ({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  id = "ds-dialog",
  className = "",
}) => {
  const dialogRef = useRef(null);
  const { present, state } = useOverlayPresence(open);
  useModalBehavior(present, onClose, dialogRef);
  if (!present) return null;

  return (
    <OverlayPortal>
      <div className="ds-overlay" data-state={state} role="presentation" onMouseDown={open ? onClose : undefined}>
        <section
          id={id}
          ref={dialogRef}
          tabIndex="-1"
          className={`ds-dialog ${className}`.trim()}
          data-state={state}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          aria-describedby={description ? `${id}-description` : undefined}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <header className="ds-dialog__header">
            <div>
              <h2 id={`${id}-title`} className="ds-dialog__title">
                {title}
              </h2>
              {description && (
                <p id={`${id}-description`} className="ds-dialog__description">
                  {description}
                </p>
              )}
            </div>
            {onClose && (
              <IconButton label="Close dialog" onClick={onClose}>
                <span aria-hidden="true">×</span>
              </IconButton>
            )}
          </header>
          <div className="ds-dialog__body">{children}</div>
          {actions && <footer className="ds-dialog__actions">{actions}</footer>}
        </section>
      </div>
    </OverlayPortal>
  );
};

export const Drawer = ({
  open,
  onClose,
  title,
  children,
  side = "right",
  id = "ds-drawer",
  className = "",
}) => {
  const drawerRef = useRef(null);
  const { present, state } = useOverlayPresence(open);
  useModalBehavior(present, onClose, drawerRef);
  if (!present) return null;

  return (
    <OverlayPortal>
      <div className="ds-overlay" data-state={state} role="presentation" onMouseDown={open ? onClose : undefined}>
        <aside
          id={id}
          ref={drawerRef}
          tabIndex="-1"
          className={`ds-drawer ds-drawer--${side} ${className}`.trim()}
          data-state={state}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <header className="ds-drawer__header">
            <h2 id={`${id}-title`} className="ds-drawer__title">
              {title}
            </h2>
            {onClose && (
              <IconButton label="Close drawer" onClick={onClose}>
                <span aria-hidden="true">×</span>
              </IconButton>
            )}
          </header>
          <div className="ds-drawer__body">{children}</div>
        </aside>
      </div>
    </OverlayPortal>
  );
};

export const Tooltip = ({
  children,
  content,
  position = "top",
  className = "",
}) => {
  const generatedId = useId();
  const tooltipId = `tooltip-${generatedId.replace(/:/g, "")}`;
  const [visible, setVisible] = useState(false);

  const child = isValidElement(children)
    ? cloneElement(children, {
        "aria-describedby": [children.props["aria-describedby"], tooltipId]
          .filter(Boolean)
          .join(" "),
      })
    : (
      <span tabIndex="0" aria-describedby={tooltipId}>
        {children}
      </span>
    );

  return (
    <span
      className={`ds-tooltip ${className}`.trim()}
      data-visible={visible || undefined}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocusCapture={() => setVisible(true)}
      onBlurCapture={() => setVisible(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          setVisible(false);
        }
      }}
    >
      {child}
      <span
        id={tooltipId}
        className={`ds-tooltip__content ds-tooltip__content--${position}`}
        role="tooltip"
      >
        {content}
      </span>
    </span>
  );
};
