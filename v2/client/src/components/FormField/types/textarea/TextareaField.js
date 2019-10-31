import Field from '../Field';
import React from 'react';
import { FormInput } from '../../elemental';

export default Field.create({
	displayName: 'TextareaField',
	statics: {
		type: 'Textarea',
	},
	renderValue () {
		const { height } = this.props;

		// const styles = {
		// 	height: height,
		// 	whiteSpace: 'pre-wrap',
		// 	overflowY: 'auto',
		// };

		var { value = '' } = this.props;
		// @Terry Chan 04/08/2018
		const newlineValue = value.split('\\n');
		if (newlineValue.length) {
			value = newlineValue.join('<br />');
		}

		return (
			<FormInput
				multiline
				noedit
				rows={height}
			>
				{value}
			</FormInput>
		);
	},
	renderField () {
		const { height, path, value, label } = this.props;

		return (
			<FormInput
				autoComplete="off"
				multiline
				label={label}
				rows={height}
				size="large"
				name={this.getInputName(path)}
				onChange={this.valueChanged}
				value={value}
			/>
		);
	},
});
