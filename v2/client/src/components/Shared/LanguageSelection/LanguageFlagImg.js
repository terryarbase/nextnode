import React from "react";

// styles
import useStyles from "./styles";

const LanguageFlagImg = ({ info: { icon, label } }) => {
  const classes = useStyles();
  return (
    <img
      src={`data:image/png;base64,${icon}`}
      alt={label}
      className={classes.localizationIconImage}
    />
  );
};

export default LanguageFlagImg;