import DateTimeRangeInput from '../../components/DateTimeRangeInput';
import Field from '../Field';
import moment from 'moment';
// import DayPicker, { DateUtils } from 'react-day-picker';
import React from 'react';
import {
	// Button,
	FormInput,
	InlineGroup as Group,
	InlineGroupSection as Section,
} from '../../../admin/client/App/elemental';

/*
TODO: Implement yearRange Prop, or deprecate for max / min values (better)
*/

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_INPUT_TIME_FORMAT = 'HH:mm';
const DEFAULT_FORMAT_STRING = 'DD/MM/YYYY HH:mm';
// const DEFAULT_FORMAT_TIME_STRING = 'HH:mm'

module.exports = Field.create({
	displayName: 'DateTimeRangeField',
	statics: {
		type: 'Date',
	},
	propTypes: {
		formatString: React.PropTypes.string,
		inputDateFormat: React.PropTypes.string,
		inputTimeFormat: React.PropTypes.string,
		label: React.PropTypes.string,
		note: React.PropTypes.string,
		onChange: React.PropTypes.func,
		path: React.PropTypes.string,
		value: React.PropTypes.string,
	},

	getDefaultProps () {
		return {
			formatString: DEFAULT_FORMAT_STRING,
			// formatTimeString: DEFAULT_FORMAT_TIME_STRING,
			inputDateFormat: DEFAULT_INPUT_FORMAT,
			inputTimeFormat: DEFAULT_INPUT_TIME_FORMAT,
		};
	},

	valueChanged ({ value }) {
		// console.log('> valueChanged: ', value, this.props.path);
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
		return this.toMoment(value, `${this.props.inputFormat} ${this.props.inputTimeFormat}`).isValid();
	},
	format (value) {
		return value ? this.toMoment(value).format(this.props.formatString) : '';
	},
	setToday () {
		this.valueChanged({
			value: this.toMoment(new Date()).format(
				`${this.props.inputFormat} ${this.props.inputTimeFormat}`),
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
		return (
			<Group>
				<Section grow>
					<DateTimeRangeInput
						{...this.props}
						dateFormat={this.props.inputDateFormat}
						timeFormat={this.props.inputTimeFormat}
						name={this.getInputName(this.props.path)}
						onChange={this.valueChanged}
						ref="dateTimeRangeInput"
						currentLang={this.props.currentLang}
					/>
				</Section>
			</Group>
		);
	},

});
