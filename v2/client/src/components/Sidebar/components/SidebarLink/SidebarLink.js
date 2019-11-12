import React, { useState } from "react";
import _ from 'lodash';
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import {
  ExpandLess,
  ExpandMore,
} from '@material-ui/icons';
// dynamic render for the icon
import MaterialIcons from "@material-ui/core/Icon";
import { Link } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
// import Dot from "../Dot";

// utils
// import {
//   translateSection,
// } from "./../../../../utils/multilingual";
import {
  isActiveLink,
} from "./../../../../utils/misc";

export default function SidebarLink({
  link,
  icon,
  label,
  children,
  location,
  isSidebarOpened,
  nested,
  keyword,
  type,
  setParentIsOpen,
  isActive,
}) {
  const classes = useStyles();
  // local
  const [isOpen, setIsOpen] = useState(isSidebarOpened);
  const isLinkActive = isActiveLink(link, location.pathname);
  // console.log(isLinkActive, nested, setParentIsOpen);
  // if (isLinkActive && nested && setParentIsOpen) {
  //   setParentIsOpen(true);
  // }
  const isParentMatch = !keyword || (
    keyword && new RegExp(_.toLower(keyword)).test(_.toLower(label))
  );
  if (type === "title")
    return (
      <Typography
        className={classnames(classes.linkText, classes.sectionTitle, {
          [classes.linkTextHidden]: !isSidebarOpened,
        })}
      >
        {label}
      </Typography>
    );

  if (type === "divider") return <Divider className={classes.divider} />;

  if (!children) {
    return (
      <ListItem
        button
        component={link && Link}
        to={link}
        className={classes.link}
        classes={{
          root: classnames(classes.linkRoot, {
            [classes.linkActive]: isLinkActive && !nested,
            [classes.linkNested]: nested,
            [classes.misMatchKeyword]: !isParentMatch,
          }),
        }}
        disableRipple
      >
        <ListItemIcon
          className={classnames(classes.linkIcon, {
            [classes.linkIconActive]: isLinkActive,
          })}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          classes={{
            primary: classnames(classes.linkText, {
              [classes.linkTextActive]: isLinkActive,
              [classes.linkTextHidden]: !isSidebarOpened,
            }),
          }}
          primary={label}
        />
      </ListItem>
    );
  }

  const isAllSubMisMatch = _.reduce(children, (a, { label }) => {
    if (a && (!keyword || keyword && new RegExp(_.toLower(keyword)).test(_.toLower(label)))) {
      return false;
    }
    return a;
  }, true);
  return (
    <>
      <ListItem
        button
        component={link && Link}
        onClick={toggleCollapse}
        className={classes.link}
        className={
          !isParentMatch && isAllSubMisMatch ? classes.misMatchKeyword : null
        }
        to={link}
        disableRipple
      >
        <ListItemIcon
          className={classnames(classes.linkIcon, {
            [classes.linkIconActive]: isLinkActive,
          })}
        >
          {icon ? icon : <MaterialIcons>Inbox</MaterialIcons>}
        </ListItemIcon>
        <ListItemText
          classes={{
            primary: classnames(classes.linkText, {
              [classes.linkTextActive]: isLinkActive,
              [classes.linkTextHidden]: !isSidebarOpened,
            }),
          }}
          primary={label}
        />
        {!isSidebarOpened ? null : (isOpen && isSidebarOpened  ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      {children && (
        <Collapse
          in={(isOpen && isSidebarOpened) || !isAllSubMisMatch || isParentMatch}
          timeout="auto"
          unmountOnExit
          className={classes.nestedList}
        >
          <List component="div" disablePadding>
            {children.map(childrenLink => (
              <SidebarLink
                key={childrenLink && childrenLink.link}
                location={location}
                isSidebarOpened={isSidebarOpened}
                classes={classes}
                nested
                setParentIsOpen={setIsOpen}
                {...childrenLink}
                // if the parent item not matched, should be pass keyword to filter later on
                keyword={!isParentMatch ? keyword : null}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );

  // ###########################################################

  function toggleCollapse(e) {
    if (isSidebarOpened) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  }
}
