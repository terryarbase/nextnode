/* eslint-disable react/jsx-no-bind */

import assign from 'object-assign';
import { css, StyleSheet } from 'aphrodite/no-important';
import React from 'react';
import Field from '../Field';
import _ from 'lodash';
import flatten  from 'flat';

import { Fields } from 'FieldTypes';
import InvalidFieldType from '../../../admin/client/App/shared/InvalidFieldType';

const ObjectField = ({ name, id, children, t }) => (
	<div style={{
		// borderLeft: '2px solid #eee',
		// paddingLeft: 15,
		// marginLeft: 10,
	}}>
		{name && <input type="hidden" name={name} value={id}/>}
		
		{React.Children.map(children, child => {
			return React.cloneElement(child, {
				name,
				id,
				t,
			});
		})}
	</div>
);

module.exports = Field.create({
	displayName: 'ObjectField',
	statics: {
		type: 'Object',
	},
	propTypes: {
		fields: React.PropTypes.object.isRequired,
		label: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		path: React.PropTypes.string.isRequired,
		value: React.PropTypes.object,
	},
	getValue () {
		const { value } = this.props;
		// initial value be object if not set
		return value ? value : {};
	},
	handleFieldChange (fieldInfo) {
		const { path, onChange } = this.props;
		const value = this.getValue();
		value[fieldInfo.path] = fieldInfo.value,
		onChange({ path, value });
	},
	renderSubFields (value) {
		return _.map(Object.keys(this.props.fields), path => {
			const field = this.props.fields[path];
			if (typeof Fields[field.type] !== 'function') {
				return React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path });
			}

			const props = assign({}, field);
			props.value = value[field.path];
			// flatten values to one layer object for support 'dependsOn' feature to nested object
			props.values = flatten(this.props.values, {
				safe: true
			});
			props.values.delegated = !!this.props.values.delegated;
			props.onChange = this.handleFieldChange;
			props.mode = 'edit';
			props.currentLang = this.props.currentLang;
			props.nestedPath = [
				...this.props.nestedPath || [],
				this.props.path,
			];
			props.inputNamePrefix = _.map(props.nestedPath, (path, index) => {
				return index === 0 ? path: `[${path}]`;
			}).join('');
			props.key = field.path;
			return React.createElement(Fields[field.type], props);
		});
	},
	renderField () {
		const { path, t } = this.props;
		const value = this.getValue();
		const { id } = value;
		const name = `${path}[id]`;
		return (
			<ObjectField key={id} {...{ id, name, t }}>
				{this.renderSubFields(value)}
			</ObjectField>
		);
	},
	renderUI () {
		const { required } = this.props;
		const label = this.props.label ? `${this.props.label}${required ? ' *' : ''}` : null;
		return (
			<div className={css(classes.container)}>
				<h3 data-things="whatever">{label}</h3>
				{this.renderField()}
				{this.renderNote()}
			</div>
		);
	},
});

const classes = StyleSheet.create({
	container: {
		marginTop: '2em',
		marginBottom: '1.5em',
		background: '#f8f8f8',
	    padding: '10px 15px 1px 15px',
		boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.2)',
		borderLeft: '3px solid #c3c3c3',
	},
});
