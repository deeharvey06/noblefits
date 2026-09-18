import { memo, useState } from "react";

const ResilientImage = ({
  src,
  alt = "",
  className = "",
  fallbackLabel = "Image unavailable",
  ...props
}) => {
  const [failed, setFailed] = useState(!src);

  const [previousSrc, setPreviousSrc] = useState(src);
  if (previousSrc !== src) {
    setPreviousSrc(src);
    setFailed(!src);
  }

  if (failed) {
    return (
      <span
        className={`ds-image-fallback ${className}`.trim()}
        role={alt ? "img" : undefined}
        aria-label={alt ? `${alt}. ${fallbackLabel}.` : undefined}
        aria-hidden={alt ? undefined : "true"}
      >
        <span className="ds-image-fallback__label" aria-hidden="true">
          {fallbackLabel}
        </span>
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
};

export default memo(ResilientImage);
