import PropTypes from 'prop-types';
import { FormInput } from '../../elemental';
import Field from '../Field';
import React from 'react';

export default Field.create({
	displayName: 'MoneyField',
	propTypes: {
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		value: PropTypes.number,
	},
	statics: {
		type: 'Money',
	},

	valueChanged (event) {
		var newValue = event.target.value.replace(/[^\d\s\,\.\$€£¥]/g, '');
		if (newValue === this.props.value) return;
		this.props.onChange({
			path: this.props.path,
			value: Number(newValue),
		});
	},
	renderField () {
		return (
			<FormInput
				autoComplete="off"
				name={this.getInputName(this.props.path)}
				onChange={this.valueChanged}
				value={this.props.value}
				type="number"
			/>
		);
	},

});
