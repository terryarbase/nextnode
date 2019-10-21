import React from 'react';
import moment from 'moment';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
import { Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';

import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var DateTimeRangeColumn = createClass({
	displayName: 'DateTimeRangeColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
		format: PropTypes.string,
		linkTo: PropTypes.string,
	},
	getValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value) return null;
		// const { format } = this.props;
		const dateFormat = 'DD/MM/YYYY HH:mm';
		if (value.startDate && value.endDate) {
			return (
				<div>
					<Badge variant="info">
						{moment(value.startDate).format(dateFormat)}
					</Badge>
					<span> - </span>
					<Badge variant="info">
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

export default DateTimeRangeColumn;
