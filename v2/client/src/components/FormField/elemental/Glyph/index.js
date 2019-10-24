import { css } from 'glamor';
import React from 'react';
import PropTypes from 'prop-types';

import octicons from './octicons';
import colors from './colors';
import sizes from './sizes';
import classes from './styles';

// FIXME static octicon classes leaning on Elemental to avoid duplicate
// font and CSS; inflating the project size

function Glyph ({
	cssStyles,
	className,
	color,
	component: Component,
	name,
	size,
	style,
	...props
}) {
	const colorIsValidType = Object.keys(colors).includes(color);
	props.className = css(
		classes.glyph,
		colorIsValidType && classes['color__' + color],
		classes['size__' + size],
		cssStyles
	) + ` ${octicons[name]}`;
	if (className) {
		props.className += (' ' + className);
	}

	// support random color strings
	props.style = {
		color: !colorIsValidType ? color : null,
		...style,
	};

	return <Component {...props} />;
};

Glyph.propTypes = {
	color: PropTypes.oneOfType([
		PropTypes.oneOf(Object.keys(colors)),
		PropTypes.string, // support random color strings
	]),
	cssStyles: PropTypes.shape({
		_definition: PropTypes.object,
		_name: PropTypes.string,
	}),
	name: PropTypes.oneOf(Object.keys(octicons)).isRequired,
	size: PropTypes.oneOf(Object.keys(sizes)),
};
Glyph.defaultProps = {
	component: 'i',
	color: 'inherit',
	size: 'small',
};

export default Glyph;
