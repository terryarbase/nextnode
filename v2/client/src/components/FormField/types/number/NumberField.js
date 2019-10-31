// import PropTypes from 'prop-types';
import React from 'react';
import Field from '../Field';
import { FormInput } from '../../elemental';

export default Field.create({
	displayName: 'NumberField',
	statics: {
		type: 'Number',
	},
	valueChanged (event) {
		var newValue = event.target.value;
		if (/^-?\d*\.?\d*$/.test(newValue)) {
			this.props.onChange({
				path: this.props.path,
				value: newValue,
			});
		}
	},
	renderField () {
		return (
			<FormInput
				autoComplete="off"
				label={this.props.path}
				name={this.getInputName(this.props.path)}
				onChange={this.valueChanged}
				value={this.props.value}
			/>
		);
	},
});
