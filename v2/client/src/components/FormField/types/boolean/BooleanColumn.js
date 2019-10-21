import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
import Switch from '@material-ui/core/Switch';

// import i18n from './../../../../i18n';
// import Checkbox from '../../components/Checkbox';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var BooleanColumn = createClass({
	displayName: 'BooleanColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
		realedit: PropTypes.bool,
		// is pure element without td
		isPure: PropTypes.bool,
		noedit: PropTypes.bool,
		currentValue: PropTypes.bool,
	},
	renderCheckBox() {
		const {
			col: {
				field: {
					realedit,
				},
			},
			// data,
			currentValue,
			noedit,
			onChange
		} = this.props;
		
		return (
			<Switch
				disabled={noedit || !realedit}
		        checked={!!currentValue}
		        onChange={onChange}
		    />
		);
		// return <Checkbox 
		// 	readonly={noedit || !realedit}
		// 	checked={currentValue}
		// 	onChange={onChange}
		// />
	},
	renderValue () {
		const {
			col: {
				type,
			},
		} = this.props;
		return (
			<ItemsTableValue truncate={false} field={type}>
				{this.renderCheckBox()}
			</ItemsTableValue>
		);
	},
	render () {
		const {
			isPure,
		} = this.props;
		if (isPure) {
			return this.renderCheckBox();
		}
		return (
			<ItemsTableCell>
				{this.renderValue()}
			</ItemsTableCell>
		);
	},
});

export default BooleanColumn;
