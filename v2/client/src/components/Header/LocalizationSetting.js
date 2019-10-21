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
import DropdownMenu from "./../Shared/DropdownMenu";

// context
import {
  useUserState,
  useUserDispatch,
  updateProfileLanguage,
} from "../../store/user/context";
import {
  useLayoutDispatch,
} from "../../store/layout/context";

// locales
import i18n from "../../i18n";

// utils
import {
  getCurrentLanguageInfo,
} from "../../utils/misc";

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

export default function LocalizationSetting(props) {
  const classes = useStyles();
  // global
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

  const handleChangeLanguage = lang => {
    if (!profileLoading) {
      updateProfileLanguage(userDispatch, layoutDispatch, 'language', lang);
    }
  }

  // pick the info the chosen UI language, and use the default language if the chosen is not found
  let languageInfo = getCurrentLanguageInfo({
    localization,
    defaultLanguage,
  });

  if (languageInfo) {
    const info = {
      label: languageInfo.label,
      value: languageInfo.value,
      title: i18n.t('common.changeUILanguageLabel'),
      icon: (<LanguageFlagImg info={languageInfo} />),
    };

    const dropdownList = _.keys(localization).map(language => {
      languageInfo = getCurrentLanguageInfo({
        language,
        localization, 
        defaultLanguage,
      });
      const {
        value,
      } = localization[language];
      return (
        <MenuItem
          key={value}
          onClick={e => handleChangeLanguage(value)}
          className={classes.menuItemIcon}
          selected={language === i18n.locale}
        >
          <ListItemIcon>
            <LanguageFlagImg info={languageInfo} />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            {localization[language].label}
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
