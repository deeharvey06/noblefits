import React from "react";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import CollectionPreview from "../collectionPreview/CollectionPreview";

import { selectCollectionsForPreview } from "../../redux/shop/shopSelector";

import "./collectionsOverview.scss";

const CollectionsOverview = ({ collections }) => {
  const renderPreviews = () =>
    collections.map(({ id, ...otherCollectionProps }) => (
      <CollectionPreview key={id} {...otherCollectionProps} />
    ));

  return <div className="collections-overview">{renderPreviews()}</div>;
};

const mapStateToProps = createStructuredSelector({
  collections: selectCollectionsForPreview,
});

export default connect(mapStateToProps)(CollectionsOverview);
