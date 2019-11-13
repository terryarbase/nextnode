import React from 'react';
import _ from 'lodash';
import {
  Tabs,
  Tab,
  Grid,
  Typography,
} from '@material-ui/core';

// styles
import useStyles from "./../LanguageSelection/styles";

// components
import LanguageFlagImg from "./../LanguageSelection/LanguageFlagImg";

// context
import {
  useUserState,
} from "./../../../store/user/context";

// utils
import {
  getCurrentLanguageInfo,
} from "./../../../utils/misc";

// locale
import i18n from "./../../../i18n";

export default function LanguageTab(props) {
  const classes = useStyles();
  const {
    info: {
      nextnode: {
        localization,
        defaultLanguage,
      },
    },
  } = useUserState();

  const {
    onChangeLanguage,
    language,
  } = props;
  const handleChange = (event, newValue) => {
    onChangeLanguage(newValue);
  };

  let languageInfo = getCurrentLanguageInfo({
    localization,
    defaultLanguage,
    language,
  });

  const tabList = _.keys(localization).map(lang => {
    languageInfo = getCurrentLanguageInfo({
      language: lang,
      localization, 
      defaultLanguage,
    });
    const {
      value,
      label,
    } = localization[lang];
    return (
      <Tab value={value} label={label} key={value} icon={<LanguageFlagImg info={languageInfo} />} />
    );
  });

  return (
    <Grid container
      direction="row"
      justify="flex-start"
      alignItems="center"
    >
      <Grid item>
        <Typography variant="h5" color="secondary" className={classes.languageTabTitle}>
          {i18n.t('common.changeContentLanguageLabel')}:
        </Typography>
      </Grid>
      <Grid item>
        <Tabs
          value={languageInfo.value}
          indicatorColor="secondary"
          textColor="secondary"
          onChange={handleChange}
        >
          {tabList}
        </Tabs>
      </Grid>
    </Grid> 
  );
}