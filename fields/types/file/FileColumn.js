import React from 'react';

import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var LocalFileColumn = React.createClass({
	renderValue: function () {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !value.filename) return;
		return value.filename;
	},
	isImage (value) {
		const imageMimeType = [
			"image/png",
			"image/jpeg",
			"image/jpg",
			"image/gif",
		];
		for(var i = 0; i < imageMimeType.length; i++){
			if(value.mimetype === imageMimeType[i]){
				return true;
			}
		}
		return false;
	},
	render: function () {

		var value = this.props.data.fields[this.props.col.path];
		const { linkTo } = this.props;
		// console.log('linkTo: ', this.props.linkTo, value);
		let href = linkTo ? linkTo : 
			(value && value.url ? value.url : 
				(value && value.public)
			);
		let label = value && value.filename ? value.filename : null;
		if (this.isImage(value)) {
			label = (<img src={value.url} style={{ maxWidth: '150px', maxHeight: '150px', height: 'auto', border: '1px solid #ccc' }} />);
		}
		return (
			<ItemsTableCell padded interior field={this.props.col.type}>
				<ItemsTableValue to={href}>{label}</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

module.exports = LocalFileColumn;
