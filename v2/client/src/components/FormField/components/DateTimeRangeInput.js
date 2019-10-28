import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
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
} from '../elemental';

let lastId = 0;

// lcoales
import i18n from '../../../../i18n';

export default createClass({
	displayName: 'DateTimeRangeInput',
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
		// const { currentLang } = this.props;
		const currentLang = i18n.locale;
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
						<Button onClick={this.reset}>{i18n.t('list.reset')}</Button>
					</Section>
				</Group>
				
			</div>
		);
	},
});
