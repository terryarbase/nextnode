import PropTypes from 'prop-types';
import DateTimeRangeInput from '../../components/DateTimeRangeInput';
import Field from '../Field';
import moment from 'moment';
// import DayPicker, { DateUtils } from 'react-day-picker';
import React from 'react';
import {
	Grid,
	Button
} from '@material-ui/core';
import {
	// Button,
	FormInput,
	// InlineGroup as Group,
	// InlineGroupSection as Section,
} from '../../elemental';
import DateInput from '../../components/DateInput';

import i18n from './../../../../i18n';
/*
TODO: Implement yearRange Prop, or deprecate for max / min values (better)
*/

// const DEFAULT_FORMAT_TIME_STRING = 'HH:mm'

export default Field.create({
	displayName: 'DateTimeRangeField',
	statics: {
		type: 'Date',
	},
	propTypes: {
		formatString: PropTypes.string,
		inputDateFormat: PropTypes.string,
		inputTimeFormat: PropTypes.string,
		label: PropTypes.string,
		note: PropTypes.string,
		onChange: PropTypes.func,
		path: PropTypes.string,
		value: PropTypes.object,
	},
	getInitialState () {
		const {
			dateFormat='YYYY-MM-DD',
			timeFormat='HH:mm:ss',
		} = this.props;
		return {
			fullFormat: `${dateFormat} ${timeFormat}`,
		};
	},
	valueStartChanged ({ value: startDate }) {
		const {
			value={},
		} = this.props;
		// console.log('> valueChanged: ', value, this.props.path);
		this.props.onChange({
			path: this.props.path,
			value: {
				...value,
				startDate,
			},
		});
	},
	valueEndChanged ({ value: endDate }) {
		const {
			value={},
		} = this.props;
		// console.log('> valueChanged: ', value, this.props.path);
		this.props.onChange({
			path: this.props.path,
			value: {
				...value,
				endDate,
			},
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
		return this.toMoment(value, this.state.fullFormat).isValid();
	},
	format (value) {
		return value ? this.toMoment(value).format(this.state.fullFormat) : '';
	},
	setToday () {
		const date =  moment().format(this.state.fullFormat);
		this.props.onChange({
			path: this.props.path,
			value: {
				startDate: date,
				endDate: date,
			},
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
		const {
			value={},
			showToday,
		} = this.props;
		const {
			fullFormat,
		} = this.state;
		const {
			startDate,
			endDate,
		} = value;

		return (
			<Grid
				container
				direction="row"
				justify="flex-start"
		  		alignItems="center"
		  		spacing={3}
			>
				<Grid item xs={5}>
					<DateInput
						{...this.props}
						fullFormat={fullFormat}
						name={`${this.props.path}[startDate]`}
						onChange={this.valueStartChanged}
						placeholder={fullFormat}
						maxDate={endDate}
						value={startDate}
					/>
				</Grid>
				<Grid item xs={5}>
					<DateInput
						{...this.props}
						fullFormat={fullFormat}
						name={`${this.props.path}[endDate]`}
						onChange={this.valueEndChanged}
						placeholder={fullFormat}
						minDate={startDate}
						value={endDate}
					/>
				</Grid>
				{
					!!showToday && <Grid item xs={2}>
						<Button variant="contained" color="primary" onClick={this.setToday}>{i18n.t('list.today')}</Button>
					</Grid>
				}
			</Grid>
		);
	},

});
