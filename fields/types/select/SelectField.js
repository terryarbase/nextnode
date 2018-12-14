import Field from '../Field';
import React from 'react';
import Select from 'react-select';
import { FormInput } from '../../../admin/client/App/elemental';

/**
 * TODO:
 * - Custom path support
 */

module.exports = Field.create({

	displayName: 'SelectField',
	statics: {
		type: 'Select',
	},

	valueChanged (newValue) {
		// TODO: This should be natively handled by the Select component
		if (this.props.numeric && typeof newValue === 'string') {
			newValue = newValue ? Number(newValue) : undefined;
		}
		this.props.onChange({
			path: this.props.path,
			value: newValue,
		});
	},

	/*
	** Convert label to string if it is multilingual object
	** Terry Chan
	** 27/11/2018
	*/
	convertObject (label) {
		const { currentLang } = this.props;
		if (currentLang && typeof label === 'object') {
			return label[currentLang] || label['en'];
		} else if (typeof label !== 'object') {
			return label;
		}
		return null;
	},

	renderValue () {
		const { ops, value } = this.props;
		const selected = ops.find(opt => opt.value === value);
		return (
			<FormInput noedit>
				{selected ? this.convertObject(selected.label) : null}
			</FormInput>
		);
	},

	renderField () {
		const { numeric, ops, path, value: val, currentLang } = this.props;
		// TODO: This should be natively handled by the Select component
		var options = ops;
		if (ops.length) {
			options = ops.map(function (i) {
				return { label: this.convertObject(i.label), value: String(i.value) };
			}, this);
		}
		const value = String(val);
		// if (typeof val === 'number' || typeof val === 'boolean') {
		// 	value = String(val)
		// }
		return (
			<div>
				{/* This input element fools Safari's autocorrect in certain situations that completely break react-select */}
				<input type="text" style={{ position: 'absolute', width: 1, height: 1, zIndex: -1, opacity: 0 }} tabIndex="-1"/>
				<Select
					simpleValue
					name={this.getInputName(path)}
					value={value}
					options={options}
					placeholder={this.props.t('select')}
					onChange={this.valueChanged}
				/>
			</div>
		);
	},

});
