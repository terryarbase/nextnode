import React from "react";
import _ from "lodash";
import {
  Typography,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@material-ui/core";

// styles
import useStyles from "./styles";

// components
import DropdownMenu from "./../DropdownMenu";
import LanguageFlagImg from "./LanguageFlagImg";

// context
import {
  useUserDispatch,
  useUserState,
  updateProfileLanguage,
} from "./../../../store/user/context";
import {
  useLayoutDispatch,
} from "./../../../store/layout/context";

// utils
import {
  getCurrentLanguageInfo,
} from "../../../utils/misc";

export default function LanguageSelection(props) {
  const classes = useStyles();
  // global
  const {
    language,
    title,
    type,
  } = props;

  const {
    info: {
      nextnode: {
        localization,
        defaultLanguage,
      },
    },
    profileLoading,
  } = useUserState();

  const userDispatch = useUserDispatch();
  const layoutDispatch = useLayoutDispatch();

  const handleChangeLanguage = lang => updateProfileLanguage(userDispatch, layoutDispatch, type, lang);
  // pick the info the chosen UI language, and use the default language if the chosen is not found
  let languageInfo = getCurrentLanguageInfo({
    localization,
    defaultLanguage,
    language,
  });

  if (languageInfo) {
    const info = {
      label: languageInfo.label,
      value: languageInfo.value,
      title: title,
      icon: (<LanguageFlagImg info={languageInfo} />),
    };

    const dropdownList = _.keys(localization).map(lang => {
      languageInfo = getCurrentLanguageInfo({
        language: lang,
        localization, 
        defaultLanguage,
      });
      const {
        value,
      } = localization[lang];
      return (
        <MenuItem
          key={value}
          onClick={e => handleChangeLanguage(value)}
          selected={language === lang}
        >
          <ListItemIcon>
            <LanguageFlagImg info={languageInfo} />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            {localization[lang].label}
          </Typography>
          <Divider />
        </MenuItem>
      );
    });

    return (
      <DropdownMenu
        list={dropdownList} 
        info={info}
        onChanged={handleChangeLanguage}
      />
    );
  }

  return null;
}
