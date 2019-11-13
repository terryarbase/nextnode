import React, { useState } from "react";
// import _ from "lodash";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  useScrollTrigger,
  LinearProgress,
  Divider,
} from "@material-ui/core";
import{
  Link,
} from "react-router-dom";
import classNames from "classnames";
import {
  // Menu as MenuIcon,
  Grade as DelegatedIcon,
  Person as PersonIcon,
  AccountCircle as AccountIcon,
  Settings as SettingIcon,
  MenuOpen as ArrowBackIcon,
} from "@material-ui/icons";

// styles
import useLoginStyles from "./../../pages/login/styles";
import useStyles from "./styles";

// components
import { Typography } from "../Wrappers/Wrappers";
import RoleList from "./RoleList";
import LanguageSelection from './../../components/Shared/LanguageSelection';

import i18n from './../../i18n';

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../store/layout/context";
import {
  useUserDispatch,
  useUserState,
  signoutUser,
} from "../../store/user/context";

import {
  name,
  endpoint,
  barLogo,
  main,
} from './../../config/constants.json';

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const LoadingBar = () => {
  const {
    coreLoad,
  } = useLayoutState();

  const classes = useStyles();
  const loginClasses = useLoginStyles();

  return (
    <LinearProgress
      color="secondary"
      className={classNames(loginClasses.landingGrow, {
        [classes.globalLoaderShow]: coreLoad,
        [classes.globalLoaderHide]: !coreLoad,
      })}
    />
  );
}

export default function Header(props) {
  const classes = useStyles();

  // global
  const {
    isSidebarOpened,
  } = useLayoutState();
  const layoutDispatch = useLayoutDispatch();
  const userDispatch = useUserDispatch();
  const {
    user: {
      name: username,
      delegated,
    },
  } = useUserState();

  // local
  const [profileMenu, setProfileMenu] = useState(null);

  return (
    <ElevationScroll {...props}>
      <AppBar position="fixed" className={classes.appBar}>
        <LoadingBar {...props} />
        <Toolbar className={classes.toolbar}>
          {
            /*
            <IconButton
              color="inherit"
              onClick={() => toggleSidebar(layoutDispatch)}
              className={classNames(
                classes.headerMenuButton,
                classes.headerMenuButtonCollapse,
              )}
            >
              {isSidebarOpened ? (
                <ArrowBackIcon
                  classes={{
                    root: classNames(
                      classes.headerIcon,
                      classes.headerIconCollapse,
                    ),
                  }}
                />
              ) : (
                <MenuIcon
                  classes={{
                    root: classNames(
                      classes.headerIcon,
                      classes.headerIconCollapse,
                    ),
                  }}
                />
              )}
            </IconButton>
            */
          }
          <Grid container justify="flex-start" alignItems="center">
            <Grid item>
              <Link to={main} className={classes.logoLink}>
                <img src={`${endpoint}${barLogo}`} alt={name} className={classes.logotypeImage} />
              </Link>
            </Grid>
            <Grid item>
              <Link to={main} className={classes.logoLink}>
                <Typography variant="h6" className={classes.logotype}>
                  {name}
                </Typography>
              </Link>
            </Grid>
          </Grid>
          <div className={classes.grow} />
          <LanguageSelection
            title={i18n.t('common.changeUILanguageLabel')}
            language={i18n.locale}
            type='language'
          />
          <IconButton
            aria-haspopup="true"
            color="inherit"
            className={classes.headerMenuButton}
            aria-controls="profile-menu"
            onClick={e => setProfileMenu(e.currentTarget)}
          >
            <AccountIcon classes={{ root: classes.headerIcon }} />
          </IconButton>
          <Menu
            id="profile-menu"
            open={Boolean(profileMenu)}
            anchorEl={profileMenu}
            onClose={() => setProfileMenu(null)}
            className={classes.headerMenu}
            classes={{ paper: classes.profileMenu }}
            disableAutoFocusItem
          >
            <div className={classes.profileMenuUser}>
              <Grid container justify="flex-start" alignItems="center" className={classes.userProfileContainer}>
                <Grid item>
                  <div>
                    <PersonIcon
                      className={classes.userProfileIcon}
                    />
                  </div>
                </Grid>
                <Grid item>
                  <Typography variant="h4" weight="medium">
                    {username}
                    {
                      delegated && (
                        <DelegatedIcon
                          fontSize="small"
                          className={classes.delegatedUserIcon}
                          alt={i18n.t('account.delegatedUser')}
                        />
                      )
                    }
                  </Typography>
                </Grid>
              </Grid>
              <RoleList {...props} />
            </div>
            <Divider />
            <MenuItem
              className={classNames(
                classes.profileMenuItem,
                classes.headerMenuItem,
              )}
            >
              <SettingIcon className={classes.profileMenuIcon} />
              {i18n.t('login.profile')}
            </MenuItem>
            <Divider />
            <div className={classes.profileMenuUser}>
              <Typography
                className={classes.profileMenuLink}
                color="primary"
                onClick={() => signoutUser(userDispatch, props.history)}
              >
                {i18n.t('login.signout')}
              </Typography>
            </div>
          </Menu>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}
