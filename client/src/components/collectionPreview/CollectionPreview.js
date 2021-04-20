import React from "react";

import CollectionItem from "../collectionItem/CollectionItem";

import "./collectionPreview.scss";

const CollectionPreview = ({ title, items }) => {
  const renderItems = () =>
    items
      .filter((item, i) => i < 4)
      .map((item) => <CollectionItem key={item.id} item={item} />);

  return (
    <div className="collection-preview">
      <h1 className="title">{title.toUpperCase()}</h1>
      <div className="preview">{renderItems()}</div>
    </div>
  );
};

export default CollectionPreview;