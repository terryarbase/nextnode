import React from "react";
// import _ from "lodash";
// import qs from 'query-string';
import {
  reactLocalStorage,
} from 'reactjs-localstorage';
import {
  Redirect,
} from "react-router-dom";

import {
  main,
  storageName,
} from './../../config/constants.json';

// context
import {
  useUserState,
} from "./../../store/user/context";

/*
** Auto login the user account by the sessionToken, or re-generate the sessionToken by the refreshToken
** No /login redirect is allowed
** Terry Chan
** 15/10/2019
*/
function AutoForward(props) {
  // global
  const { isAuthenticated } = useUserState();
  // const userDispatch = useUserDispatch();
  // const urlQuery = qs.parse(props.location.search);
  // if the user already login
  if (isAuthenticated) {
    const {
      forwardUrl,
    } = storageName;
    let to = reactLocalStorage.get(forwardUrl);
    if (to) {
      reactLocalStorage.remove(forwardUrl);
      to = decodeURIComponent(to);
      return (
        <Redirect to={to} />
      );
    }
    return (
      <Redirect to={main} />
    );
  }

  return (
    <Redirect to="/sign" />
  );
}

export default AutoForward;
