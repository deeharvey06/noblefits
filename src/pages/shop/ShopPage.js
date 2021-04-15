import React, { Component } from "react";
import { Route } from "react-router-dom"
import { connect } from "react-redux";

import CollectionPage from "../collection/Collection";
import CollectionsOverview from "../../components/collectionsOverview/CollectionsOverview";
import { updateCollections } from "../../redux/shop/actions"
import { firestore, convertCollectionsSnapshotToMap } from "../../firebase/firebase.utils";
class ShopPage extends Component {
  unsubscribeFromSnapshot = null;

  componentDidMount() {
    const { updateCollections } = this.props;
    const collectionRef = firestore.collection('collections');

    this.unsubscribeFromSnapshot = collectionRef.onSnapshot((snapshot) => {
      const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
      updateCollections(collectionsMap);
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromSnapshot();
  }

  render() {
    const { match } = this.props
    return(
      <div className="shop-page">
        <Route exact path={`${match.path}`} component={CollectionsOverview} />
        <Route path={`${match.path}/:collectionId`} component={CollectionPage} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateCollections: collectionsMap =>
    dispatch(updateCollections(collectionsMap)),
})


export default connect(null, mapDispatchToProps)(ShopPage);
