import moment from 'moment';
import React from 'react';
import {
	Grid,
	Button,
} from '@material-ui/core';
import {
	// Button,
	FormField,
	FormInput,
	// FormNote,
	// InlineGroup as Group,
	// InlineGroupSection as Section,
} from '../../elemental';
import DateInput from '../../components/DateInput';
import Field from '../Field';

// locales
import i18n from '../../../../i18n';

export default Field.create({

	displayName: 'DatetimeField',
	statics: {
		type: 'Datetime',
	},

	// focusTargetRef: 'dateInput',

	// // default input formats
	// dateInputFormat: 'YYYY-MM-DD',
	// timeInputFormat: 'HH:mm:ss',
	tzOffsetInputFormat: 'Z',

	// // parse formats (duplicated from lib/fieldTypes/datetime.js)
	// parseFormats: ['YYYY-MM-DD', 'YYYY-MM-DD h:m:s a', 'YYYY-MM-DD h:m a', 'YYYY-MM-DD H:m:s', 'YYYY-MM-DD H:m'],

	getInitialState () {
		return this.setValue(this.props);
	},

	// getDefaultProps () {
	// 	return {
	// 		formatString: 'YYYY-MM-DD HH:mm:ss',
	// 	};
	// },

	componentWillReceiveProps (nextProps) {
		if (this.props.value !== nextProps.value) {
			this.setState(this.setValue(nextProps));
		}
	},

	setValue(props) {
		const {
			dateFormat='YYYY-MM-DD',
			timeFormat='HH:mm:ss',
			value,
		} = props;
		return {
			fullFormat: `${dateFormat} ${timeFormat}`,
			// ${this.tzOffsetInputFormat}`,
			dateFormat,
			timeFormat,
			dateValue: value && this.moment(value).format(dateFormat),
			timeValue: value && this.moment(value).format(timeFormat),
			// tzOffsetValue: value ? this.moment(value).format(this.tzOffsetInputFormat) : this.moment().format(this.tzOffsetInputFormat),
		};
	},

	moment () {
		if (this.props.isUTC) return moment.utc.apply(moment, arguments);
		else return moment.apply(undefined, arguments);
	},

	// TODO: Move isValid() so we can share with server-side code
	isValid (value) {
		return this.moment(value, this.state.fullFormat).isValid();
	},

	// TODO: Move format() so we can share with server-side code
	format (value, format) {
		format = format || this.state.fullFormat;
		return value ? this.moment(value).format(format) : '';
	},

	handleChange (dateValue, timeValue) {
		const value = dateValue + ' ' + timeValue;
		const datetimeFormat = this.state.fullFormat;

		// if the change included a timezone offset, include that in the calculation (so NOW works correctly during DST changes)
		// this.setState({
		// 	tzOffsetValue: this.moment(value, datetimeFormat).format(this.tzOffsetInputFormat),
		// });

		this.props.onChange({
			path: this.props.path,
			value: this.isValid(value) ? this.moment(value, datetimeFormat).toISOString() : null,
		});
	},

	dateChanged ({ value }) {
		const dateValue = this.moment(value).format(this.state.dateFormat);
		const timeValue = this.moment(value).format(this.state.timeFormat);
		// const tzOffsetValue = this.moment().format(this.tzOffsetInputFormat); 
		this.setState({ dateValue, timeValue });
			// , tzOffsetValue });
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},

	// timeChanged (evt) {
	// 	this.setState({ timeValue: evt.target.value });
	// 	this.handleChange(this.state.dateValue, evt.target.value);
	// },

	setNow () {
		this.dateChanged({
			value: moment().format(this.state.fullFormat),
		})
	},

	renderUI () {
		let input;
		if (this.shouldRenderField()) {
			const {
				showToday,
			} = this.props;
			input = (
				<Grid
					container
					direction="row"
					justify="flex-start"
			  		alignItems="center"
			  		spacing={3}
				>
					<Grid item xs={3}>
						<DateInput
							{...this.props}
							onChange={this.dateChanged}
							fullFormat={this.state.fullFormat}
							value={this.props.value}
						/>
						<input
							type="hidden"
							name={this.getInputName(this.props.paths.date)}
							defaultValue={this.state.dateValue}
						/>
						<input
							type="hidden"
							autoComplete="off"
							name={this.getInputName(this.props.paths.time)}
							defaultValue={this.state.timeValue}
						/>
					</Grid>
					{
						!!showToday && <Grid item xs={3}>
							<Button
								variant="contained"
								color="primary"
								onClick={this.setNow}>
								{i18n.t('list.today')}
							</Button>
						</Grid>
					}
				</Grid>
			);
		} else {
			input = (
				<FormInput noedit>
					{this.format(this.props.value, this.state.fullFormat)}
				</FormInput>
			);
		}
		return (
			<FormField
				note={this.props.note}
				label={this.getRequired()}
				errorMessage={this.props.errorMessage}
			>
				{input}
			</FormField>
		);
	},
});
