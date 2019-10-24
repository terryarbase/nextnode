import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

const moreIndicatorStyle = {
	color: '#bbb',
	fontSize: '.8rem',
	fontWeight: 500,
	marginLeft: 8,
};

var RelationshipColumn = createClass({
	displayName: 'RelationshipColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
	},
	renderMany (value) {
		if (!value || !value.length) return;
		const refList = this.props.col.field.refList;
		const {
			adminPath,
		} = this.props;
		const items = [];
		for (let i = 0; i < 3; i++) {
			if (!value[i]) break;
			if (i) {
				items.push(<span key={'comma' + i}>, </span>);
			}
			items.push(
				<ItemsTableValue interior truncate={false} key={'anchor' + i} to={adminPath + '/' + refList.path + '/' + value.id}>
					{value[i].name}
				</ItemsTableValue>
			);
		}
		if (value.length > 3) {
			items.push(<span key="more" style={moreIndicatorStyle}>[...{value.length - 3} more]</span>);
		}
		return (
			<ItemsTableValue field={this.props.col.type}>
				{items}
			</ItemsTableValue>
		);
	},
	renderValue (value) {
		if (!value) return;
		const {
			adminPath,
		} = this.props;
		const refList = this.props.col.field.refList;
		return (
			<ItemsTableValue to={adminPath + '/' + refList.path + '/' + value.id} padded interior field={this.props.col.type}>
				{value.name}
			</ItemsTableValue>
		);
	},
	render () {
		const value = this.props.data.fields[this.props.col.path];
		const many = this.props.col.field.many;
		return (
			<ItemsTableCell>
				{many ? this.renderMany(value) : this.renderValue(value)}
			</ItemsTableCell>
		);
	},
});

export default RelationshipColumn;
