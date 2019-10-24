import React from 'react';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import displayName from 'display-name';

import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';


var NameColumn = createClass({
	displayName: 'NameColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
		linkTo: PropTypes.string,
	},
	renderValue () {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || (!value.first && !value.last)) return '(no name)';
		return displayName(value.first, value.last);
	},
	render () {
		return (
			<ItemsTableCell>
				<ItemsTableValue to={this.props.linkTo} padded interior field={this.props.col.type}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

export default NameColumn;
