import moment from 'moment';
import PropTypes from 'prop-types';
import {
	Dialog,
} from '@material-ui/core';
// import DayPicker from 'react-day-picker';
import DateTime from 'react-datetime';
// import DateTime from "@nateradebaugh/react-datetime";
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
import React from 'react';
import _ from 'lodash';

import 'react-datetime/css/react-datetime.css';

import { FormInput } from '../elemental';

require('moment/locale/zh-tw');
require('moment/locale/zh-cn');
require('moment/locale/en-au');

export default createClass({
	displayName: 'DateInput',
	propTypes: {
		fullFormat: PropTypes.string,
		name: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string,
		value: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string,
		]),
	},
	getInitialState () {
		return {
			// fullFormat: !!timeFormat ? `${dateFormat} ${timeFormat}` : dateFormat,
			pickerIsOpen: false,
		};
	},
	// componentDidMount () {
	// 	this.showCurrentMonth();
	// },
	// componentWillReceiveProps: function (newProps) {
	// 	if (newProps.value === this.props.value) return;
	// 	this.setState({
	// 		inputValue: newProps.value,
	// 	});
	// },
	// focus () {
	// 	if (!this.refs.input) return;
	// 	findDOMNode(this.refs.input).focus();
	// },
	format(date) {
		return moment(date).format(this.props.fullFormat);
	},
	// handleInputChange ({ target: { value } }) {
	// 	const date = this.format(value);
	// 	this.props.onChange({ value: date });
	// },
	// handleKeyPress (e) {
	// 	if (e.key === 'Enter') {
	// 		e.preventDefault();
	// 		// If the date is strictly equal to the format string, dispatch onChange
	// 		if (moment(this.state.inputValue, this.props.fullFormat, true).isValid()) {
	// 			this.props.onChange({
	// 				value: this.state.inputValue,
	// 			});
	// 		// If the date is not strictly equal, only change the tab that is displayed
	// 		}
	// 	}
	// },
	handleDaySelect (date, modifiers, e) {
		if (modifiers && modifiers.disabled) return;

		const value = this.format(date);
		this.props.onChange({ value });
	},
	showPicker () {
		this.setState({ pickerIsOpen: true });
	},
	handleFocus (e) {
		if (this.state.pickerIsOpen) return;
		// console.log('>>>>>>>');
		this.showPicker();
	},
	handleCancel () {
		this.setState({ pickerIsOpen: false });
	},

	isValidDate (currentDate) {
		const {
			maxToday,
			forceValid,
			value,
			minDate,
			maxDate,
			range=[],
			fullFormat
		} = this.props;
		let result = true;

		if (maxToday) {
			result = currentDate.isSameOrBefore(moment());
		}
		// used for range selection
		// if (result && forceValid) {
		// 	result = currentDate.isSameOrBefore(moment(forceValid));
		// }

		if (result && minDate) {
			result = currentDate.isSameOrAfter(moment(minDate));
		}

		if (result && maxDate) {
			result = currentDate.isSameOrBefore(moment(maxDate));
		}

		if (result && range.length) {
			const date = currentDate.format(fullFormat);
			result = _.includes(range, date);
		}

		return result;
	},
	render () {
		const {
			value: selectedDay,
			timeFormat=false,
			dateFormat='YYYY-MM-DD',
			fullFormat,
		} = this.props;
		const {
			pickerIsOpen,
		} = this.state;
		return (
			<div>
				<FormInput
					autoComplete="off"
					id={this.state.id}
					size="full"
					disabled
					name={this.props.name}
					// onBlur={this.handleBlur}
					// onChange={this.handleInputChange}
					onClick={this.handleFocus}
					// onKeyPress={this.handleKeyPress}
					placeholder={fullFormat}
					value={this.props.value}
				/>
				<Dialog open={pickerIsOpen} onClose={this.handleCancel}>
					<DateTime
						input={false}
						locale={this.props.calendarLang}
						viewDate={selectedDay}
						value={selectedDay}
						isValidDate={this.isValidDate}
						dateFormat={dateFormat}
						timeFormat={timeFormat}
						onChange={this.handleDaySelect}
					/>
				</Dialog>
			</div>
		);
	},
});