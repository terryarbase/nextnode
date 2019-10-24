import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

const SUB_FIELDS = ['street1', 'suburb', 'state', 'postcode', 'country'];

var LocationColumn = createClass({
	displayName: 'LocationColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
	},
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value || !Object.keys(value).length) return null;

		const output = [];

		SUB_FIELDS.foreach((i) => {
			if (value[i]) {
				output.push(value[i]);
			}
		});
		return (
			<ItemsTableValue field={this.props.col.type} title={output.join(', ')}>
				{output.join(', ')}
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

export default LocationColumn;
