import PropTypes from 'prop-types';
import {
	Grid,
	Button,
} from '@material-ui/core';
import Field from '../Field';
import moment from 'moment';
import React from 'react';

import DateInput from '../../components/DateInput';
import {
	// Button,
	FormInput,
	// InlineGroup as Group,
	// InlineGroupSection as Section,
} from '../../elemental';

// locales
import i18n from '../../../../i18n';
/*
TODO: Implement yearRange Prop, or deprecate for max / min values (better)
*/

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT_STRING = 'Do MMM YYYY';

export default Field.create({
	displayName: 'DateField',
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
	getInitialState () {
		const {
			dateFormat='YYYY-MM-DD',
		} = this.props;
		return {
			fullFormat: dateFormat,
		};
	},
	valueChanged ({ value }) {
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
		return this.toMoment(value, this.state.fullFormat).isValid();
	},
	format (value) {
		return value ? this.toMoment(value).format(this.state.fullFormat) : '';
	},
	setToday () {
		this.valueChanged({
			value: this.toMoment(moment()).format(this.state.fullFormat),
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

		const { showToday } = this.props;

		const dateAsMoment = this.toMoment(this.props.value);
		const value = this.props.value && dateAsMoment.isValid()
			? dateAsMoment.format(this.state.fullFormat)
			: this.props.value;
		return (
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
						fullFormat={this.state.fullFormat}
						name={this.getInputName(this.props.path)}
						onChange={this.valueChanged}
						value={value}
					/>
				</Grid>
				{
					!!showToday && <Grid item xs={3}>
						<Button variant="contained" color="primary" onClick={this.setToday}>{i18n.t('list.today')}</Button>
					</Grid>
				}
			</Grid>
		);
	},
	renderUI() {
		return this.renderWithErrorUI();
	},

});
