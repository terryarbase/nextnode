import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import moment from 'moment';
import DayPicker from 'react-day-picker';

import MomentLocaleUtils from 'react-day-picker/moment';
import {
	FormInput,
	FormSelect,
	Grid,
	SegmentedControl,
} from '../../../admin/client/App/elemental';

import 'moment/locale/en-au';
import 'moment/locale/zh-cn';
import 'moment/locale/zh-tw';

const INVERTED_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true },
];

const MODE_OPTIONS = [
	{ label: 'On', value: 'on' },
	{ label: 'After', value: 'after' },
	{ label: 'Before', value: 'before' },
	{ label: 'Between', value: 'between' },
];

const DayPickerIndicator = ({ activeInputField }) => {
	const style = activeInputField === 'before' ? { left: '11rem' } : null;

	return (
		<span className="DayPicker-Indicator" style={style}>
			<span className="DayPicker-Indicator__border" />
			<span className="DayPicker-Indicator__bg" />
		</span>
	);
};

function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		inverted: INVERTED_OPTIONS[0].value,
		value: moment(0, 'HH').format(),
		before: moment(0, 'HH').format(),
		after: moment(0, 'HH').format(),
	};
}

var DateFilter = React.createClass({
	displayName: 'DateFilter',
	propTypes: {
		filter: PropTypes.shape({
			mode: PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
			inverted: PropTypes.boolean,
		}),
	},
	statics: {
		getDefaultValue: getDefaultValue,
	},
	getDefaultProps () {
		return {
			format: 'DD-MM-YYYY',
			filter: getDefaultValue(),
			value: moment().startOf('day').toDate(),
		};
	},
	getInitialState () {
		return {
			activeInputField: 'after',
			month: new Date(), // The month to display in the calendar
		};
	},
	componentDidMount () {
		this.__isMounted = true;
	},
	componentWillUnmount () {
		this.__isMounted = false;
	},

	// ==============================
	// METHODS
	// ==============================

	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	},
	toggleInverted (value) {
		this.updateFilter({ inverted: value });
		this.setFocus(this.props.filter.mode);
	},
	selectMode (e) {
		const mode = e.target.value;
		this.updateFilter({ mode });
		this.setFocus(mode);
	},
	setFocus (mode) {
		// give the UI a moment to render
		if (mode === 'between') {
			setTimeout(() => {
				findDOMNode(this.refs[this.state.activeInputField]).focus();
			}, 50);
		} else {
			setTimeout(() => {
				this.refs.input.focus();
			}, 50);
		}
	},
	handleInputChange (e) {
		// TODO @jedwatson
		// Entering virtually any value will return an "Invalid date", so I'm
		// temporarily disabling user entry. This entire component needs review.

		// const { value } = e.target;
		// let { month } = this.state;
		// // Change the current month only if the value entered by the user is a valid
		// // date, according to the `L` format
		// if (moment(value, 'L', true).isValid()) {
		// 	month = moment(value, 'L').toDate();
		// }
		// this.updateFilter({ value: value });
		// this.setState({ month }, this.showCurrentDate);
	},
	setActiveField (field) {
		this.setState({
			activeInputField: field,
		});
	},
	switchBetweenActiveInputFields (e, day, modifiers) {
		if (modifiers && modifiers.disabled) return;

		const { activeInputField } = this.state;
		const send = {};
		const newActiveField = activeInputField === 'before'
			? 'after'
			: 'before';
		send[activeInputField] = day;
		this.updateFilter(send);
		this.setState(
			{ activeInputField: newActiveField },
			() => {
				findDOMNode(this.refs[newActiveField]).focus();
			}
		);
	},
	selectDay (e, day, modifiers) {
		if (modifiers && modifiers.disabled) return;
		this.updateFilter({ value: day });
	},
	showCurrentDate () {
		// give the UI a moment to render
		setTimeout(() => {
			this.refs.daypicker.showMonth(this.state.month);
		}, 50);
	},

	// ==============================
	// RENDERERS
	// ==============================

	renderToggle (invertedOptions) {
		const { filter } = this.props;
		return (
			<div style={{ marginBottom: '1em' }}>
				<SegmentedControl
					equalWidthSegments
					onChange={this.toggleInverted}
					options={invertedOptions}
					value={filter.inverted}
				/>
			</div>
		);
	},
	renderControls (moreOptions) {
		let controls;
		const { activeInputField } = this.state;
		const { field, filter, t, list, localePacks } = this.props;
		const mode = moreOptions.filter(i => i.value === filter.mode)[0];
		// const placeholder = field.label + ' is ' + mode.label.toLowerCase() + '...';
		const placeholder = t(`form:table_${list.key}`) + ' ' + mode.label + '...';

		// DayPicker Modifiers - Selected Day
		let modifiers = filter.mode === 'between' ? {
			selected: (day) => moment(filter[activeInputField]).isSame(day),
		} : {
			selected: (day) => moment(filter.value).isSame(day),
		};

		const localizationPickerConfig = localePacks && localePacks.altIdentify;
		// console.log(localizationPickerConfig);
		if (mode.value === 'between') {
			controls = (
				<div>
					<div style={{ marginBottom: '1em' }}>
						<Grid.Row xsmall="one-half" gutter={10}>
							<Grid.Col>
								<FormInput
									autoFocus
									ref="after"
									placeholder={t('from')}
									onChange={this.handleInputChange}
									onFocus={() => this.setActiveField('after')}
									value={moment(filter.after).format(this.props.format)}
								/>
							</Grid.Col>
							<Grid.Col>
								<FormInput
									ref="before"
									placeholder={t('to')}
									onChange={this.handleInputChange}
									onFocus={() => this.setActiveField('before')}
									value={moment(filter.before).format(this.props.format)}
								/>
							</Grid.Col>
						</Grid.Row>
					</div>
					<div style={{ position: 'relative' }}>
						<DayPicker
							modifiers={modifiers}
							className="DayPicker--chrome"
							localeUtils={MomentLocaleUtils}
							locale={localizationPickerConfig}
							onDayClick={this.switchBetweenActiveInputFields}
						/>
						<DayPickerIndicator activeInputField={activeInputField} />
					</div>
				</div>
			);
		} else {
			controls = (
				<div>
					<div style={{ marginBottom: '1em' }}>
						<FormInput
							autoFocus
							ref="input"
							placeholder={placeholder}
							value={moment(filter.value).format(this.props.format)}
							onChange={this.handleInputChange}
							onFocus={this.showCurrentDate}
						/>
					</div>
					<div style={{ position: 'relative' }}>
						<DayPicker
							ref="daypicker"
							modifiers={modifiers}
							className="DayPicker--chrome"
							onDayClick={this.selectDay}
						/>
						<DayPickerIndicator />
					</div>
				</div>
			);
		}

		return controls;
	},
	render () {
		const { filter, t } = this.props;
		const moreOptions = _.map(MODE_OPTIONS, option => (
			{
				...option,
				...{
					label: t(_.camelCase(option.value)),
				},
			}
		));
		const invertedOptions = _.map(INVERTED_OPTIONS, option => (
			{
				...option,
				...{
					label: t(_.camelCase(option.label))
				},
			}
		));
		const mode = moreOptions.filter(i => i.value === filter.mode)[0];
		return (
			<div>
				{this.renderToggle(invertedOptions)}
				<div style={{ marginBottom: '1em' }}>
					<FormSelect
						options={moreOptions}
						onChange={this.selectMode}
						value={mode.value}
					/>
				</div>
				{this.renderControls(moreOptions)}
			</div>
		);
	},
});

module.exports = DateFilter;
