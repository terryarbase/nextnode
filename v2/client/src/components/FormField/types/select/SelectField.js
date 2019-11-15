import Field from '../Field';
import React from 'react';
import _ from 'lodash';
import Select, { components } from 'react-select';
import { FormInput } from '../../elemental';

// locales
import i18n from '../../../../i18n';

/**
 * TODO:
 * - Custom path support
 */

export default Field.create({

	displayName: 'SelectField',
	statics: {
		type: 'Select',
	},

	valueChanged ({ value }) {
		// TODO: This should be natively handled by the Select component
		if (this.props.numeric && typeof value === 'string') {
			value = value ? Number(value) : undefined;
		}
		this.props.onChange({
			path: this.props.path,
			value,
		});
	},

	/*
	** Convert label to string if it is multilingual object
	** Terry Chan
	** 27/11/2018
	*/
	convertObject (label) {
		const currentLang = i18n.locale;
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
	// customizedSingleValue(props) {
	// 	const {
	// 		children,
	// 	} = props;
	// 	return (
	// 		<components.SingleValue {...props} onClick={ e => { console.log(e); } }>
	// 			>>>> {children}
	// 		</components.SingleValue>
	// 	);
	// },
	renderField () {
		const { ops, path, value: val } = this.props;

		// TODO: This should be natively handled by the Select component
		let value = String(val);
		var options = ops;
		if (ops.length) {
			options = ops.map(function (i) {
				return {
					label: this.convertObject(i.label),
					value: String(i.value),
					isSelected: String(i.value) === value,
				};
			}, this);
		}
		// if (typeof val === 'number' || typeof val === 'boolean') {
		// 	value = String(val)
		// }
		// console.log(value);
		value = _.find(options, o => o.isSelected);
		options = [
			{
				label: i18n.t('list.select'),
				value: '',
				isSelected: false,
			},
			...options,
		];
		return (
			<div>
				{/* This input element fools Safari's autocorrect in certain situations that completely break react-select */}
				<input type="text" style={{ position: 'absolute', width: 1, height: 1, zIndex: -1, opacity: 0 }} tabIndex="-1"/>
				<Select
					name={this.getInputName(path)}
					defaultValue={value || ''}
					value={value || ''}
					options={options}
					// openMenuOnClick={false}
					placeholder={i18n.t('list.select')}
					onChange={this.valueChanged}
					// components={{
					// 	SingleValue: this.customizedSingleValue,
					// }}
					styles={{
						singleValue: base => ({ ...base, fontSize: '1rem', }),
						placeholder: base => ({
							...base,
							fontSize: '1rem',
							color: 'hsl(0, 1%, 67%)',
						}),
						control: base => ({
							...base,
							padding: '4px',
							backgroundColor: '#fcfcfb',
							border: '1px solid #e2e2e1',
						}),
						option: (base, { isDisabled, isFocused, isSelected }) => ({
							...base,
							fontSize: '1rem',
							backgroundColor: isDisabled ? null : (
								isSelected || isFocused ? '#f5f5f5' : null
							),
							color: 'hsl(0,0%,20%)',
							fontWeight: isSelected ? 'bold' : 'normal',
						}),
					}}
				/>
			</div>
		);
	},
	renderUI() {
		return this.renderWithErrorUI();
	},
});
