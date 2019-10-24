/**
 * Render a footer for a popout
 */

import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

const BUTTON_BASE_CLASSNAME = 'Popout__footer__button Popout__footer__button--';

const PopoutFooter = createClass({
	displayName: 'PopoutFooter',
	propTypes: {
		children: PropTypes.node,
		primaryButtonAction: PropTypes.func,
		primaryButtonIsSubmit: PropTypes.bool,
		primaryButtonLabel: PropTypes.string,
		secondaryButtonAction: PropTypes.func,
		secondaryButtonLabel: PropTypes.string,
	},
	// Render a primary button
	renderPrimaryButton () {
		if (!this.props.primaryButtonLabel) return null;

		return (
			<button
				type={this.props.primaryButtonIsSubmit ? 'submit' : 'button'}
				className={BUTTON_BASE_CLASSNAME + 'primary'}
				onClick={this.props.primaryButtonAction}
			>
				{this.props.primaryButtonLabel}
			</button>
		);
	},
	// Render a secondary button
	renderSecondaryButton () {
		if (!this.props.secondaryButtonAction || !this.props.secondaryButtonLabel) return null;

		return (
			<button
				type="button"
				className={BUTTON_BASE_CLASSNAME + 'secondary'}
				onClick={this.props.secondaryButtonAction}
			>
				{this.props.secondaryButtonLabel}
			</button>
		);
	},
	render () {
		return (
			<div className="Popout__footer">
				{this.renderPrimaryButton()}
				{this.renderSecondaryButton()}
				{this.props.children}
			</div>
		);
	},
});

export default PopoutFooter;
