import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import React from 'react';
import { findDOMNode } from 'react-dom';
import Popout from '../../admin/client/App/shared/Popout';
import { FormInput } from '../../admin/client/App/elemental';

let lastId = 0;

module.exports = React.createClass({
	displayName: 'DateRangeInput',
	propTypes: {
		format: React.PropTypes.string,
		name: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		path: React.PropTypes.string,
		value: React.PropTypes.object,
	},
	getDefaultProps () {
		return {
			format: 'YYYY-MM-DD',
		};
	},
	getInitialState () {
		const id = ++lastId;
		let month = new Date();
		const { format, value } = this.props;
		/*
		** Date Range Checking
		** Terry Chan
		** 30/01/2019
		*/
		// if (range) {
		if (value.from && moment(value.from, format, true).isValid()) {
			month = moment(value.from, format).toDate();
		}
		// } else {
			// if (moment(value, format, true).isValid()) {
			// 	month = moment(value, format).toDate();
			// }
		// }
		return {
			id: `_DateInput_${id}`,
			month: month,
			pickerIsOpen: false,
			inputValue: value || {
				from: undefined,
				to: undefined,
			},
			// inputValue: range ? {
			// 	from: value && value.from,
			// 	to: value && value.to,
			// } : value,
		};
	},
	componentDidMount () {
		this.showCurrentMonth();
	},
	componentWillReceiveProps: function (newProps) {
		var month = null;

		// if (this.props.range) {
		if (JSON.stringify(newProps.value) === JSON.stringify(this.props.value)) return;

		if (newProps.value.from) {
			month = moment(newProps.value.from, this.props.format).toDate();
		}
		// } else {
			// if (newProps.value === this.props.value) return;
			// month = moment(newProps.value, this.props.format).toDate();
		// }
		this.setState({
			month,
			inputValue: newProps.value,
		}, this.showCurrentMonth);
	},
	focus () {
		if (!this.refs.rangeInput) return;
		findDOMNode(this.refs.rangeInput).focus();
	},
	handleInputChange (e) {
		var { value } = e.target;
		
		// if (this.props.range) {
		// 	// value = DateUtils.addDayToRange(value, this.state);
		// 	// console.log('value: ', value);
		// 	this.setState({ inputValue: value });
		// } else {
		this.setState({ inputValue: value }, this.showCurrentMonth);
		// }

		
	},
	handleKeyPress (e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			// If the date is strictly equal to the format string, dispatch onChange
			const { inputValue: { from: fromDate, to: toDate } } = this.state;
			if (fromDate && moment(fromDate, this.props.format, true).isValid() 
				&& toDate && moment(toDate, this.props.format, true).isValid()) {
				this.props.onChange({ value: this.state.inputValue });
			// If the date is not strictly equal, only change the tab that is displayed
			} else if (fromDate && moment(fromDate, this.props.format).isValid() 
				&& toDate && moment(toDate, this.props.format).isValid()) {
				this.setState({
					month: moment(fromDate, this.props.format).toDate(),
				}, this.showCurrentMonth);
			}
		}
	},
	handleDaySelect (date) {
		const value = DateUtils.addDayToRange(date, this.state.inputValue);
		this.props.onChange({ value });
		this.setState({
			// pickerIsOpen,
			month: date,
			inputValue: value,
		});
	},
	showPicker () {
		this.setState({ pickerIsOpen: true }, this.showCurrentMonth);
	},
	showCurrentMonth () {
		if (!this.refs.picker) return;
		this.refs.picker.showMonth(this.state.month);
	},
	handleFocus (e) {
		if (this.state.pickerIsOpen) return;
		this.showPicker();
	},
	handleCancel () {
		this.setState({ pickerIsOpen: false });
	},
	handleBlur (e) {
		let rt = e.relatedTarget || e.nativeEvent.explicitOriginalTarget;
		const popout = this.refs.rangePopout.getPortalDOMNode();
		console.log(popout);
		while (rt) {
			if (rt === popout) return;
			rt = rt.parentNode;
		}
		console.log(rt);
		this.setState({
			pickerIsOpen: false,
		});
	},
	render () {
		var { maxDate, minDate, value, format } = this.props;
		var modifiers;
		var selectedDay;
		// if (range) {
		// 	// selectedDay = { from: value.from, to: value.to };
		selectedDay = { from: value.from, to: value.to };
		modifiers = { 
			start: value.from,
			end: value.to,
			selected: day => 
				value.from && moment(day).isSameOrAfter(value.from) &&
				value.to && moment(day).isSameOrBefore(value.to)
		};
		// } else {
			// selectedDay = value;
			// modifiers = {
			// 	selected: (day) => moment(day).format(this.props.format) === selectedDay,
			// };
		// }
		// react-day-picker adds a class to the selected day based on this
		
		// console.log(value, selectedDay);
		var optional = {};
		if (maxDate) {
			optional = {
				disabledDays: {
					after: moment(maxDate).toDate(),
				},
			};
		}
		// console.log(minDate, maxDate, optional);
		if (minDate) {
			optional = {
				...optional,
				...{
					disabledDays: {
						...optional.disabledDays,
						...{
							before: moment(minDate).toDate(),
						},
					},
				},
			};
		}
		var value = '';
		const { inputValue } = this.state;
		// if (range) {
		if (inputValue.from && inputValue.to) {
			value = `${inputValue.from.toLocaleDateString()} - ${inputValue.to.toLocaleDateString()}`;
		} else if (inputValue.from) {
			value = `${inputValue.from.toLocaleDateString()}`;
		} else if (inputValue.to) {
			value = `${inputValue.to.toLocaleDateString()}`;
		}
		// } else {
		// 	value = inputValue;
		// }
		return (
			<div>
				<FormInput
					autoComplete="off"
					name={this.props.name}
					style={{ display: 'none' }}
					value={inputValue}
				/>
				<FormInput
					autoComplete="off"
					id={this.state.id}
					onBlur={this.handleBlur}
					onChange={this.handleInputChange}
					onFocus={this.handleFocus}
					onKeyPress={this.handleKeyPress}
					placeholder={`${format} - ${format}`}
					style={{ width: '230px' }}
					ref="input"
					value={value}
				/>
				<Popout
					isOpen={this.state.pickerIsOpen}
					onCancel={this.handleCancel}
					ref="rangePopout"
					relativeToID={this.state.id}
					width={530}
					>
					<DayPicker
						className="Selectable"
						modifiers={modifiers}
						onDayClick={this.handleDaySelect}
						numberOfMonths={2}
						ref="picker"
						tabIndex={-1}
					/>
				</Popout>
			</div>
		);
	},
});
