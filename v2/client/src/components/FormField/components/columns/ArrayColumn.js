import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import ItemsTableCell from '../ItemsTableCell';
import ItemsTableValue from '../ItemsTableValue';

var ArrayColumn = createClass({
	displayName: 'ArrayColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
	},
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value || !value.length) return null;

		return value.join(', ');
	},
	render () {
		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.type}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

export default ArrayColumn;
