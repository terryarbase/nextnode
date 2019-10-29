import React from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';
import {
	Checkbox,
	FormControlLabel,
} from '@material-ui/core';

import { FormField } from '../../elemental';

const NOOP = () => {};

export default Field.create({
	displayName: 'BooleanField',
	statics: {
		type: 'Boolean',
	},
	propTypes: {
		indent: PropTypes.bool,
		label: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		value: PropTypes.bool,
	},
	valueChanged ({ target: { value } }) {
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},
	renderFormInput () {
		if (!this.shouldRenderField()) return;

		return (
			<input
				name={this.getInputName(this.props.path)}
				type="hidden"
				value={!!this.props.value}
			/>
		);
	},
	renderSwitch() {
		const { value } = this.props;
		return (
			<Checkbox
		        checked={value}
		        onChange={(this.shouldRenderField() && this.valueChanged) || NOOP}
		        disabled={!this.shouldRenderField()}
		    />
		);
	},
	renderUI () {
		const { indent, label, path } = this.props;
		return (
			<div data-field-name={path} data-field-type="boolean">
				<FormField offsetAbsentLabel={indent}>
					<FormControlLabel control={this.renderSwitch} label={label} />
					{this.renderNote()}
				</FormField>
			</div>
		);
	},
});
