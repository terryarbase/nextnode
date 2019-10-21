import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import ItemsTableCell from '../ItemsTableCell';
import ItemsTableValue from '../ItemsTableValue';

var InvalidColumn = createClass({
	displayName: 'InvalidColumn',
	propTypes: {
		col: PropTypes.object,
	},
	renderValue () {
		return (
			<ItemsTableValue field={this.props.col.type}>
				(Invalid Type: {this.props.col.type})
			</ItemsTableValue>
		);

	},
	render () {
		return (
			<ItemsTableCell>
				{this.renderValue()}
			</ItemsTableCell>
		);
	},
});

export default InvalidColumn;
