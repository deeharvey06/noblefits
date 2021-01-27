import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import CollectionPreview from "../../components/collectionPreview/CollectionPreview";

import { selectCollections } from "../../redux/shop/shopSelector";

import "./shopPage.scss";

const ShopPage = ({ collections }) => {
  const renderPreviews = () =>
    collections.map(({ id, ...otherCollectionProps }) => (
      <CollectionPreview key={id} {...otherCollectionProps} />
    ));

  return <div>{renderPreviews()}</div>;
};

const mapStateToProps = createStructuredSelector({
  collections: selectCollections,
});

export default connect(mapStateToProps)(ShopPage);
