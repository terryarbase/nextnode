import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';
import { plural } from './../../../../utils/v1/string';

var ListColumn = createClass({
	displayName: 'ListColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
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

export default ListColumn;
