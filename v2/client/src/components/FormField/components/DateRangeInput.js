import moment from 'moment';
import PropTypes from 'prop-types';
import { DateRange } from 'react-date-range';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
import React from 'react';
import localeZHTW from 'date-fns/locale/zh-TW';
import localeZHCN from 'date-fns/locale/zh-CN';
import localeEN from 'date-fns/locale/en-US';

import Popout from '../shared/Popout';
import {
	FormInput,
	Button,
	InlineGroup as Group,
	InlineGroupSection as Section,
} from '../elemental';

// lcoales
import i18n from '../../../../i18n';

let lastId = 0;

export default createClass({
	displayName: 'DateRangeInput',
	propTypes: {
		format: PropTypes.string,
		name: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string,
		value: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string,
		]),
	},
	getDefaultProps () {
		return {
			format: 'YYYY-MM-DD',
		};
	},
	getInitialState () {
		const id = ++lastId;
		const { value } = this.props;
		return {
			id: `_DateRangeInput_${id}`,
			// month: month,
			pickerIsOpen: false,
			inputValue: value || {
				startDate: new Date(),
				endDate: new Date(),
			},
		};
	},
	// componentDidMount () {
	// 	this.showCurrentMonth();
	// },
	componentWillReceiveProps: function (newProps) {
		// console.log('> newProps.value: ', newProps.value);
		if (JSON.stringify(newProps.value) === JSON.stringify(this.props.value)) return;
		this.setState({
			// month,
			inputValue: newProps.value,
		});
	},
	// focus () {
	// 	if (!this.refs.rangeInput) return;
	// 	findDOMNode(this.refs.rangeInput).focus();
	// },
	handleInputChange (e) {
		var { value } = e.target;
		
		this.setState({ inputValue: value });
		// , this.showCurrentMonth);		
	},
	handleKeyPress (e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			// If the date is strictly equal to the format string, dispatch onChange
			const { format } = this.props;
			const { inputValue: { startDate, endDate } } = this.state;
			if (moment(startDate, format, true).isValid() 
				&& moment(endDate, format, true).isValid()) {
				this.props.onChange({ value: this.state.inputValue });
			}
		}
	},
	handleDaySelect ({ selection: value }) {
		// const value = DateUtils.addDayToRange(date, this.state.inputValue);
		this.props.onChange({ value });
		this.setState({
			pickerIsOpen: !!value.startDate && !!value.endDate,
			// month: date,
			inputValue: value,
		});
	},
	showPicker () {
		this.setState({ pickerIsOpen: true });
			// , this.showCurrentMonth);
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
		const popout = this.refs.rangePopout.getPortalDOMNode();
		// console.log(popout);
		while (rt) {
			if (rt === popout) return;
			rt = rt.parentNode;
		}
		// console.log(rt);
		this.setState({
			pickerIsOpen: false,
		});
	},
	// special for chinese only, otherwise use english by default
	localizeLang() {
		// const { currentLang } = this.props;
		const currentLang = i18n.locale;
		switch(currentLang) {
			case 'zhtw':
				return localeZHTW;
			case 'zhcn': 
				return localeZHCN;
			default:
				return localeEN;
		}
	},
	reset() {
		this.props.onChange({ value: {} });
		this.setState({
			pickerIsOpen: false,
			// month: date,
			inputValue: {},
		});
	},
	render () {
		const { value, format } = this.props;
		const ranges = [{
			startDate: value.startDate || new Date(),
			endDate: value.endDate || new Date(),
			key: 'selection',
		}];
		var displayValue = '';
		const { inputValue } = this.state;
		if (value.startDate && value.endDate) {
			displayValue = `${moment(value.startDate).format(format)} - ${moment(value.endDate).format(format)}`;
		} else if (inputValue.startDate) {
			displayValue = `${moment(value.startDate).format(format)}`;
		} else if (inputValue.endDate) {
			displayValue = `${moment(value.endDate).format(format)}`;
		}
		// console.log('> ranges: ', value, ranges[0].startDate, ranges[0].endDate);
		return (
			<div>
				<Group>
					<Section grow>
						<FormInput
							autoComplete="off"
							name={this.props.name}
							style={{ display: 'none' }}
						/>
						<FormInput
							autoComplete="off"
							readOnly={true}
							id={this.state.id}
							onBlur={this.handleBlur}
							onFocus={this.handleFocus}
							onChange={this.handleInputChange}
							onKeyPress={this.handleKeyPress}
							placeholder={`${format} - ${format}`}
							style={{ width: '230px' }}
							ref="input"
							value={displayValue}
						/>
					</Section>
					<Section>
						<Button onClick={this.reset}>{i18n.t('list.reset')}</Button>
					</Section>
				</Group>
				<Popout
					isOpen={this.state.pickerIsOpen}
					onCancel={this.handleCancel}
					ref="rangePopout"
					relativeToID={this.state.id}
					width={330}
				>
					<DateRange
						ranges={ranges}
						direction={'horizontal'}
						dateDisplayFormat={format}
						locale={this.localizeLang()}
						onChange={this.handleDaySelect}
					/>
				</Popout>
			</div>
		);
	},
});
