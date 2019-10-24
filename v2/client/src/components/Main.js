import React from "react";
import clsx from "clsx";
import {
  reactLocalStorage,
} from 'reactjs-localstorage';
import {
  Grid,
  Fade,
  LinearProgress,
} from "@material-ui/core";

// configurations
import {
  storageName,
  logo,
  name,
  endpoint,
} from './../config/constants.json';
// styles
import useLoginStyles from "./../pages/login/styles";
// context
import {
  useUserState,
  useUserDispatch,
  getUserSession,
} from "./../store/user/context";
import {
  uiAlready,
  useLayoutState,
  useLayoutDispatch,
} from "./../store/layout/context";

function Main(props) {
  // styles
  const classes = useLoginStyles();
  // global dispatch
  const userDispatch = useUserDispatch();
  const layoutDispatch = useLayoutDispatch();
  // global state
  const {
    userLoading,
    isAuthenticated,
  } = useUserState();
  const {
    uiReady,
  } = useLayoutState();
  // local storage session token
  const sessionToken = reactLocalStorage.get(storageName.sessionToken);
  // auto login the user account if session token provided
  if (!isAuthenticated && sessionToken && !userLoading && !uiReady) {
    getUserSession(userDispatch, layoutDispatch);
  } else if (!uiReady && !sessionToken){
    uiAlready(layoutDispatch);
  }
  // until the user session authorization is finished
  if (!uiReady) {
    return (
      <Fade in>
        <Grid container className={classes.container}>
          <LinearProgress color="primary" className={classes.landingGrow} />
          <div className={clsx(classes.logotypeContainer, classes.fullLogoContainer)}>
            <img src={`${endpoint}${logo}`} alt={name} className={classes.logotypeImage} />
          </div>
        </Grid>
      </Fade>
    );
  }
  // go through the routing
  return props.children;
}

export default Main;
