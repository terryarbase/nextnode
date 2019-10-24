/**
 * Render a popout pane, calls props.onLayout when the component mounts
 */

import React from 'react';
import PropTypes from 'prop-types';
import blacklist from 'blacklist';
import classnames from 'classnames';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

var PopoutPane = createClass({
	displayName: 'PopoutPane',
	propTypes: {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
		onLayout: PropTypes.func,
	},
	getDefaultProps () {
		return {
			onLayout: () => {},
		};
	},
	componentDidMount () {
		this.props.onLayout(this.refs.el.offsetHeight);
	},
	render () {
		const className = classnames('Popout__pane', this.props.className);
		const props = blacklist(this.props, 'className', 'onLayout');

		return (
			<div ref="el" className={className} {...props} />
		);
	},
});

export default PopoutPane;
