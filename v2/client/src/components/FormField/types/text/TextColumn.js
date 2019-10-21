import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var TextColumn = createClass({
	displayName: 'TextColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
		linkTo: PropTypes.string,
	},
	getValue () {
		// cropping text is important for textarea, which uses this column
		const value = this.props.data.fields[this.props.col.path];
		// console.log('>>>>> ', value);
		/*
		** remove all of html tags for HTML types
		** Terry Chan
		** 22/11/2018
		*/
		return value ? value.replace(/<(.|\n)*?>/g, '').substr(0, 100) : null;
	},
	render () {
		const value = this.getValue();
		const empty = !value && this.props.linkTo ? true : false;
		const className = this.props.col.field.monospace ? 'ItemList__value--monospace' : undefined;
		return (
			<ItemsTableCell>
				<ItemsTableValue className={className} to={this.props.linkTo} empty={empty} padded interior field={this.props.col.type}>
					{value}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

export default TextColumn;
