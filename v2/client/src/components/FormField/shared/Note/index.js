import React from 'react';
import {
	// Tooltip,
	Typography,
} from '@material-ui/core';
import {
	Grain as GrainIcon,
} from '@material-ui/icons';

import useStyles from './styles';

import i18n from './../../../../i18n';

const Note = props => {
	const classes = useStyles();
	const {
		note,
		// placement,
	} = props;
	return (
		<Typography variant="subtitle1" className={classes.root}>
		    <GrainIcon className={classes.icon} /> {i18n.t('list.note')}: {note}
		</Typography>
		/*<Tooltip className={classes.root} title={note} aria-label={note} placement={placement || 'top-end'}>
		    <HelpIcon />
		</Tooltip>*/
	);
}

export default Note;