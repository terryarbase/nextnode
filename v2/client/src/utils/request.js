import xhr from 'xhr';
import {
  reactLocalStorage,
} from 'reactjs-localstorage';

import {
  storageName,
  endpoint,
  defaultLang,
  apiVersionV2,
} from './../config/constants.json';

// context
import {
  pretendSignout,
} from "./../store/user/context";

const getHeaders = header => {
  let headers = {
    ...header,
  };
  const sessionToken = localStorage.getItem(storageName.sessionToken);
  if (sessionToken) {
    headers = {
      ...headers,
      'Authorization': `Bearer ${sessionToken}`,
    };
  }

  return headers;
}

const commonRequest = ({
  url,
  method='get',
  data=new FormData(),
  header={},
  isAuth=true,
  // user store control
  history,
  // dispatch,
}) => {
  const uiLanguage = reactLocalStorage.get(storageName.uiLanguage);
  return new Promise((done, reject) => {
    const headers = isAuth ? getHeaders(header) : { 
      ...header,
      language: uiLanguage || defaultLang,
    };
    xhr({
      url: `${endpoint}${apiVersionV2}${url}`,
      responseType: 'json',
      method,
      data,
      headers,
    }, (err, {
      statusCode,
    }, body) => {
      // unauth redirect handling
      if (statusCode === 403) {
        window.console.warn('Redirect to Login.');
        // true: force redirect to login with the current url forwarding
        pretendSignout(history, true);
      } else if (statusCode === 200) {
        // if v2 api will be return the info under data field
        done(body.data || body);
      } else {
        reject({
          error: body && body.error,
          statusCode,
        });
      }
    });
  });
}

export default commonRequest;
