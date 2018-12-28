import Field from '../Field';
import React from 'react';
import { FormInput } from '../../../admin/client/App/elemental';

module.exports = Field.create({
	displayName: 'TextareaField',
	statics: {
		type: 'Textarea',
	},
	renderValue () {
		const { height } = this.props;

		const styles = {
			height: height,
			whiteSpace: 'pre-wrap',
			overflowY: 'auto',
		};

		var { value = '' } = this.props;
		// @Terry Chan 04/08/2018
		const newlineValue = value.split('\\n');
		if (newlineValue.length) {
			value = newlineValue.join('<br />');
		}

		return (
			<FormInput
				multiline
				newline={newlineValue.length}
				noedit
				style={styles}
			>
				{value}
			</FormInput>
		);
	},
	renderField () {
		const { height, path, style, value } = this.props;

		const styles = {
			height: height,
			...style,
		};
		return (
			<FormInput
				autoComplete="off"
				multiline
				name={this.getInputName(path)}
				onChange={this.valueChanged}
				ref="focusTarget"
				style={styles}
				value={value}
			/>
		);
	},
});
