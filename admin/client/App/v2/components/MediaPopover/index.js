/*
** Hook Component
** Loading on CMS Media Model data
** Using internal data fetching instead of using redux fetching
** Terry Chan
** @UPDATED: 12/06/2020
** @CREATED: 12/06/2020
*/
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
	Button,
	Dialog,
	ListItemText,
	ListItem,
	List,
	Divider,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Slide,
} from '@material-ui/core';
import {
	Close as CloseIcon,
} from '@material-ui/icons/Close';

// hooking
import {
	useToggle,
} from './../../hook';
import useModalStyles from './style';

// transition effect
const Transition = React.forwardRef((props, ref) => (<Slide direction="up" ref={ref} {...props} />));

const MediaPopover = ({
	t,
	...props,
}) => {
	const classes = useModalStyles();
	const [ isOpen, swtichOpen ] = useToggle(props.open);

	return (
		<div>
		  <Dialog fullScreen open={isOpen} onClose={swtichOpen} TransitionComponent={Transition}>
		    <AppBar className={classes.appBar}>
		      <Toolbar>
		        <IconButton edge="start" color="inherit" onClick={swtichOpen} aria-label="close">
		          <CloseIcon />
		        </IconButton>
		        <Typography variant="h6" className={classes.title}>
		        	{t('v2.page.media.center.title')}
		        </Typography>
		      </Toolbar>
		    </AppBar>
		  </Dialog>
		</div>
	);
}

MediaPopover.propTypes = {
	t: React.PropTypes.func,
	open: React.PropTypes.bool,
};

module.exports = MediaPopover;
