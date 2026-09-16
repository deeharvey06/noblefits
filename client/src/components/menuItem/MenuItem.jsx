import { Link } from "react-router";

import { ResilientImage } from "../../design-system";

import "./menuItem.scss";

const MenuItem = ({ title, imageUrl, size, linkUrl }) => {
  const destination = linkUrl.startsWith("/") ? linkUrl : `/${linkUrl}`;
  const displayTitle = title === "womens" ? "Women" : title === "mens" ? "Men" : title;

  return (
    <Link
      className={`${size || ""} menu-item`}
      to={destination}
      aria-label={`Shop ${displayTitle}`}
    >
      <ResilientImage
        className="menu-item__image"
        src={imageUrl}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <span className="menu-item__content">
        <span className="menu-item__title">{displayTitle}</span>
        <span className="menu-item__action">
          Shop collection <span aria-hidden="true">↗</span>
        </span>
      </span>
    </Link>
  );
};

export default MenuItem;
