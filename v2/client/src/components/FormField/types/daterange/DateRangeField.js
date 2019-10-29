import DateRangeInput from '../../components/DateRangeInput';
import PropTypes from 'prop-types';
import Field from '../Field';
import moment from 'moment';
// import DayPicker, { DateUtils } from 'react-day-picker';
import React from 'react';
import {
	// Button,
	FormInput,
	InlineGroup as Group,
	InlineGroupSection as Section,
} from '../../elemental';

/*
TODO: Implement yearRange Prop, or deprecate for max / min values (better)
*/

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT_STRING = 'YYYY-MM-DD';

export default Field.create({
	displayName: 'DateRangeField',
	statics: {
		type: 'Date',
	},
	propTypes: {
		formatString: PropTypes.string,
		inputFormat: PropTypes.string,
		label: PropTypes.string,
		note: PropTypes.string,
		onChange: PropTypes.func,
		path: PropTypes.string,
		value: PropTypes.string,
	},

	getDefaultProps () {
		return {
			formatString: DEFAULT_FORMAT_STRING,
			inputFormat: DEFAULT_INPUT_FORMAT,
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
		// const { value } = this.props;

		// var dateAsMoment = this.toMoment(this.props.value);
		// var value = this.props.value && dateAsMoment.isValid()
		// 	? dateAsMoment.format(this.props.inputFormat)
		// 	: this.props.value;
		return (
			<Group>
				<Section grow>
					<DateRangeInput
						{...this.props}
						format={this.props.inputFormat}
						name={this.getInputName(this.props.path)}
						onChange={this.valueChanged}
						ref="dateRangeInput"
						currentLang={this.props.currentLang}
					/>
				</Section>
			</Group>
		);
	},

});
