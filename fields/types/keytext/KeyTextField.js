import Field from '../Field';
import React from 'react';
import _ from 'lodash';
import { FormInput } from '../../../admin/client/App/elemental';

var lastId = 0;
var ENTER_KEYCODE = 13;

const newItem = ({ key, text }) => {
	lastId = lastId + 1;
	return {
		id: 'i' + lastId,
		key,
		text,
	};
}

const initialKeyItem = () => {
	key: '',
	text: '',
};
// convert key and text as a string
const getStringKeyText = value => _.map(value, ({ key, text }) => `${key}${text}`).join('|');

module.exports = Field.create({
	propTypes: {
		path: PropTypes.string.isRequired,
		value: PropTypes.object,
	},
	displayName: 'KeyTextField',
	statics: {
		type: 'KeyText',
	},
	getInitialState () {
		var { value } = this.props;
		value = _.isArray(value) ? _.map(value, newItem) : [];
		return {
			values: value,
			string: getStringKeyText(value),
		};
	},
	componentWillReceiveProps: function ({ value }) {
		const { string } = this.state;
		// checks for the full string object in the nextporps, which is being to change
		const nextString = getStringKeyText(value);
		if (nextString !== string) {
			this.setState({
				values: value,
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
		const { values } = this.state;
		var newValues = values.concat(newItem(initialKeyItem()));
		this.setState({
			values: newValues,
		}, () => {
			if (!values.length) return;
			findDOMNode(this.refs['item_' + values.length]).focus();
		});
		this.valueChanged(newValues);
	},
	removeItem (index) {
		const { values } = this.state;
		// var newValues = _.without(values, i);
		values.splice(index, 1);
		this.setState({
			values,
		}, () => {
			findDOMNode(this.refs.button).focus();
		});
		this.valueChanged(values);
	},
	updateItem (index, key, { value, target: { targetValue } }) {
		const { values } = this.state;
		values[index][key] = value || targetValue;
		this.setState({
			values,
		});
		this.valueChanged(values);
	},
	renderField () {
		return (
			<div>
				{this.state.values.map(this.renderItem)}
				<Button ref="button" onClick={this.addItem}>Add Item</Button>
			</div>
		);
	},
	addItemOnEnter (event) {
		if (event.keyCode === ENTER_KEYCODE) {
			this.addItem();
			event.preventDefault();
		}
	},
	addItemOnEnter (event) {
		if (event.keyCode === ENTER_KEYCODE) {
			this.addItem(initialKeyItem());
			event.preventDefault();
		}
	},
	renderItem ({ id, key, text }, index) {
		const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
		return (
			<FormField key={id}>
				<Input
					ref={'item_' + (index + 1)}
					value={key}
					onChange={e => this.updateItem(index, 'key', e)}
					autoComplete="off" />
				<Input
					value={text}
					onChange={e => this.updateItem(index, 'text', e)}
					onKeyDown={this.addItemOnEnter}
					autoComplete="off" />
				<Button
					type="link-cancel"
					onClick={() => this.removeItem(index)}
					className="keystone-relational-button"
				>
					<span className="octicon octicon-x" />
				</Button>
			</FormField>
		);
	},

	renderValue () {
		const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
		return (
			<div>
				{this.state.values.map(({ id, key, text }, i) => {
					return (
						<div key={id} style={i ? { marginTop: '1em' } : null}>
							<Input noedit value={key} />
							<Input noedit value={text} />
						</div>
					);
				})}
			</div>
		);
	},
});
