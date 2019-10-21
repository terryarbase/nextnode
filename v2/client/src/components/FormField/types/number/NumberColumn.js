import React from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var NumberColumn = createClass({
	displayName: 'NumberColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
	},
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (value === undefined || isNaN(value)) return null;

		const formattedValue = (this.props.col.path === 'money') ? numeral(value).format('$0,0.00') : value;

		return formattedValue;
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

export default NumberColumn;
