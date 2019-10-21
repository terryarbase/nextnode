import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import moment from 'moment';
import { Badge } from 'react-bootstrap';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var DateRangeColumn = createClass({
	displayName: 'DateRangeColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
		format: PropTypes.string,
		linkTo: PropTypes.string,
	},
	getValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value) return null;
		const { format } = this.props;
		const dateFormat = (this.props.col.type === 'datetime') ? 
			(format ? format : 'DD/MM/YYYY HH:mm') : (format ? format : 'DD/MM/YYYY');
		if (value.startDate && value.endDate) {
			return (
				<div>
					<Badge variant="primary">
						{moment(value.startDate).format(dateFormat)}
					</Badge>
					<span> - </span>
					<Badge variant="primary">
						{moment(value.endDate).format(dateFormat)}
					</Badge>
				</div>
			);
			// return `${moment(value.startDate).format(dateFormat)} - ${moment(value.endDate).format(dateFormat)}`;
		}
		return null;
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

export default DateRangeColumn;
