import { useSelector } from "react-redux";

import { selectDirectorySections } from "../../redux/directory/directorySelector";
import MenuItem from "../menuItem/MenuItem";

import "./directory.scss";

const Directory = () => {
  const sections = useSelector(selectDirectorySections);

  return (
    <div className="directory-menu">
      {sections.map(({ id, ...section }) => <MenuItem key={id} {...section} />)}
    </div>
  );
};

export default Directory;
