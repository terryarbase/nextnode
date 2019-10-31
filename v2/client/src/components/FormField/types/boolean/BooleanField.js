import React from 'react';
import PropTypes from 'prop-types';
import Field from '../Field';
import {
	Checkbox,
	FormControlLabel,
} from '@material-ui/core';

import Note from './../../shared/Note';

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
	valueChanged ({ target: { checked } }) {
		this.props.onChange({
			path: this.props.path,
			value: checked,
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
	renderUI () {
		const { indent, label, path, note, value } = this.props;
		return (
			<div data-field-name={path} data-field-type="boolean">
				<FormField>
					<FormControlLabel
						control={
							<Checkbox
						        checked={!!value}
						        onChange={(this.shouldRenderField() && this.valueChanged) || NOOP}
						        disabled={!this.shouldRenderField()}
						    />
						}
						label={this.getRequired()}
					/>
					{
						!!note && <Note note={label} placement="top-end" />
					}
				</FormField>
			</div>
		);
	},
});
