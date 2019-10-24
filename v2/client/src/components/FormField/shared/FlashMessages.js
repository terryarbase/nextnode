/**
 * Render a few flash messages, e.g. errors, success messages, warnings,...
 *
 * Use like this:
 * <FlashMessages
 *   messages={{
 *	   error: [{
 *	     title: 'There is a network problem',
 *	     detail: 'Please try again later...',
 *	   }],
 *   }}
 * />
 *
 * Instead of error, it can also be hilight, info, success or warning
 */

import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
import _ from 'lodash';

import FlashMessage from './FlashMessage';

var FlashMessages = createClass({
	displayName: 'FlashMessages',
	propTypes: {
		messages: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.shape({
				error: PropTypes.array,
				hilight: PropTypes.array,
				info: PropTypes.array,
				success: PropTypes.array,
				warning: PropTypes.array,
			}),
		]),
	},
	// Render messages by their type
	renderMessages (messages, type) {
		if (!messages || !messages.length) return null;

		return messages.map((message, i) => {
			return <FlashMessage message={message} type={type} key={`i${i}`} />;
		});
	},
	// Render the individual messages based on their type
	renderTypes (types) {
		return Object.keys(types).map(type => this.renderMessages(types[type], type));
	},
	render () {
		if (!this.props.messages) return null;

		return (
			<div className="flash-messages">
				{_.isPlainObject(this.props.messages) && this.renderTypes(this.props.messages)}
			</div>
		);
	},
});

export defaultFlashMessages;
