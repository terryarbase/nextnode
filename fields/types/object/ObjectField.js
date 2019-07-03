/* eslint-disable react/jsx-no-bind */

import assign from 'object-assign';
import { css, StyleSheet } from 'aphrodite/no-important';
import React from 'react';
import Field from '../Field';
import _map from 'lodash/map';

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
	handleFieldChange (fieldInfo) {
		const { value, path, onChange } = this.props;
		value[fieldInfo.path] = fieldInfo.value,
		onChange({ path, value });
	},
	renderSubFields (value) {
		return _map(Object.keys(this.props.fields), path => {
			const field = this.props.fields[path];
			if (typeof Fields[field.type] !== 'function') {
				return React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path });
			}

			const props = assign({}, field);
			props.value = value[field.path];
			props.values = value;
			props.values.delegated = !!this.props.values.delegated;
			props.onChange = this.handleFieldChange;
			props.mode = 'edit';
			props.inputNamePrefix = `${this.props.path}`;
			props.key = field.path;

			// TODO ?
			// if (props.dependsOn) {
			// 	props.currentDependencies = {};
			// 	Object.keys(props.dependsOn).forEach(dep => {
			// 		props.currentDependencies[dep] = this.state.values[dep];
			// 	});
			// }
			return React.createElement(Fields[field.type], props);
		});
	},
	renderField () {
		const { value, path, t } = this.props;
		console.log('>>> value', value, path);
		const { id } = value;
		const name = `${path}[id]`;

		return (
			<ObjectField key={id} {...{ id, name, t }}>
				{this.renderSubFields(value)}
			</ObjectField>
		);
	},
	renderUI () {
		console.log('>>> Object Types this.props', this.props);
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
		background: '#f8f8f8',
	    padding: 10,
    	boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1)',
	},
});
