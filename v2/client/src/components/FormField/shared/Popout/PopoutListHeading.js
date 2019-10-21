/**
 * Render a popout list heading
 */

import React from 'react';
import PropTypes from 'prop-types';
import blacklist from 'blacklist';
import classnames from 'classnames';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

var PopoutListHeading = createClass({
	displayName: 'PopoutListHeading',
	propTypes: {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
	},
	render () {
		const className = classnames('PopoutList__heading', this.props.className);
		const props = blacklist(this.props, 'className');

		return (
			<div className={className} {...props} />
		);
	},
});

export default PopoutListHeading;
