import DateInput from '../../components/DateInput';
import PropTypes from 'prop-types';
import Field from '../Field';
import moment from 'moment';
import React from 'react';
import {
	Button,
} from '@material-ui/core';
import {
	// Button,
	FormInput,
	InlineGroup as Group,
	InlineGroupSection as Section,
} from '../../elemental';

// locales
import i18n from '../../../../i18n';
/*
TODO: Implement yearRange Prop, or deprecate for max / min values (better)
*/

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT_STRING = 'Do MMM YYYY';

module.exports = Field.create({
	displayName: 'DateField',
	statics: {
		type: 'Date',
	},
	propTypes: {
		formatString: PropTypesstring,
		inputFormat: PropTypesstring,
		label: PropTypesstring,
		note: PropTypesstring,
		onChange: PropTypesfunc,
		path: PropTypesstring,
		value: PropTypesstring,
	},

	getDefaultProps () {
		return {
			formatString: DEFAULT_FORMAT_STRING,
			inputFormat: DEFAULT_INPUT_FORMAT,
		};
	},
	valueChanged ({ value }) {
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},
	toMoment (value) {
		if (this.props.isUTC) {
			return moment.utc(value);
		} else {
			return moment(value);
		}
	},
	isValid (value) {
		return this.toMoment(value, this.inputFormat).isValid();
	},
	format (value) {
		return value ? this.toMoment(value).format(this.props.formatString) : '';
	},
	setToday () {
		this.valueChanged({
			value: this.toMoment(new Date()).format(this.props.inputFormat),
		});
	},
	renderValue () {
		return (
			<FormInput noedit>
				{this.format(this.props.value)}
			</FormInput>
		);
	},
	renderField () {
		/*
		** Add picker options supports (e.g. disabled days)
		** Terry Chan
		** 14/12/2018
		*/
		const { maxDate, minDate } = this.props;

		var dateAsMoment = this.toMoment(this.props.value);
		var value = this.props.value && dateAsMoment.isValid()
			? dateAsMoment.format(this.props.inputFormat)
			: this.props.value;

		return (
			<Group>
				<Section grow>
					<DateInput
						maxDate={maxDate}
						minDate={minDate}
						format={this.props.inputFormat}
						name={this.getInputName(this.props.path)}
						onChange={this.valueChanged}
						ref="dateInput"
						value={value}
					/>
				</Section>
				<Section>
					<Button variant="contained" onClick={this.setToday}>{i18n.t('list.today')}</Button>
				</Section>
			</Group>
		);
	},

});
