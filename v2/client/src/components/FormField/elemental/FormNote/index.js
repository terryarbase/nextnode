import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classes from './styles';

function FormNote ({
	className,
	children,
	component: Component,
	html,
	...props
}) {
	props.className = css(classes.note, className);

	// Property Violation
	if (children && html) {
		console.error('Warning: FormNote cannot render `children` and `html`. You must provide one or the other.');
	}

	return html ? (
		<Component {...props} dangerouslySetInnerHTML={{ __html: html }} />
	) : (
		<Component {...props}>{children}</Component>
	);
};
FormNote.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	html: PropTypes.string,
};
FormNote.defaultProps = {
	component: 'div',
};

export default FormNote;