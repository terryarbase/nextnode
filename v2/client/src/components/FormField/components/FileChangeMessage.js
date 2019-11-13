import React from 'react';
import PropTypes from 'prop-types';
import { FormInput } from '../elemental';
import { fade } from '../../../utils/v1/color';
import theme from '../theme';

function FileChangeMessage ({ style, color, ...props }) {
	const styles = {
		marginRight: 10,
		minWidth: 0,
		marginBottom: 10,
		padding: '10px',
		...style,
	};

	if (color !== 'default') {
		styles.backgroundColor = fade(theme.color[color], 10);
		styles.borderColor = fade(theme.color[color], 30);
		styles.color = theme.color[color];
	}

	return (
		<FormInput
			noedit
			style={styles}
			{...props}
		/>
	);
};

FileChangeMessage.propTypes = {
	color: PropTypes.oneOf(['danger', 'default', 'success']),
};
FileChangeMessage.defaultProps = {
	color: 'default',
};

export default FileChangeMessage;
