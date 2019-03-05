import moment from 'moment';
import React from 'react';
// import Popout from '../../admin/client/App/shared/Popout';
import DatetimeRangePicker from './libs/DatetimeRangePicker';
import localeZHTW from 'date-fns/locale/zh-TW';
import localeZHCN from 'date-fns/locale/zh-CN';
import localeEN from 'date-fns/locale/en-US';
import {
	FormInput,
	Button,
	InlineGroup as Group,
	InlineGroupSection as Section,
} from '../../admin/client/App/elemental';

let lastId = 0;

module.exports = React.createClass({
	displayName: 'DateTimeRangeInput',
	propTypes: {
		format: React.PropTypes.string,
		name: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		path: React.PropTypes.string,
		value: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.string,
		]),
	},
	getDefaultProps () {
		return {
			dateFormat: 'YYYY-MM-DD',
			timeFormat: 'HH:mm'
		};
	},
	getInitialState () {
		const id = ++lastId;
		const { value } = this.props;
		return {
			id: `_DateTimeRangeInput_${id}`,
			inputValue: value || {
				startDate: new Date(),
				endDate: new Date(),
			},
		};
	},
	componentWillReceiveProps: function (newProps) {
		// console.log('> newProps.value: ', newProps.value);
		if (JSON.stringify(newProps.value) === JSON.stringify(this.props.value)) return;
		this.setState({
			inputValue: newProps.value,
		});
	},
	handleDaySelect ({ start: startDate, end: endDate }) {

		const value = { startDate, endDate };
		this.props.onChange({ value });
		this.setState({
			inputValue: value,
		});
	},
	// special for chinese only, otherwise use english by default
	localizeLang() {
		const { currentLang } = this.props;
		switch(currentLang) {
			case 'zhtw':
				return 'zh-tw';
			case 'zhcn': 
				return 'zh-cn';
			default:
				return 'es-us';
		}
	},
	reset() {
		this.props.onChange({ value: {} });
		this.setState({
			inputValue: {},
		});
	},
	render () {
		const { value, dateFormat, timeFormat } = this.props;
		const ranges = {
			startDate: value.startDate || '',
			endDate: value.endDate || '',
		};

		return (
			<div>
				<Group>
					<Section grow>
						<FormInput
							autoComplete="off"
							name={this.props.name}
							style={{ display: 'none' }}
						/>
						<DatetimeRangePicker
							{...ranges} 
							dateFormat={dateFormat}
							timeFormat={timeFormat}
							inputProps={{
								placeholder: `${dateFormat} ${timeFormat}`,
							}}
							locale={this.localizeLang()}
							defaultValue={null}
							onChange={this.handleDaySelect}
						/>
					</Section>
					<Section>
						<span />
						<Button onClick={this.reset}>{this.props.t('reset')}</Button>
					</Section>
				</Group>
				
			</div>
		);
	},
});
