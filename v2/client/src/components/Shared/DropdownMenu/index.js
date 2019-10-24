import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  Grid,
  IconButton,
  ClickAwayListener,
  Typography,
  Grow,
  Paper,
  MenuList,
  Popper,
} from "@material-ui/core";
import {
  ArrowDropDown as ArrowDropDownIcon,
} from "@material-ui/icons";

// styles
import useStyles from "./styles";

// DropdownMenu Button Component
const DropdownMenuButton = ({ info: { label, icon } }) => {
  const classes = useStyles();

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.dropDownButtonContainer}
    >
      <Grid item>
        {icon}
      </Grid>
      <Grid item>
        {label}
      </Grid>
      <Grid item>
        <ArrowDropDownIcon className={classes.dropDownButtonIcon} />
      </Grid>
    </Grid>
  );
}

/*
** Common functional component for dropdown menu
** Terry Chan
** 17/10/2019 
*/
export default function DropdownMenu(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);
  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleListKeyDown = event => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  // global
  const {
    list,
    info: {
      title,
    },
    // onChanged,
  } = props;
  return (
    <React.Fragment>
      <IconButton
        ref={anchorRef}
        aria-controls="menu-list-grow"
        aria-haspopup="true"
        onClick={handleToggle}
      >
         <DropdownMenuButton { ...props } />
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper id="menu-list-grow">
              {
                !!title && 
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                  className={classes.dropDownSelectionLabel}
                >
                  {title}
                </Typography>
              }
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
                  {
                    list
                  }
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}

DropdownMenu.propTypes = {
  info: PropTypes.shape({
    icon: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    title: PropTypes.string,
  }).isRequired,
  list: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.array.isRequired,
  ]),
  // onChanged: PropTypes.func.isRequired,
};
