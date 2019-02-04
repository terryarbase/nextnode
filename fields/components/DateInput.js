import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import React from 'react';
import { findDOMNode } from 'react-dom';
import Popout from '../../admin/client/App/shared/Popout';
import { FormInput } from '../../admin/client/App/elemental';

let lastId = 0;

module.exports = React.createClass({
	displayName: 'DateInput',
	propTypes: {
		format: React.PropTypes.string,
		name: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		path: React.PropTypes.string,
		range: React.PropTypes.bool,
		value: React.PropTypes.oneOfType([
		    React.PropTypes.string,
		    React.PropTypes.object,
		]),
	},
	getDefaultProps () {
		return {
			format: 'YYYY-MM-DD',
		};
	},
	getInitialState () {
		const id = ++lastId;
		let month = new Date();
		var { value } = this.props;
		const { format, range } = this.props;
		if (range) {
			if (value.from && moment(value.from, format, true).isValid()) {
				month = moment(value.from, format).toDate();
			}
			value = value || {
				from: undefined,
				to: undefined,
			};
		} else {
			if (moment(value, format, true).isValid()) {
				month = moment(value, format).toDate();
			}
		}
		return {
			id: `_DateInput_${id}`,
			month,
			pickerIsOpen: false,
			inputValue: value,
		};
	},
	componentDidMount () {
		this.showCurrentMonth();
	},
	componentWillReceiveProps: function (newProps) {
		let month = new Date();
		if (this.props.range) {
			if (JSON.stringify(newProps.value) === JSON.stringify(this.props.value)) return;
			if (newProps.value.from) {
				month = moment(newProps.value.from, this.props.format).toDate();
			}
		} else {
			if (newProps.value === this.props.value) return;
			month = moment(newProps.value, this.props.format).toDate();
		}
		this.setState({
			month,
			inputValue: newProps.value,
		}, this.showCurrentMonth);
	},
	focus () {
		if (!this.refs.input) return;
		findDOMNode(this.refs.input).focus();
	},
	handleInputChange (e) {
		const { value } = e.target;
		this.setState({ inputValue: value }, this.showCurrentMonth);
	},
	handleKeyPress (e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (this.props.range) {
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
			} else {
				// If the date is strictly equal to the format string, dispatch onChange
				if (moment(this.state.inputValue, this.props.format, true).isValid()) {
					this.props.onChange({ value: this.state.inputValue });
				// If the date is not strictly equal, only change the tab that is displayed
				} else if (moment(this.state.inputValue, this.props.format).isValid()) {
					this.setState({
						month: moment(this.state.inputValue, this.props.format).toDate(),
					}, this.showCurrentMonth);
				}
			}
		}
	},
	handleDaySelect (date) {
		// if (modifiers && modifiers.disabled) return;
		// console.log(date);
		let value = null;
		if (this.props.range) {
			value = DateUtils.addDayToRange(date, this.state.inputValue);
		} else {
			value = moment(date).format(this.props.format)
		}
		this.props.onChange({ value });
		this.setState({
			pickerIsOpen: !!this.props.range,
			month: date,
			inputValue: value,
		});
	},
	showPicker () {
		this.setState({ pickerIsOpen: true }, this.showCurrentMonth);
	},
	showCurrentMonth () {
		if (!this.refs.picker) return;
		// this.refs.picker.showMonth(this.state.month);
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
		const popout = this.refs.popout.getPortalDOMNode();
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
		const { range, format } = this.props;
		var { value } = this.props;
		var { inputValue } = this.state;
		var modifiers;
		var selectedDay;
		// if (range) {
		// 	// selectedDay = { from: value.from, to: value.to };
		if (range) {
			selectedDay = { from: value.from, to: value.to };
			modifiers = { 
				selectedRange: {
					from: value.from,
					to: value.to,
				},
			};
			// if (range) {
			if (inputValue.from && inputValue.to) {
				inputValue = `${inputValue.from.toLocaleDateString()} - ${inputValue.to.toLocaleDateString()}`;
			} else if (inputValue.from) {
				inputValue = `${inputValue.from.toLocaleDateString()}`;
			} else if (inputValue.to) {
				inputValue = `${inputValue.to.toLocaleDateString()}`;
			}
		} else {
			selectedDay = this.props.value;
			// react-day-picker adds a class to the selected day based on this
			modifiers = {
				selected: (day) => moment(day).format(this.props.format) === selectedDay,
			};
		}
		var { maxDate, minDate } = this.props;
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
		console.log('range: ', this.props);
		return (
			<div>
				{
					range && <FormInput
						autoComplete="off"
						name={this.props.name}
						style={{ display: 'none' }}
						value={inputValue}
					/>
				}
				<FormInput
					autoComplete="off"
					id={this.state.id}
					name={this.props.name}
					onBlur={this.handleBlur}
					onChange={this.handleInputChange}
					onFocus={this.handleFocus}
					onKeyPress={this.handleKeyPress}
					placeholder={this.props.format}
					placeholder={
						range ? `${format} - ${format}` : format}
					style={
						range ? { width: '230px' } : null
					}
					ref="input"
					value={inputValue}
				/>
				<Popout
					isOpen={this.state.pickerIsOpen}
					onCancel={this.handleCancel}
					ref="popout"
					relativeToID={this.state.id}
					width={range ? 530 : 260}
				>
					<DayPicker
						className="Selectable"
						modifiers={modifiers}
						numberOfMonths={range ? 2 : 1}
						onDayClick={this.handleDaySelect}
						ref="picker"
						tabIndex={-1}
					/>
				</Popout>
			</div>
		);
	},
});