import React from "react";
import _ from 'lodash';
import {
  reactLocalStorage,
} from 'reactjs-localstorage';

import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGN_OUT_SUCCESS,
  UPDATEPROFILELANG,
  UPDATEPROFILELANG_SUCCESS,
  UPDATEPROFILELANG_FAILURE,
  INITIAL_LIST,
} from './type';

import {
  request,
} from './../../utils/request';

import {
  uiAlready,
  changeCoreLoading,
} from "./../layout/context";

import {
  storageName,
  api,
  // signin,
} from './../../config/constants.json';

// locales
import i18n from "./../../i18n";

// utils
import {
  // acceptWithRedirection,
  rejectWithRedirection,
} from "./../../utils/misc";
import List from './../../utils/list';

const UserStateContext = React.createContext();
const UserDispatchContext = React.createContext();

const initialState = {
  userLoading: false,
  profileLoading: false,
  error: null,
  info: null,
  user: null,
  isAuthenticated: false,
  listsByKey: {},
  listsByPath: {},
};

/*
** Store the List Object for each of table info
** Terry Chan
** 18/10/2019
*/
const normalizeContentList = info => {
  const {
    nextnode: {
      lists,
    },
  } = info;

  let listsByKey = {};
  let listsByPath = {};

  _.forOwn(lists, (l, key) => {
    const options = {
      ...l,
      key,
    };
    const list = new List(options);
    listsByKey = {
      ...listsByKey,
      [key]: list,
    };
    listsByPath = {
      ...listsByPath,
      [l.path]: list,
    };
  });

  return {
    listsByKey,
    listsByPath,
  };
}

const postLoginUserLanguageInfo = (info, localization) => {
  const {
    language,
    contentLanguage,
  } = info;
  if (language) {
    reactLocalStorage.set(storageName.uiLanguage, language);
    // update the i18n locale
    // i18n.locale = language;
  }
  if (contentLanguage) {
    reactLocalStorage.set(storageName.dataLanguage, contentLanguage);
  }
  const calendarLanguage = _.get(localization, `${language}.altIdentify`) || 'en-au';
  if (calendarLanguage) {
    reactLocalStorage.set(storageName.calendarLang, calendarLanguage);
  }
}

/*
** Normalize the language pack from the server to the i18n.translation section
** @Param:
**  1. language: language pack to be concatenated
**  2. currentLanguages: i18n.translations pack
**  3. field: target field to be assign to i18n.translations under the specific language
** Terry Chan
** 17/10/2019
*/
const normalizeLanguagePack = (language, field) => {
  const langPack = _.reduce(language, (t, pack, lang) => {
    const translations = _.get(t, lang);
    if (translations) {
      return {
        ...t,
        [lang]: {
          ...t[lang],
          [field]: {
            ...t[lang][field],
            ...pack,
          },
        },
      };
    }
    return t;
  }, i18n.translations);
  i18n.translations = langPack;
}

const postLoginUserInfo = info => {
  const {
    nextnode: {
      user: {
        sessionToken,
        refreshToken,
        // email,
      },
      localization,
      user,
      appLanguage,  // list fields language pack
      menuLanguage,   // menu section language pack
    },
  } = info;

  // store all of essential local storage for the user who logined
  if (sessionToken) {
    reactLocalStorage.set(storageName.sessionToken, sessionToken);
  }
  if (refreshToken) {
    reactLocalStorage.set(storageName.refreshToken, refreshToken);
  }

  postLoginUserLanguageInfo(user, localization);

  // normalize all of language pack from the server-side to i18n translations
  // const {
  //   translations,
  // } = i18n;
  normalizeLanguagePack(appLanguage, 'list');
  normalizeLanguagePack(menuLanguage, 'menu');
  // remove the entire user field from the response and store the key info to the top of user state
  _.unset(info, 'nextnode.user.sessionToken');
  _.unset(info, 'nextnode.user.refreshToken');

  return info;
}

const userReducer = (state=initialState, action) => {
  switch (action.type) {
    case LOGIN: 
      return {
        ...state,
        userLoading: true,
      };
    case LOGIN_SUCCESS:
      const info = postLoginUserInfo(action.data);
      return {
        ...state,
        info,
        defaultLanguage: _.get(info, 'nextnode.defaultLanguage'),
        user: _.get(info, 'nextnode.user'),
        userLoading: false,
        isAuthenticated: true,
      };
    case LOGIN_FAILURE: 
      return {
        ...state,
        userLoading: false,
        error: action.err,
      };
    case SIGN_OUT_SUCCESS:
      return initialState;

    // profile part
    case UPDATEPROFILELANG:
      return {
        ...state,
        profileLoading: true,
      };
    case UPDATEPROFILELANG_SUCCESS:
      const {
        data,
        field,
      } = action;
      // only update the local storage
      postLoginUserLanguageInfo(data);
      let store = 'uiLanguage';
      const target = data[field];
      if (field === 'contentLanguage') {
        store = 'language';
      }
      // console.log(field, store, target);
      return {
        ...state,
        user: {
          ...state.user,
          ...data,
        },
        [store]: target,
        profileLoading: false,
      };
    case UPDATEPROFILELANG_FAILURE: 
      return {
        ...state,
        profileLoading: false,
        error: action.err,
      };

    case INITIAL_LIST: 
      // only update the local storage
      const list = normalizeContentList(action.data);
      return {
        ...state,
        ...list,
      };

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  const [state, dispatch] = React.useReducer(userReducer, {
    ...initialState,
    sessionToken: reactLocalStorage.get(storageName.sessionToken),
    refreshToken: reactLocalStorage.get(storageName.refreshToken),
    language: reactLocalStorage.get(storageName.dataLanguage),
    uiLanguage: reactLocalStorage.get(storageName.uiLanguage),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  const context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  const context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

// ###########################################################


const refreshUserSession = async(dispatch, history) => {
  const refreshToken = reactLocalStorage.get(storageName.refreshToken);
  if (!refreshToken) {
    pretendSignout(history);
  } else {
    const sessionToken = reactLocalStorage.get(storageName.sessionToken);
    dispatch({
      type: LOGIN,
    });
    try {
      const data = new FormData();
      data.set('sessionToken', sessionToken);
      data.set('refreshToken', refreshToken);
      const result = await request({
        url: `${api.refreshSession}`,
        method: 'post',
        isAuth: false,
      });
      dispatch({
        type: LOGIN_SUCCESS,
        data: result,
      });
    } catch (err) {
      dispatch({
        type: LOGIN_FAILURE,
        err: err.error,
      });
      // pretend signout to clear all of local storage for the user
      pretendSignout(history);
    }
  }
};

const getUserSession = async(dispatch, layoutDispatch, history) => {
  dispatch({
    type: LOGIN,
  });

  try {
    const result = await request({
      url: `${api.userSession}`,
      method: 'get',
    });
    dispatch({
      type: LOGIN_SUCCESS,
      data: result,
    });

    dispatch({
      type: INITIAL_LIST,
      data: result,
    });
    // ready the ui and redirect to main dashboard
    uiAlready(layoutDispatch);

  } catch (err) {
    // session Token invalid, use refresh Token to re-gen the session token
    if (err.statusCode === 404) {
      refreshUserSession(dispatch, history);
    } else {
      dispatch({
        type: LOGIN_FAILURE,
        err: err.error,
      });
       // pretend signout to clear all of local storage for the user
      pretendSignout(history);
    }
  }
}

const loginUser = async(dispatch, listDispatch, email, password, history) => {
  dispatch({
    type: LOGIN,
  });

  try {
    const data = new FormData();
    data.set('email', email);
    data.set('password', password);
    const result = await request({
      url: `${api.signin}`,
      method: 'post',
      data,
      isAuth: false,
    });
    dispatch({
      type: LOGIN_SUCCESS,
      data: result,
    });

    dispatch({
      type: INITIAL_LIST,
      data: result,
    });
    // listDispatch

    // acceptWithRedirection(history);

  } catch (err) {
    dispatch({
      type: LOGIN_FAILURE,
      err: err.error,
    });
  }
}

const signoutUser = async(dispatch, history) => {
  try {
    await request({
      url: `${api.signout}`,
      method: 'post',
    });
    dispatch({
      type: SIGN_OUT_SUCCESS,
    });

  } catch (err) {
    // ignore if any error occurs
  }

  // no redirect with forward url case, isolate Router push
  // window.location.replace('/sign');
  window.location.href = '/sign';

};

const updateProfileLanguage = async(dispatch, layoutDispatch, field, language) => {
  dispatch({
    type: UPDATEPROFILELANG,
  });

  // turn on the global loader
  changeCoreLoading(layoutDispatch, true);

  try {
    const data = new FormData();
    data.set(field, language);
    const result = await request({
      url: `${api.userInfo}`,
      method: 'post',
      data,
    });
    dispatch({
      type: UPDATEPROFILELANG_SUCCESS,
      data: result,
      field,
    });

  } catch (err) {
    dispatch({
      type: UPDATEPROFILELANG_FAILURE,
      err: err.error,
    });
  } finally {
    // turn off the global loader
    changeCoreLoading(layoutDispatch, false);
  }
}


/*
** Only remove all of local stuffs for the user
** Terry Chan
** 15/10/2019
*/
const pretendSignout = (history, redirect=false) => {
  reactLocalStorage.remove(storageName.sessionToken);
  reactLocalStorage.remove(storageName.refreshToken);
  reactLocalStorage.remove(storageName.uiLanguage);
  reactLocalStorage.remove(storageName.dataLanguage);
  // reactLocalStorage.remove(storageName.email);
  // call misc helper for the redirection using Router
  rejectWithRedirection(history, redirect);
}

export {
  UserProvider,
  useUserState,
  useUserDispatch,
  loginUser,
  signoutUser,
  updateProfileLanguage,
  pretendSignout,
  getUserSession,
};
