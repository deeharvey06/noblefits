import React from "react";
import { connect } from "react-redux";

import CustomButton from "../customButton/CustomButton";
import { addItem } from "../../redux/cart/actions";

import "./collectionItem.scss";

const CollectionItem = ({ item, addItem }) => {
  const { name, price, imageUrl } = item;

  const addItems = () => {
    addItem(item);
  };

  return (
    <div className="collection-item">
      <div
        className="image"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      />
      <div className="collection-footer">
        <span className="name">{name}</span>
        <span className="price">{price}</span>
      </div>

      <CustomButton inverted onClick={addItems}>
        Add to cart
      </CustomButton>
    </div>
  );
};

export default connect(null, { addItem })(CollectionItem);
