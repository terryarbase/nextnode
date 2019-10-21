import { css } from 'glamor';
import PropTypes from 'prop-types';
import React from 'react';
import classes from './styles';
import sizes from './sizes';

function Container ({
	className,
	clearFloatingChildren,
	component: Component,
	width,
	...props
}) {
	props.className = css(
		classes.container,
		classes[width],
		clearFloatingChildren ? classes.clearfix : null,
		className
	);

	return <Component {...props} />;
};

Container.propTypes = {
	clearFloatingChildren: PropTypes.bool,
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]).isRequired,
	width: PropTypes.oneOf(Object.keys(sizes)).isRequired,
};
Container.defaultProps = {
	component: 'div',
	width: 'large',
};

export default Container;
