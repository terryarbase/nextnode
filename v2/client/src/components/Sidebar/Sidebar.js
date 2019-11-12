import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Drawer, IconButton, List } from "@material-ui/core";
// dynamic render for the icon
import MaterialIcons from "@material-ui/core/Icon";

import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";
import SearchBox from "./../Shared/SearchBox";
// import Dot from "./components/Dot";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../store/layout/context";
import {
  useUserState,
} from "../../store/user/context";

// configurations
import {
  main,
  listPrefix,
} from "./../../config/constants.json";

// locales
import i18n from "./../../i18n";

// utils
import {
  translateSection,
  translateListName,
} from "../../utils/multilingual";
// import {
//   isActiveLink,
// } from "../../utils/misc";

const SidebarItems = ({
  menuSection,
  location,
  isSidebarOpened,
  keyword,
}) => {
  const items = menuSection.map(s => {
    let {
      icon,
    } = s;
    icon = (
      <MaterialIcons>
        {!icon ? 'tab' : icon}
      </MaterialIcons>
    )
    // standardlize the sub menu item format
    const children = _.map(s.lists, ({ key, path, icon }) => {
      const link = `${listPrefix}/${path}`;
      return {
        id: key,
        label: translateListName(key),
        link,
        keyword,
        icon: (
          <MaterialIcons>
            {!icon ? 'tab' : icon}
          </MaterialIcons>
        ),
      };
    });
    return (
      <SidebarLink
        id={s.key}
        key={s.key}
        keyword={keyword}
        label={translateSection(s.key)}
        location={location}
        isSidebarOpened={isSidebarOpened}
        icon={icon}
        children={children}
      />
    );
  });
  const dashboardItem = (
    <SidebarLink
      id='_dashboard'
      label={i18n.t('common.dashboard')}
      link={main}
      icon={(<MaterialIcons>home</MaterialIcons>)}
      key='_dashboard'
      location={location}
      isSidebarOpened={isSidebarOpened}
    />
  );

  return [
    dashboardItem,
    ...items,
  ];
}

function Sidebar(props) {
  const classes = useStyles();
  const theme = useTheme();
  // global
  // const { isSidebarOpened } = useLayoutState();
  const layoutDispatch = useLayoutDispatch();
  const {
    info: {
      nextnode: {
        nav,
      },
    },
  } = useUserState();
  const isSidebarOpened = true; // always open
  const menuSection = _.get(nav, 'sections', []);
  // local
  const [isPermanent, setPermanent] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });
  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <MaterialIcons
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          >
            ArrowBack
          </MaterialIcons>
        </IconButton>
      </div>
      <div>
        <SearchBox placeholder={i18n.t('list.searchMenuItem')} onChange={setKeyword} />
        <List className={classes.sidebarList}>
          <SidebarItems
            isSidebarOpened={isSidebarOpened}
            menuSection={menuSection}
            keyword={keyword}
            {...props}
          />
        </List>
      </div>
    </Drawer>
  );
        
  // ##################################################################
  function handleWindowWidthChange() {
    const windowWidth = window.innerWidth;
    const breakpointWidth = theme.breakpoints.values.md;
    const isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
