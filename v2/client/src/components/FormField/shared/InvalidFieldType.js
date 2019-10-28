/**
 * Renders an "Invalid Field Type" error
 */

import React from 'react';
import PropTypes from 'prop-types';

//locales
import i18n from './../../../i18n';

const InvalidFieldType = function ({ type, path }) {
	return (
		<div className="alert alert-danger">
			{i18n.t('list.invalidType', { type, path })}
		</div>
	);
};

InvalidFieldType.propTypes = {
	path: PropTypes.string,
	type: PropTypes.string,
};

export defaultInvalidFieldType;
