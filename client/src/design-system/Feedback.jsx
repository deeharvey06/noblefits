
import Button from "./Button";
import IconButton from "./IconButton";

export const Notification = ({
  status = "info",
  title,
  children,
  onDismiss,
  className = "",
}) => (
  <div
    className={`ds-notification ds-notification--${status} ${className}`.trim()}
    role={status === "error" ? "alert" : "status"}
  >
    <div className="ds-notification__body">
      {title && <strong className="ds-notification__title">{title}</strong>}
      <div className="ds-notification__message">{children}</div>
    </div>
    {onDismiss && (
      <IconButton label="Dismiss notification" size="sm" onClick={onDismiss}>
        <span aria-hidden="true">×</span>
      </IconButton>
    )}
  </div>
);

export const Skeleton = ({
  shape = "text",
  width,
  height,
  className = "",
}) => (
  <span
    className={`ds-skeleton ds-skeleton--${shape} ${className}`.trim()}
    style={{ width, height }}
    aria-hidden="true"
  />
);

const StatePanel = ({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  status = "neutral",
  children,
  className = "",
  role,
}) => (
  <section
    className={`ds-state ds-state--${status} ${className}`.trim()}
    role={role}
  >
    {eyebrow && <span className="ds-state__eyebrow">{eyebrow}</span>}
    <h2 className="ds-state__title">{title}</h2>
    {description && <p className="ds-state__description">{description}</p>}
    {children}
    {actionLabel && onAction && (
      <Button variant="secondary" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </section>
);

export const EmptyState = (props) => <StatePanel status="neutral" {...props} />;

export const ErrorState = (props) => (
  <StatePanel status="error" role="alert" {...props} />
);

export const LoadingState = ({ label = "Loading", className = "" }) => (
  <div className={`ds-loading-state ${className}`.trim()} role="status">
    <span className="ds-loading-state__spinner" aria-hidden="true" />
    <span>{label}</span>
  </div>
);
