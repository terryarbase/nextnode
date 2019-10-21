import i18n from 'i18n-js';
import {
  reactLocalStorage,
} from 'reactjs-localstorage';

import {
  defaultLang,
  storageName,
} from './../config/constants.json';

import en from './locales/en';
import zhtw from './locales/zhtw';
import zhcn from './locales/zhcn';

const uiLanguage = reactLocalStorage.get(storageName.uiLanguage);

i18n.locale = uiLanguage || defaultLang;
i18n.fallbacks = true;
// null value for ui handleing
i18n.missingTranslation = () => undefined;
i18n.translations = {
  en,
  zhtw,
  zhcn,
};

export default i18n;