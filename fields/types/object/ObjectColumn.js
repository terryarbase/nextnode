import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';
import { plural } from '../../../admin/client/utils/string';

var ObjectColumn = React.createClass({
	displayName: 'ObjectColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	getValue () {
		var value = this.props.data.fields[this.props.col.path];
		if (Array.isArray(value)) {
			return plural(value.length, '* Value', '* Values');
		} else {
			return '';
		}
	},
	render () {
		const value = this.getValue();
		return (
			<ItemsTableCell>
				<ItemsTableValue padded interior field={this.props.col.type}>
					{value}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

module.exports = ObjectColumn;
