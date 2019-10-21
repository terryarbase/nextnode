import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var GeoPointColumn = createClass({
	displayName: 'GeoPointColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
	},
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value || !value.length) return null;

		const formattedValue = `${value[1]}, ${value[0]}`;
		const formattedTitle = `Lat: ${value[1]} Lng: ${value[0]}`;

		return (
			<ItemsTableValue title={formattedTitle} field={this.props.col.type}>
				{formattedValue}
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

export default GeoPointColumn;
