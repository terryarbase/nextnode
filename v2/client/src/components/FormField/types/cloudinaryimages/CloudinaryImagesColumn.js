import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import CloudinaryImageSummary from '../../components/columns/CloudinaryImageSummary';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

const moreIndicatorStyle = {
	color: '#888',
	fontSize: '.8rem',
};

var CloudinaryImagesColumn = createClass({
	displayName: 'CloudinaryImagesColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
	},
	renderMany (value) {
		if (!value || !value.length) return;
		const items = [];
		for (let i = 0; i < 3; i++) {
			if (!value[i]) break;
			items.push(<CloudinaryImageSummary key={'image' + i} image={value[i]} secure={this.props.col.field.secure} />);
		}
		if (value.length > 3) {
			items.push(<span key="more" style={moreIndicatorStyle}>[...{value.length - 3} more]</span>);
		}
		return items;
	},
	renderValue (value) {
		if (!value || !Object.keys(value).length) return;

		return <CloudinaryImageSummary image={value} secure={this.props.col.field.secure} />;

	},
	render () {
		const value = this.props.data.fields[this.props.col.path];
		const many = value.length > 1;

		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.type}>
					{many ? this.renderMany(value) : this.renderValue(value[0])}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

export default CloudinaryImagesColumn;
