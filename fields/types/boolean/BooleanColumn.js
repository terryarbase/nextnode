import React from 'react';
import Checkbox from '../../components/Checkbox';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var BooleanColumn = React.createClass({
	displayName: 'BooleanColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
		realedit: React.PropTypes.bool,
		noedit: React.PropTypes.bool,
		currentValue: React.PropTypes.bool,
	},
	renderValue () {
		const { col: { type, field: { realedit } }, currentValue } = this.props;
		return (
			<ItemsTableValue truncate={false} field={this.props.col.type}>
				<Checkbox 
					readonly={noedit || !realedit}
					checked={currentValue}
					onChange={this.props.onChange}
				/>
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

module.exports = BooleanColumn;
