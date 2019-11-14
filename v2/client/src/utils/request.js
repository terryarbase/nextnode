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

const requestHeader = ({
  header={},
  isAuth=false,
}) => {
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
  if (!isAuth) {
    const uiLanguage = reactLocalStorage.get(storageName.uiLanguage);
    headers = { 
      ...headers,
      language: uiLanguage || defaultLang,
    };
  }

  return headers;
}

const request = ({
  url,
  method='get',
  data=new FormData(),
  header={},
  isAuth=true,
  // user store control
  history,
  // dispatch,
}) => {
  
  return new Promise((done, reject) => {
    const headers = requestHeader({
      header,
      isAuth,
    });
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
        // window.console.warn('Redirect to Login.');
        // true: force redirect to login with the current url forwarding
        // pretendSignout(history, true);
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

export {
  request,
  requestHeader,
};
