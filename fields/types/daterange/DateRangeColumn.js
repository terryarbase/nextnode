import React from 'react';
import moment from 'moment';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var DateRangeColumn = React.createClass({
	displayName: 'DateRangeColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
		format: React.PropTypes.string,
		linkTo: React.PropTypes.string,
	},
	getValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value) return null;
		const { format } = this.props;
		const dateFormat = (this.props.col.type === 'datetime') ? 
			(format ? format : 'DD/MM/YYYY HH:mm') : (format ? format : 'DD/MM/YYYY');
		if (value.startDate && value.endDate) {
			return `${moment(value.startDate).format(dateFormat)} - ${moment(value.endDate).format(dateFormat)}`;
		}
		return '';
	},
	render () {
		const value = this.getValue();
		const empty = !value && this.props.linkTo ? true : false;
		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.type} to={this.props.linkTo} empty={empty}>
					{value}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

module.exports = DateRangeColumn;
