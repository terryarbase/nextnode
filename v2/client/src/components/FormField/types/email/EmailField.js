import PropTypes from 'prop-types';
import Field from '../Field';
import React from 'react';
import { FormInput } from '../../elemental';

/*
	TODO:
	- gravatar
	- validate email address
 */

export default Field.create({
	displayName: 'EmailField',
	propTypes: {
		path: PropTypes.string.isRequired,
		value: PropTypes.string,
	},
	statics: {
		type: 'Email',
	},
	renderField () {
		return (
			<FormInput
				name={this.getInputName(this.props.path)}
				ref="focusTarget"
				value={this.props.value}
				onChange={this.valueChanged}
				autoComplete="off"
				type="email"
			/>
		);
	},
	renderValue () {
		return this.props.value ? (
			<FormInput noedit component="a" target="_blank" href={'mailto:' + this.props.value}>
				{this.props.value}
			</FormInput>
		) : (
			<FormInput noedit />
		);
	},
});
