import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var SelectColumn = createClass({
	displayName: 'SelectColumn',
	propTypes: {
		col: PropTypes.object,
		currentLang: PropTypes.string,
		data: PropTypes.object,
		linkTo: PropTypes.string,
	},
	getValue () {
		const value = this.props.data.fields[this.props.col.path];
		const option = this.props.col.field.ops.filter(i => i.value === value)[0];
		var label = option ? option.label : null;
		/*
		** Special for customized multilingual options
		** Terry Chan
		** 18/12/2018
		*/
		const { currentLang } = this.props;
		if (option && typeof option.label === 'object' 
			&& !_.isNil(option.label[currentLang])) {
			label = option.label[currentLang];
		}
		return label;
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

export default SelectColumn;
