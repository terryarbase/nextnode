// import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
import {
	Grid,
	Typography,
	Button,
	Fab,
	// FormControl,
	// InputLabel,
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

import Field from '../Field';
import CollapsedFieldLabel from '../../components/CollapsedFieldLabel';
// import NestedFormField from '../../components/NestedFormField';
import {
	FormField,
	FormInput,
	// FormNote,
	// LabelledControl,
} from '../../elemental';

// locales
import i18n from '../../../../i18n';

/**
 * TODO:
 * - Remove dependency on underscore
 * - Custom path support
 */
const useStyles = makeStyles(theme => ({
  label: {
  	color: grey[600],
  }
}));
const GridForm = props => {
	const classes = useStyles();
	const {
		items,
		onChange,
		values,
	} = props;
	const container = {
		container: true,
		direction: "row",
		justify: "flex-start",
  		alignItems: "center",
  		spacing: 3,
	};
	return (
		<Grid
			{...container}
		>
			{
				items.map(({ path, label, target=-1 }, index) => {
					let t = path;
					let value = values[t];
					if (target !== -1) {
						t = target;
						value = _.get(values, `${path}.${t}`);
					}
					
					return (
						<Grid container item xs key={index}>
							<Grid
								{...container}
							>
								<Grid item xs={3}>
									<Typography variant="subtitle1" className={classes.label}>
										{label}
									</Typography>
								</Grid>
								<Grid item xs>
									<FormInput
										onChange={onChange(t)}
										placeholder={label}
										value={value || ''}
									/>
								</Grid>
							</Grid>
					</Grid>
					);
				})
			}
		</Grid>
	);
}

export default Field.create({

	displayName: 'LocationField',
	statics: {
		type: 'Location',
	},

	getInitialState () {
		return {
			collapsedFields: {},
			improve: false,
			overwrite: false,
		};
	},

	componentWillMount () {
		const { value = [] } = this.props;
		var collapsedFields = {};
		_.forEach(['number', 'name', 'street2', 'geo'], (i) => {
			if (!value[i]) {
				collapsedFields[i] = true;
			}
		}, this);
		this.setState({ collapsedFields });
	},

	shouldCollapse () {
		return this.props.collapse && !this.formatValue();
	},

	uncollapseFields () {
		this.setState({
			collapsedFields: {},
		});
	},

	fieldChanged (fieldPath, event) {
		const { value = {}, path, onChange } = this.props;
		onChange({
			path,
			value: {
				...value,
				[fieldPath]: event.target.value,
			},
		});
	},

	makeChanger (fieldPath) {
		return this.fieldChanged.bind(this, fieldPath);
	},

	geoChanged (i, event) {
		const { value = {}, path, onChange } = this.props;
		const newVal = event.target.value;
		const geo = [
			i === 0 ? newVal : value.geo ? value.geo[0] : '',
			i === 1 ? newVal : value.geo ? value.geo[1] : '',
		];
		onChange({
			path,
			value: {
				...value,
				geo,
			},
		});
	},

	makeGeoChanger (fieldPath) {
		return this.geoChanged.bind(this, fieldPath);
	},

	formatValue () {
		const { value = {} } = this.props;
		return _.compact([
			value.number,
			value.name,
			value.street1,
			value.street2,
			value.suburb,
			value.state,
			value.postcode,
			value.country,
		]).join(', ');
	},

	renderValue () {
		return <FormInput noedit>{this.formatValue() || ''}</FormInput>;
	},

	renderField (fieldPath, label) {
		if (this.state.collapsedFields[fieldPath]) {
			return null;
		}
		const { value = {} } = this.props;
		//name={this.getInputName(path + '.' + fieldPath)}
		const items = [
			{
				label,
				path: fieldPath,
			}
		];
		return (
			<GridForm values={value} items={items} onChange={this.makeChanger} />
		);
	},

	renderSuburbState () {
		const { value = {} } = this.props;
		const items = [
			{
				label: i18n.t('list.suburb'),
				path: 'suburb',
			},
			{
				label: i18n.t('list.state'),
				path: 'state',
			}
		];
		return (
			<GridForm values={value} items={items} onChange={this.makeChanger} />
		);
	},

	renderPostcodeCountry () {
		const { value = {} } = this.props;
		const items = [
			{
				label: i18n.t('list.postCode'),
				path: 'postcode',
			},
			{
				label: i18n.t('list.country'),
				path: 'country',
			}
		];
		return (
			<GridForm values={value} items={items} onChange={this.makeChanger} />
		);
	},

	renderGeo () {
		if (this.state.collapsedFields.geo) {
			return null;
		}
		const { value = {} } = this.props;
		// const geo = value.geo || [];
		const items = [
			{
				label: i18n.t('list.latitude'),
				path: 'geo',
				target: 1,
			},
			{
				label: i18n.t('list.longitude'),
				path: 'geo',
				target: 0,
			}
		];
		return (
			<GridForm values={value} items={items} onChange={this.makeGeoChanger} />
		);
	},

	updateGoogleOption (key, e) {
		var newState = {};
		newState[key] = e.target.checked;
		this.setState(newState);
	},

	makeGoogler (key) {
		return this.updateGoogleOption.bind(this, key);
	},


	renderGoogleOptions () {
		const { enableMapsAPI } = this.props;
		if (!enableMapsAPI) return null;
		// name={this.getInputName(paths.overwrite)}
		let items = [
			{
				label: i18n.t('list.autoAndImprove'),
				path: 'improve',
			},
		];
		if (this.state.improve) {
			items = [
				...items,
				{
					label: i18n.t('list.replaceExistingData'),
					path: 'overwrite',
				}
			];
		}

		// name={this.getInputName(paths.improve)}
		return (
			<GridForm values={this.props.value || {}} items={items} onChange={this.makeGoogler} />
		);
	},


	renderUI () {

		if (!this.shouldRenderField()) {
			return (
				<FormField label={this.props.label}>{this.renderValue()}</FormField>
			);
		}

		/* eslint-disable no-script-url */
		var showMore = !_.isEmpty(this.state.collapsedFields)
			? <Fab variant="extended" color="primary" onClick={this.uncollapseFields} aria-label={i18n.t('list.showMoreFields')}>
				<MoreHorizIcon />
				{i18n.t('list.showMoreFields')}
			</Fab>
			: null;
		/* eslint-enable */

		const { path, required, noAddress, note } = this.props;
		const label = this.props.label ? `${this.props.label}${required ? ' *' : ''}` : null;
		return (
			<FormField label={label} note={note}>
				{this.renderGeo()}
				{this.renderField('number', i18n.t('list.poBoxShop'), true, true)}
				{this.renderField('name', i18n.t('list.buildingName'), true)}
				{this.renderField('street1', i18n.t('list.streetAddress1'))}
				{this.renderField('street2', i18n.t('list.streetAddress2'), true)}
				{this.renderSuburbState()}
				{this.renderPostcodeCountry()}
				{this.renderGoogleOptions()}
				{
					!noAddress && <div style={{ marginTop: '10px' }}>
						{showMore}
						<input
							type="hidden"
							name={path}
						/>
					</div>
				}
			</FormField>
		);
	},

});
