import React from 'react';
import _ from 'lodash';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var ObjectColumn = React.createClass({
	displayName: 'ObjectColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	getValue () {
		// TODO: How to display object data? Show json for now
		var value = this.props.data.fields[this.props.col.path];
		try {
			const pickList = _.difference(_.keys(value), [
				'id',
			])
			const data = _.pick(value, pickList);
			return JSON.stringify(data)
		} catch(err) {
			return ''
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
