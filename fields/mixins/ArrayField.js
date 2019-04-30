var React = require('react');

import _ from 'lodash';
import { findDOMNode } from 'react-dom';

var Button = require('elemental').Button;
var FormField = require('elemental').FormField;
var FormInput = require('elemental').FormInput;

var lastId = 0;
var ENTER_KEYCODE = 13;

function newItem (value) {
	lastId = lastId + 1;
	return { key: 'i' + lastId, value: value };
}

function reduceValues (values) {
	return values.map(i => i.value);
}

module.exports = {
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
		}, () => {
			if (!this.state.values.length) return;
			findDOMNode(this.refs['item_' + this.state.values.length]).focus();
		});
		this.valueChanged(reduceValues(newValues));
	},

	removeItem: function (i) {
		var newValues = _.without(this.state.values, i);
		this.setState({
			values: newValues,
		}, function () {
			findDOMNode(this.refs.button).focus();
		});
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
		const { t } = this.props;
		return (
			<div>
				{this.state.values.map(this.renderItem)}
				<FormInput type="hidden" name={this.getInputName(this.props.path)} />
				<Button ref="button" onClick={this.addItem}>{t('addItem')}</Button>
			</div>
		);
	},

	renderItem: function (item, index) {
		const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
		const value = this.processInputValue ? this.processInputValue(item.value) : item.value;
		return (
			<FormField key={item.key}>
				<Input ref={'item_' + (index + 1)} value={value} onChange={this.updateItem.bind(this, item)} onKeyDown={this.addItemOnEnter} autoComplete="off" />
				<Button type="link-cancel" onClick={this.removeItem.bind(this, item)} className="keystone-relational-button">
					<span className="octicon octicon-x" />
				</Button>
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
