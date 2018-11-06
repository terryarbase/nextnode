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
		// is pure element without td
		isPure: React.PropTypes.bool,
		noedit: React.PropTypes.bool,
		currentValue: React.PropTypes.bool,
	},
	renderCheckBox() {
		const {
			col: {
				field: {
					realedit,
				},
			},
			currentValue,
			noedit,
			onChange
		} = this.props;
		
		return <Checkbox 
			readonly={noedit || !realedit}
			checked={currentValue}
			onChange={onChange}
		/>
	},
	renderValue () {
		const {
			col: {
				type,
			},
		} = this.props;
		return (
			<ItemsTableValue truncate={false} field={type}>
				{this.renderCheckBox()}
			</ItemsTableValue>
		);
	},
	render () {
		const {
			isPure,
		} = this.props;
		if (isPure) {
			return this.renderCheckBox();
		}
		return (
			<ItemsTableCell>
				{this.renderValue()}
			</ItemsTableCell>
		);
	},
});

module.exports = BooleanColumn;
