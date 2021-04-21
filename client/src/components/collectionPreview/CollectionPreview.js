import React from "react";
import { useRouteMatch, useHistory } from 'react-router-dom';

import CollectionItem from "../collectionItem/CollectionItem";

import "./collectionPreview.scss";

const CollectionPreview = ({ title, items }) => {
  const history = useHistory();
  const match = useRouteMatch();

  const handleClick = () => {
    history.push(`${match.url}/${title.toLowerCase()}`);
  }

  const renderItems = () =>
    items
      .filter((item, i) => i < 4)
      .map((item) => <CollectionItem key={item.id} item={item} />);

  return (
    <div className="collection-preview">
      <h1 className="title" onClick={handleClick}>{title.toUpperCase()}</h1>
      <div className="preview">{renderItems()}</div>
    </div>
  );
};

export default CollectionPreview;
