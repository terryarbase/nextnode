import React, { useState, forwardRef } from "react";
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

const SidebarLink = forwardRef(({
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
}, activeRef) => {
  const classes = useStyles();
  // local
  const [isOpen, setIsOpen] = useState(isSidebarOpened);
  const isLinkActive = isActiveLink(link, location.pathname);
  // console.log(isLinkActive, nested, setParentIsOpen);
  // if (isLinkActive && nested && setParentIsOpen) {
  //   setParentIsOpen(true);
  // }
  const toggleCollapse = e => {
    if (isSidebarOpened) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  }
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
  let listChildren = null;
  if (!children) {
    listChildren = (
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
  } else {

    const isAllSubMisMatch = _.reduce(children, (a, { label }) => {
      if (a && (!keyword || keyword && new RegExp(_.toLower(keyword)).test(_.toLower(label)))) {
        return false;
      }
      return a;
    }, true);

    listChildren = (
      <React.Fragment>
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
        {
          children && (
            <Collapse
              in={(isOpen && isSidebarOpened) || ((!isAllSubMisMatch || isParentMatch) && isOpen)}
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
                    ref={activeRef}
                    setParentIsOpen={setIsOpen}
                    {...childrenLink}
                    // if the parent item not matched, should be pass keyword to filter later on
                    keyword={!isParentMatch ? keyword : null}
                  />
                ))}
              </List>
            </Collapse>
          )
        }
      </React.Fragment>
    );
  }

  if (isLinkActive) {
    return (
      <div ref={activeRef}>
        {listChildren}
      </div>
    );
  }

  return listChildren;
});

export default SidebarLink;
