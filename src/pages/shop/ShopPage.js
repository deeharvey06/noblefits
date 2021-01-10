import React, { Component } from 'react';

import CollectionPreview from '../../components/collectionPreview/CollectionPreview';

import SHOP_DATA from './shopData.js'

import './shopPage.scss';

class ShopPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collections: SHOP_DATA
    }
  }

  renderPreviews = () => (
    this.state.collections.map(({ id, ...otherCollectionProps}) => (
      <CollectionPreview key={id} {...otherCollectionProps} />
    ))
  );

  render() {
    return (
      <div>
        { this.renderPreviews() }
      </div>
    );
  }
}

export default ShopPage;