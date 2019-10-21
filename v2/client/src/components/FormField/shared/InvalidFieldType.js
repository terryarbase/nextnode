/**
 * Renders an "Invalid Field Type" error
 */

import React from 'react';
import PropTypes from 'prop-types';

const InvalidFieldType = function (props) {
	return (
		<div className="alert alert-danger">
			Invalid field type <strong>{props.type}</strong> at path <strong>{props.path}</strong>
		</div>
	);
};

InvalidFieldType.propTypes = {
	path: PropTypes.string,
	type: PropTypes.string,
};

export defaultInvalidFieldType;
