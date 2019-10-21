/**
 * Render a popout list. Can also use PopoutListItem and PopoutListHeading
 */

import React from 'react';
import PropTypes from 'prop-types';
import blacklist from 'blacklist';
import classnames from 'classnames';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import Item from './PopoutListItem';
import Heading from './PopoutListHeading';

const PopoutList = createClass({
	displayName: 'PopoutList',
	propTypes: {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
	},
	render () {
		const className = classnames('PopoutList', this.props.className);
		const props = blacklist(this.props, 'className');

		return (
			<div className={className} {...props} />
		);
	},
});

export PopoutList;
export Item;
export Heading;
