import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import ItemsTableCell from '../ItemsTableCell';
import ItemsTableValue from '../ItemsTableValue';

var IdColumn = createClass({
	displayName: 'IdColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
		list: PropTypes.object,
		linkTo: PropTypes.string,
	},
	renderValue () {
		const value = this.props.data.id;
		if (!value) return null;
		const {
			linkTo,
		} = this.props;
		return (
			<ItemsTableValue padded interior title={value} to={linkTo} field={this.props.col.type}>
				{value}
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

export default IdColumn;
