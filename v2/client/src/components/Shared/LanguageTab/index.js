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
    title,
  } = props;
  const handleChange = (e, lang) => {
    onChangeLanguage(lang);
  };

  const tabList = _.keys(localization).map(lang => {
    const info = getCurrentLanguageInfo({
      language: lang,
      localization, 
      defaultLanguage,
    });
    const {
      value,
      label,
    } = localization[lang];

    let newLabel = label;
    if (value === defaultLanguage) {
      newLabel = `${newLabel} (${i18n.t('list.defaultLang')})`;
    }
    return (
      <Tab value={value} label={newLabel} key={value} icon={<LanguageFlagImg info={info} />} />
    );
  });

  const languageInfo = getCurrentLanguageInfo({
    localization,
    defaultLanguage,
    language,
  });
  // console.log(language);
  return (
    <Grid container
      direction="row"
      justify="flex-start"
      alignItems="center"
    >
      {
        !!title && <Grid item>
          <Typography variant="h5" color="secondary" className={classes.languageTabTitle}>
            {title}:
          </Typography>
        </Grid>
      }
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