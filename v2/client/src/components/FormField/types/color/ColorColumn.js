import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var ColorColumn = createClass({
	displayName: 'ColorColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
	},
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value) return null;

		const colorBoxStyle = {
			backgroundColor: value,
			borderRadius: 3,
			display: 'inline-block',
			height: 18,
			marginRight: 10,
			verticalAlign: 'middle',
			width: 18,
		};

		return (
			<ItemsTableValue truncate={false} field={this.props.col.type}>
				<div style={{ lineHeight: '18px' }}>
					<span style={colorBoxStyle} />
					<span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{value}</span>
				</div>
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

export default ColorColumn;
