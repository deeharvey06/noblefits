import React from "react";
import { connect } from "react-redux";

import CollectionItem from "../../components/collectionItem/collectionItem";

import { selectCollection } from "../../redux/shop/shopSelector";

import "./collection.scss";

const CollectionPage = ({ collection }) => {
  const { title, items } = collection;

  const renderItems = () =>
    items.map((item) => (
      <CollectionItem className="collection-item" key={item.id} item={item} />
    ));

  return (
    <div className="collection-page">
      <h2 className="title">{title}</h2>
      <div className="items">{renderItems()}</div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  collection: selectCollection(ownProps.match.params.collectionId)(state),
});

export default connect(mapStateToProps)(CollectionPage);
