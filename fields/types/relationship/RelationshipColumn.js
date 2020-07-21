import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

const moreIndicatorStyle = {
	color: '#bbb',
	fontSize: '.8rem',
	fontWeight: 500,
	marginLeft: 8,
};

var RelationshipColumn = React.createClass({
	displayName: 'RelationshipColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	canViewRefList () {
		const refListPermission = this.props.permission[this.props.col.field.refList.key];
		return refListPermission._view;
	},
	renderMany (value) {
		if (!value || !value.length) return;
		const refList = this.props.col.field.refList;
		const items = [];
		for (let i = 0; i < 3; i++) {
			if (!value[i]) break;
			if (i) {
				items.push(<span key={'comma' + i}>, </span>);
			}
			const to = this.canViewRefList()
				? Keystone.adminPath + '/' + refList.path + '/' + value[i].id
				: null;
			items.push(
				<ItemsTableValue interior truncate={false} key={'anchor' + i} to={to}>
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
		const refList = this.props.col.field.refList;
		const to = this.canViewRefList()
			? Keystone.adminPath + '/' + refList.path + '/' + value.id
			: null;
		return (
			<ItemsTableValue to={to} padded interior field={this.props.col.type}>
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

module.exports = RelationshipColumn;
