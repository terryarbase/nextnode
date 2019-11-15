import PropTypes from 'prop-types';
import Field from '../Field';
import React from 'react';
import _ from 'lodash';
import { findDOMNode } from 'react-dom';
import {
  Button,
  IconButton,
  Fab,
} from '@material-ui/core';
import {
	Remove as RemoveIcon,
	Add as AddIcon,
} from '@material-ui/icons';
import {
	FormInput,
	FormNote,
	// Button,
	FormField,
} from '../../elemental';

// locales
import i18n from '../../../../i18n';

// utils
import {
	translateListName,
} from '../../../../utils/multilingual';

var lastId = 0;
var ENTER_KEYCODE = 13;

const newItem = ({ key, value }) => {
	lastId = lastId + 1;
	return {
		id: 'i' + lastId,
		key,
		value,
	};
}

const initialKeyItem = () => ({
	key: '',
	value: '',
});
// convert key and text as a string
const getStringKeyText = value => _.map(value, ({ key, value }) => `${key}${value}`).join('|');

export default Field.create({
	propTypes: {
		path: PropTypes.string.isRequired,
		value: PropTypes.oneOfType([
			PropTypes.array,
			PropTypes.string,
		]),
	},
	displayName: 'KeyTextField',
	statics: {
		type: 'KeyText',
	},
	getInitialState () {
		var { value } = this.props;
		// console.log('>>>>>>>>> ', value);
		value = _.isArray(value) ? _.map(value, newItem) : [];
		return {
			values: value,
			string: getStringKeyText(value),
		};
	},
	componentWillReceiveProps ({ value, currentLang }) {
		const { string } = this.state;
		// checks for the full string object in the nextporps, which is being to change
		// switch the language
		// console.log('>>>>>>> ', value);
		const nextString = getStringKeyText(value);
		// const languageChanged = currentLang && currentLang !== this.props.currentLang;
		if (nextString !== string) {
			this.setState({
				values: value || [],
				string: nextString,
			});
		}
	},
	valueChanged (values) {
		this.props.onChange({
			path: this.props.path,
			value: values,
		});
	},
	addItem () {
		const { values = [] } = this.state;
		var newValues = values.concat(newItem(initialKeyItem()));
		this.setState({
			values: newValues,
		});
		this.valueChanged(newValues);
	},
	removeItem (index) {
		const { values } = this.state;
		// var newValues = _.without(values, i);
		values.splice(index, 1);
		this.setState({
			values,
		});
		this.valueChanged(values);
	},
	updateItem (index, key, { value, target: { value: targetValue } }) {
		const { values } = this.state;
		values[index][key] = value || targetValue;
		this.setState({
			values,
		});
		this.valueChanged(values);
	},
	renderInputNote() {
		const { max = -1, min = -1, listKey } = this.props;
		var note = null;
		if (max !== -1 || min !== -1) {
			const listName = translateListName(listKey);
			note = (
				<FormNote style={{ marginTop: '10px' }}>
					{
						min !== -1 && <div>* {i18n.t('list.atLeast', {
							qty: min,
							listName,
							postfix: min > 1 ? 's' : ''
						})}</div>
					}
					{
						max !== -1 && <div>* {i18n.t('list.atMost', {
							qty: max,
							listName,
							postfix: max > 1 ? 's' : ''
						})}</div>
					}
				</FormNote>
			);
		}
		return note;
	},
	renderField () {
		const { max=-1, isCore, noeditkey } = this.props;
		const { values = [] } = this.state;
		return (
			<div>
				{_.map(values, this.renderItem)}
				{
					<input
						type="hidden"
						name={this.getInputName(this.props.path)} />
				}
				{
					!isCore && !noeditkey && !(values.length >= max || max === -1)
					&& <Fab variant="extended" color="primary" onClick={this.addItem} aria-label={i18n.t('list.addItem')}>
						<AddIcon />
						{i18n.t('list.addItem')}
					</Fab>
				}
				{
					this.renderInputNote()
				}
			</div>
		);
	},
	// addItemOnEnter (event) {
	// 	if (event.keyCode === ENTER_KEYCODE) {
	// 		this.addItem();
	// 		event.preventDefault();
	// 	}
	// },
	addItemOnEnter (event) {
		if (event.keyCode === ENTER_KEYCODE) {
			this.addItem(initialKeyItem());
			event.preventDefault();
		}
	},
	renderItem ({ id, key, value }, index) {
		const { noeditkey, mode } = this.props;
		const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
 		return (
			<FormField key={id} style={{ marginBottom: '1.5em' }}>
				<Input
					value={key}
					placeholder={i18n.t('list.keyPlaceholder')}
					// the key should be disabled if it is edit mode and the noeditkey is true
					// the key cannot be changed if the list is core list
					disabled={mode === 'edit' && !!key && noeditkey}
					onChange={e => this.updateItem(index, 'key', e)}
					autoComplete="off" />

				<Input
					value={value}
					onChange={e => this.updateItem(index, 'value', e)}
					onKeyDown={this.addItemOnEnter}
					placeholder={i18n.t('list.text')}
					autoComplete="off" />
				<IconButton
					disabled={mode === 'edit' && !!key && noeditkey}
					onClick={this.removeItem.bind(this, index)}
				>
					<RemoveIcon />
				</IconButton>
			</FormField>
		);
	},

	renderValue () {
		const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
		return (
			<div>
				{this.state.values.map(({ id, key, value }, i) => {
					return (
						<div key={id} style={i ? { marginTop: '1em' } : null}>
							<Input noedit value={key} />
							<Input noedit value={value} />
						</div>
					);
				})}
			</div>
		);
	},

	renderUI () {
		return this.renderWithErrorUI();
	},
});
