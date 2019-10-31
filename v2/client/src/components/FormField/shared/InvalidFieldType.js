/**
 * Renders an "Invalid Field Type" error
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
	Grid,
	Typography,
} from '@material-ui/core';
import NewReleasesIcon from '@material-ui/icons/NewReleases';

//locales
import i18n from './../../../i18n';

const InvalidFieldType = function ({ type, path }) {
	return (
		<Grid
		  container
		  direction="row"
		  justify="flex-start"
		  alignItems="center"
		>
			<Grid item>
				<NewReleasesIcon />
			</Grid>
			<Grid item>
				<Typography variant="h5">
					{i18n.t('list.invalidType', { type, path })}
				</Typography>
			</Grid>
		</Grid>
	);
};

InvalidFieldType.propTypes = {
	path: PropTypes.string,
	type: PropTypes.string,
};

export default InvalidFieldType;
