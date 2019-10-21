/**
 * Render the body of a popout
 */

import React from 'react';
import blacklist from 'blacklist';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

var PopoutBody = createClass({
	displayName: 'PopoutBody',
	propTypes: {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
		scrollable: PropTypes.bool,
	},
	render () {
		const className = classnames('Popout__body', {
			'Popout__scrollable-area': this.props.scrollable,
		}, this.props.className);
		const props = blacklist(this.props, 'className', 'scrollable');

		return (
			<div className={className} {...props} />
		);
	},
});

export default PopoutBody;
