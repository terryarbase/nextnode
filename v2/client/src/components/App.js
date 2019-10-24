import React from "react";
import _ from "lodash";
import { Helmet } from "react-helmet";
import {
  BrowserRouter,
  Switch,
  // Redirect,
  Route,
} from 'react-router-dom';

// components
import Layout from "./Layout";
import AutoForward from "./Login/AutoForward";

// import AutoLogin from "./Login/AutoLogin";
import Main from "./Main";

// pages
import Error from "../pages/error";
import Login from "../pages/login";

// context
import { useUserState } from "../store/user/context";

// configurations
import {
  name,
  // main,
  signin,
  prefix,
} from "./../config/constants.json";

// utils
import {
  rejectWithRedirection,
} from "./../utils/misc";

import i18n from './../i18n';

export default function App(props) {
  // global
  const {
    isAuthenticated,
    // listByKey,
    // listsByPath,
    user,
  } = useUserState();
  if (isAuthenticated) {
    const uilanguage = _.get(user, 'language');
    if (uilanguage && i18n.locale !== uilanguage) {
      // window.console.warn(`Change the UI language from ${i18n.locale} to ${uilanguage}.`);
      i18n.locale = uilanguage;
    }
  }

  const PrivateRoute =({ component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={
          props => {
            if (isAuthenticated) {
              return React.createElement(component, props);
            }
            // marks for requiring the redirection
            return rejectWithRedirection(null, true);
          }
        }
      />
    );
  }

  const PublicRoute = ({ component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props => 
          isAuthenticated ? (
            <AutoForward {...props} />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }

  return (
    <div>
      <Helmet>
          <title>{name}</title>
      </Helmet>
      <Main>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" render={props => <AutoForward {...props} />} />
            <Route exact path={prefix} render={props => <AutoForward {...props} />} />
            <PrivateRoute path={prefix} component={Layout} />
            <PublicRoute path={signin} component={Login} />
            <Route component={Error} />
          </Switch>
        </BrowserRouter>
      </Main>
    </div>
  );
}
