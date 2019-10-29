/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import assign from 'object-assign';
import { css, StyleSheet } from 'aphrodite/no-important';
import React from 'react';
import Field from '../Field';
import _map from 'lodash/map';

import InvalidFieldType from '../../shared/InvalidFieldType';

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
			});
		})}
	</div>
);

export default Field.create({
	displayName: 'ObjectField',
	statics: {
		type: 'Object',
	},
	propTypes: {
		fields: PropTypes.object.isRequired,
		label: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		value: PropTypes.object,
	},
	handleFieldChange ({ path: infoPath, value: infoValue }) {
		let { value } = this.props;
		const { path, onChange } = this.props;
		value = {
			...value,
			[infoPath]: infoValue,
		}
		onChange({ path, value });
	},
	renderSubFields (value) {
		return _map(Object.keys(this.props.fields), path => {
			const field = this.props.fields[path];
			if (typeof Field[field.type] !== 'function') {
				return React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path });
			}

			const props = assign({}, field);
			props.value = value[field.path];
			props.values = value;
			props.values.delegated = !!this.props.values.delegated;
			props.onChange = this.handleFieldChange;
			props.mode = 'edit';
			props.currentLang = this.props.currentLang;
			props.inputNamePrefix = `${this.props.path}`;
			props.key = field.path;

			// TODO ?
			// if (props.dependsOn) {
			// 	props.currentDependencies = {};
			// 	Object.keys(props.dependsOn).forEach(dep => {
			// 		props.currentDependencies[dep] = this.state.values[dep];
			// 	});
			// }
			return React.createElement(Field[field.type], props);
		});
	},
	renderField () {
		const { value, path, t } = this.props;
		// console.log('>>> value', value, path);
		const { id } = value;
		const name = `${path}[id]`;

		return (
			<ObjectField key={id} {...{ id, name, t }}>
				{this.renderSubFields(value)}
			</ObjectField>
		);
	},
	renderUI () {
		// console.log('>>> Object Types this.props', this.props);
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
