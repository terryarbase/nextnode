import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
import Field from '../Field';
import CollapsedFieldLabel from '../../components/CollapsedFieldLabel';
import NestedFormField from '../../components/NestedFormField';

import {
	FormField,
	FormInput,
	FormNote,
	Grid,
	LabelledControl,
} from '../../elemental';

// locales
import i18n from '../../../../i18n';

/**
 * TODO:
 * - Remove dependency on underscore
 * - Custom path support
 */

module.exports = Field.create({

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

	renderField (fieldPath, label, collapse, autoFocus) {
		if (this.state.collapsedFields[fieldPath]) {
			return null;
		}
		const { value = {}, path } = this.props;
		//name={this.getInputName(path + '.' + fieldPath)}
		return (
			<NestedFormField label={label} data-field-location-path={path + '.' + fieldPath}>
				<FormInput
					autoFocus={autoFocus}
					onChange={this.makeChanger(fieldPath)}
					placeholder={label}
					value={value[fieldPath] || ''}
				/>
			</NestedFormField>
		);
	},

	renderSuburbState () {
		const { value = {}, path, t } = this.props;
		// name={this.getInputName(path + '.suburb')}
		// name={this.getInputName(path + '.state')}
		return (
			<NestedFormField label={`${i18n.t('list.suburb')}/${i18n.t('list.state')}`} data-field-location-path={path + '.suburb_state'}>
				<Grid.Row gutter={10}>
					<Grid.Col small="two-thirds" data-field-location-path={path + '.suburb'}>
						<FormInput
							onChange={this.makeChanger('suburb')}
							placeholder={i18n.t('list.suburb')}
							value={value.suburb || ''}
						/>
					</Grid.Col>
					<Grid.Col small="one-third" data-field-location-path={path + '.state'}>
						<FormInput
							onChange={this.makeChanger('state')}
							placeholder={i18n.t('list.state')}
							value={value.state || ''}
						/>
					</Grid.Col>
				</Grid.Row>
			</NestedFormField>
		);
	},

	renderPostcodeCountry () {
		const { value = {}, path, t } = this.props;
		// name={this.getInputName(path + '.postcode')}
		// name={this.getInputName(path + '.country')}
		return (
			<NestedFormField label={`${i18n.t('list.postCode')}/${i18n.t('list.country')}`} data-field-location-path={path + '.postcode_country'}>
				<Grid.Row gutter={10}>
					<Grid.Col small="one-third" data-field-location-path={path + '.postcode'}>
						<FormInput
							onChange={this.makeChanger('postcode')}
							placeholder={i18n.t('list.postCode')}
							value={value.postcode || ''}
						/>
					</Grid.Col>
					<Grid.Col small="two-thirds" data-field-location-path={path + '.country'}>
						<FormInput
							onChange={this.makeChanger('country')}
							placeholder={i18n.t('list.country')}
							value={value.country || ''}
						/>
					</Grid.Col>
				</Grid.Row>
			</NestedFormField>
		);
	},

	renderGeo () {
		if (this.state.collapsedFields.geo) {
			return null;
		}
		const { value = {}, path, paths } = this.props;
		const geo = value.geo || [];
		// name={this.getInputName(paths.geo + '[1]')}
		// name={this.getInputName(paths.geo + '[0]')}
		return (
			<NestedFormField label="Lat / Lng" data-field-location-path={path + '.geo'}>
				<Grid.Row gutter={10}>
					<Grid.Col small="one-half" data-field-location-path="latitude">
						<FormInput
							onChange={this.makeGeoChanger(1)}
							placeholder={i18n.t('list.latitude')}
							value={geo[1] || ''}
						/>
					</Grid.Col>
					<Grid.Col small="one-half" data-field-location-path="longitude">
						<FormInput
							onChange={this.makeGeoChanger(0)}
							placeholder={i18n.t('list.longitude')}
							value={geo[0] || ''}
						/>
					</Grid.Col>
				</Grid.Row>
			</NestedFormField>
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
		const { paths, enableMapsAPI, t } = this.props;
		if (!enableMapsAPI) return null;
		// name={this.getInputName(paths.overwrite)}
		var replace = this.state.improve ? (
			<LabelledControl
				checked={this.state.overwrite}
				label={i18n.t('list.replaceExistingData')}
				onChange={this.makeGoogler('overwrite')}
				type="checkbox"
			/>
		) : null;
		// name={this.getInputName(paths.improve)}
		return (
			<FormField offsetAbsentLabel>
				<LabelledControl
					checked={this.state.improve}
					label={i18n.t('list.autoAndImprove')}
					onChange={this.makeGoogler('improve')}
					title={i18n.t('list.locationCheck')}
					type="checkbox"
				/>
				{replace}
			</FormField>
		);
	},

	renderNote () {
		const { note } = this.props;
		if (!note) return null;
		// <FormNote note={note} />
		return (
			<FormField offsetAbsentLabel>
				<FormNote html={note} />
			</FormField>
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
			? <CollapsedFieldLabel onClick={this.uncollapseFields}>{i18n.t('list.showMoreFields')}</CollapsedFieldLabel>
			: null;
		/* eslint-enable */

		const { path, t, required, noAddress } = this.props;
		const label = this.props.label ? `${this.props.label}${required ? ' *' : ''}` : null;
		return (
			<div data-field-name={path} data-field-type="location">
				{this.renderGeo()}
				{
					!noAddress && <FormField label={label} htmlFor={path}>
						{showMore}
						<FormInput
							type="hidden"
							name={path}
						/>
					</FormField> 
				}
				{this.renderField('number', i18n.t('list.poBoxShop'), true, true)}
				{this.renderField('name', i18n.t('list.buildingName'), true)}
				{this.renderField('street1', i18n.t('list.streetAddress1'))}
				{this.renderField('street2', i18n.t('list.streetAddress2'), true)}
				{this.renderSuburbState()}
				{this.renderPostcodeCountry()}
				{this.renderGoogleOptions()}
				{this.renderNote()}
			</div>
		);
	},

});
