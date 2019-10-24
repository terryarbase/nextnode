import React from 'react';
import _ from 'lodash';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

var EmbedlyColumn = createClass({
	renderValue: function () {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !_.size(value)) return;
		return <a href={value.url} target="_blank" rel="noopener noreferrer">{value.url}</a>;
	},
	render: function () {
		return (
			<td>
				<div className="ItemList__value">{this.renderValue()}</div>
			</td>
		);
	},
});

export default EmbedlyColumn;
