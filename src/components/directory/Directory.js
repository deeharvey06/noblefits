import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import MenuItem from "../menuItem/menuItem";

import { selectDirectorySections } from "../../redux/directory/directorySelector";

import "./directory.scss";

const Directory = ({ sections }) => {
  const renderSections = () =>
    sections.map(({ id, ...otherSectionProps }) => (
      <MenuItem key={id} {...otherSectionProps} />
    ));

  return <div className="directory-menu">{renderSections()}</div>;
};

const mapStateToProps = createStructuredSelector({
  sections: selectDirectorySections,
});

export default connect(mapStateToProps)(Directory);
