/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import assign from 'object-assign';
import { css, StyleSheet } from 'aphrodite/no-important';
import React from 'react';
import Field from '../Field';

import _cloneDeep from 'lodash/cloneDeep';
import {
  Button,
} from '@material-ui/core';

import Fields from './../fields';
import { GlyphButton } from '../../elemental';

import InvalidFieldType from '../../shared/InvalidFieldType';
import Domify from '../../shared/Domify';

// locales
import i18n from '../../../../i18n';

let i = 0;
function generateId () {
	return i++;
};

const ItemDom = ({  name, id, onRemove, children, t }) => (
	<div style={{
		borderTop: '2px solid #eee',
		paddingTop: 15,
	}}>
		{name && <input type="hidden" name={name} value={id} />}
		
		{React.Children.map(children, child => {
			return React.cloneElement(child, {
				name,
				id,
				onRemove,
			});
		})}

		<div style={{ textAlign: 'right', paddingBottom: 10 }}>
			<Button color="danger" onClick={onRemove}>
				{i18n.t('list.remove')}
			</Button>
		</div>
	</div>
);

export default Field.create({
	displayName: 'ListField',
	statics: {
		type: 'List',
	},
	propTypes: {
		fields: PropTypes.object.isRequired,
		label: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		value: PropTypes.array,
	},
	addItem () {
		const { path, value, onChange } = this.props;
		onChange({
			path,
			value: [
				...value,
				{
					id: generateId(),
					_isNew: true,
				},
			],
		});
	},
	removeItem (index) {
		const { value: oldValue, path, onChange } = this.props;
		const value = oldValue.slice(0, index).concat(oldValue.slice(index + 1));
		onChange({ path, value });
	},
	handleFieldChange (index, event) {
		const { value: oldValue, path, onChange } = this.props;
		const head = oldValue.slice(0, index);
		const item = {
			...oldValue[index],
			[event.path]: event.value,
		};
		const tail = oldValue.slice(index + 1);
		const value = [...head, item, ...tail];
		onChange({ path, value });
	},
	renderFieldsForItem (index, value) {
		return Object.keys(this.props.fields).map((path) => {
			const field = this.props.fields[path];
			if (typeof Fields[field.type] !== 'function') {
				return React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path });
			}

			/* 
			** getRelatedFilter is support single not nested field
			** so that, clone the list and set subField data to one-level data
			** Fung Lee
			** 13/06/2019
			*/
			const list = _cloneDeep(this.props.list);
			list.fields = this.props.list.fields[this.props.path].fields;

			// cant get child state here, so imitate state from parent props data
			const state = {
				values: this.props.values[this.props.path][index],
			};

			let props = assign({}, field);
			props.list = list;
			props.path = field.path;
			props.value = value[field.path];
			props.values = value;
			props.onChange = this.handleFieldChange.bind(this, index);
			props.mode = 'edit';
			props.inputNamePrefix = `${this.props.path}[${index}]`;
			props.key = field.path;

			const filters = list.getRelatedFilter(field, props.filters, props, state);

			if (filters) {
				props = {
					...props,
					filters,
				};
			}

			// TODO ?
			// if (props.dependsOn) {
			// 	props.currentDependencies = {};
			// 	Object.keys(props.dependsOn).forEach(dep => {
			// 		props.currentDependencies[dep] = this.state.values[dep];
			// 	});
			// }
			// console.log(props);
			return React.createElement(Fields[field.type], props);
		}, this);
	},
	renderItems () {
		const { value = [], path, t } = this.props;
		const onAdd = this.addItem;
		return (
			<div>
				{value.map((value, index) => {
					const { id, _isNew } = value;

					const name = !_isNew && `${path}[${index}][id]`;
					// console.log(name, value);
					const onRemove = e => this.removeItem(index);

					return (
						<ItemDom key={id} {...{ id, name, onRemove, t }}>
							{this.renderFieldsForItem(index, value)}
						</ItemDom>
					);
				})}

				<GlyphButton color="success" glyph="plus" position="left" onClick={onAdd}>
					{i18n.t('list.add')}
				</GlyphButton>
			</div>
		);
	},
	renderUI () {
		const { value, required } = this.props;
		const label = this.props.label ? `${this.props.label}${required ? ' *' : ''}` : null;
		return (
			<div className={css(classes.container)}>
				<h3 data-things="whatever">{label}</h3>
				{this.shouldRenderField() ? (
					this.renderItems()
				) : (
					<Domify value={value} />
				)}
				{this.renderNote()}
			</div>
		);
	},
});

const classes = StyleSheet.create({
	container: {
		marginTop: '2em',
		marginLeft: '1em',
		paddingLeft: '1em',
		boxShadow: '-2px 0 0 rgba(0, 0, 0, 0.1)',
	},
});
