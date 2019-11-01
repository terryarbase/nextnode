import React from 'react';
import _ from 'lodash';
// import { findDOMNode } from 'react-dom';
import {
  Button,
  IconButton,
  Grid,
  Fab,
} from '@material-ui/core';
import {
	Remove as RemoveIcon,
	Add as AddIcon,
} from '@material-ui/icons';
import {
	// Button,
	FormField,
	FormInput,
} from './../elemental';

import i18n from './../../../i18n';


var lastId = 0;
var ENTER_KEYCODE = 13;

function newItem (value) {
	lastId = lastId + 1;
	return { key: 'i' + lastId, value: value };
}

function reduceValues (values) {
	return values.map(i => i.value);
}

export default {
	getInitialState: function () {
		return {
			values: Array.isArray(this.props.value) ? this.props.value.map(newItem) : [],
		};
	},

	componentWillReceiveProps: function ({ value }) {
		const { values } = this.state;
		const fullValue = value && Array.isArray(value) && value.join('|');
		const fullStateValue = values && Object.keys(values).length && reduceValues(values).join('|');
		if (fullValue && fullStateValue && fullValue !== fullStateValue) {
			this.setState({
				values: value.map(newItem),
			});
		}
	},

	addItem: function () {
		var newValues = this.state.values.concat(newItem(''));
		this.setState({
			values: newValues,
		});
		// , () => {
		// 	if (!this.state.values.length) return;
		// 	this.refs['item_' + this.state.values.length].focus();
		// });
		this.valueChanged(reduceValues(newValues));
	},

	removeItem: function (i) {
		var newValues = _.without(this.state.values, i);
		this.setState({
			values: newValues,
		});
		// , function () {
		// 	this.refs.button.focus();
		// });
		this.valueChanged(reduceValues(newValues));
	},

	updateItem: function (i, event) {
		var updatedValues = this.state.values;
		var updateIndex = updatedValues.indexOf(i);
		var newValue = event.value || event.target.value;
		if (this.isValid === undefined || this.isValid(newValue)) {
			updatedValues[updateIndex].value = this.cleanInput ? this.cleanInput(newValue) : newValue;
		}
		this.setState({
			values: updatedValues,
		});
		this.valueChanged(reduceValues(updatedValues));
	},

	valueChanged: function (values) {
		// console.log(values, this.props.path);
		this.props.onChange({
			path: this.props.path,
			value: values,
		});
	},

	renderField: function () {
		return (
			<div>
				{this.state.values.map(this.renderItem)}
				<input type="hidden" name={this.getInputName(this.props.path)} />
				<Fab variant="extended" color="primary" onClick={this.addItem} aria-label={i18n.t('list.addItem')}>
					<AddIcon />
					{i18n.t('list.addItem')}
				</Fab>
			</div>
		);
	},

	renderItem: function (item, index) {
		const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
		const value = this.processInputValue ? this.processInputValue(item.value) : item.value;
		return (
			<FormField key={index}>
				<Grid
					container
					direction="row"
					justify="flex-start"
			  		alignItems="center"
			  		spacing={3}
				>
					<Grid item xs={3}>
						<Input
							{...this.props}
							path={this.props.path}
							value={value}
							label={this.props.label}
							onChange={this.updateItem.bind(this, item)}
							onKeyDown={this.addItemOnEnter}
							autoComplete="off"
						/>
					</Grid>
					<Grid item xs={3}>
						<IconButton onClick={this.removeItem.bind(this, item)}>
							<RemoveIcon />
						</IconButton>
					</Grid>
				</Grid>
			</FormField>
		);
	},

	renderValue: function () {
		const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
		return (
			<div>
				{this.state.values.map((item, i) => {
					const value = this.formatValue ? this.formatValue(item.value) : item.value;
					return (
						<div key={i} style={i ? { marginTop: '1em' } : null}>
							<Input noedit value={value} />
						</div>
					);
				})}
			</div>
		);
	},

	// Override shouldCollapse to check for array length
	shouldCollapse: function () {
		return this.props.collapse && !this.props.value.length;
	},

	addItemOnEnter: function (event) {
		if (event.keyCode === ENTER_KEYCODE) {
			this.addItem();
			event.preventDefault();
		}
	},
};
