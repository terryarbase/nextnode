/**
 * The form that's visible when "Create <ItemName>" is clicked on either the
 * List screen or the Item screen
 */

import React from 'react';
import assign from 'object-assign';
import vkey from 'vkey';
import AlertMessages from './AlertMessages';
import { Fields } from 'FieldTypes';
import InvalidFieldType from './InvalidFieldType';
import ToolbarSection from '../screens/Item/components/Toolbar/ToolbarSection';
import LocalizationSelector from '../components/Localization';
import { Button, Form, Modal } from '../elemental';

const CreateForm = React.createClass({
	displayName: 'CreateForm',
	propTypes: {
		err: React.PropTypes.object,
		isOpen: React.PropTypes.bool,
		list: React.PropTypes.object,
		onCancel: React.PropTypes.func,
		isLocale: React.PropTypes.bool,
		currentLang: React.PropTypes.string,
		onCreate: React.PropTypes.func,
	},
	getDefaultProps () {
		return {
			err: null,
			isOpen: false,
		};
	},
	getInitialState () {
		// Set the field values to their default values when first rendering the
		// form. (If they have a default value, that is)
		var values = {};
		Object.keys(this.props.list.fields).forEach(key => {
			var field = this.props.list.fields[key];
			var FieldComponent = Fields[field.type];
			values[field.path] = FieldComponent.getDefaultValue(field);
		});
		// console.log('>>>>>>>>>', values);
		return {
			values: values,
			alerts: {},
		};
	},
	componentDidMount () {
		document.body.addEventListener('keyup', this.handleKeyPress, false);
	},
	componentWillUnmount () {
		document.body.removeEventListener('keyup', this.handleKeyPress, false);
	},
	handleKeyPress (evt) {
		if (vkey[evt.keyCode] === '<escape>') {
			this.props.onCancel();
		}
	},
	// Handle input change events
	handleChange ({ path, value }) {
		const { isLocale, currentLang } = this.props;
		const { values: currentValue } = this.state;
		const values = this.props.list.getProperlyChangedValue({
			isLocale,
			currentLang,
			path,
			value,
			currentValue,
		});
		this.setState({
			values,
		});
	},
	// Set the props of a field
	getFieldProps (field) {
		const { isLocale, currentLang } = this.props;
		const { values } = this.state;
		// console.log(currentLang, values);
		return {
			...field,
			value: this.props.list.getProperlyValue({ field, isLocale, currentLang, values }),
			values,
			onChange: this.handleChange,
			mode: 'create',
			key: field.path,
		};
	},
	renderLanguageSelector() {
		if (this.props.isLocale && this.props.list.multilingual) {
			return (
				<ToolbarSection left className="Toolbar__section-inline create">
					<div>Edit Language</div>
					<LocalizationSelector
						{ ...this.props }
						language={this.props.currentLang}
						defaultLang={this.props.defaultLang} />
				</ToolbarSection>
			);
		}
		return null;
	},
	// Create a new item when the form is submitted
	submitForm (event) {
		event.preventDefault();
		const createForm = event.target;
		// get basic formdata first
		var formData = new FormData(createForm);
		const { isLocale } = this.props;
		const { values } = this.state;
		// convert multilingual field to formdata
		formData = this.props.list.getFormCreateData({
			formData,
			values,
			isLocale,
		});
		// for (var pair of formData.entries()) {
		// 	console.log(pair[0]+ ', ' + pair[1]); 
		// }
		// return;
		this.props.list.createItem(formData, (err, data) => {
			if (data) {
				if (this.props.onCreate) {
					this.props.onCreate(data);
				} else {
					// Clear form
					this.setState({
						values: {},
						alerts: {
							success: {
								success: 'Item created',
							},
						},
					});
				}
			} else {
				if (!err) {
					err = {
						error: 'connection error',
					};
				}
				// If we get a database error, show the database error message
				// instead of only saying "Database error"
				if (err.error === 'database error') {
					err.error = err.detail.errmsg;
				}
				this.setState({
					alerts: {
						error: err,
					},
				});
			}
		});
	},
	// Render the form itself
	renderForm () {
		if (!this.props.isOpen) return;

		var form = [];
		var list = this.props.list;
		var nameField = this.props.list.nameField;
		var focusWasSet;

		// If the name field is an initial one, we need to render a proper
		// input for it
		if (list.nameIsInitial) {
			var nameFieldProps = this.getFieldProps(nameField);
			nameFieldProps.autoFocus = focusWasSet = true;
			if (nameField.type === 'text') {
				nameFieldProps.className = 'item-name-field';
				nameFieldProps.placeholder = nameField.label;
				nameFieldProps.label = '';
			}
			form.push(React.createElement(Fields[nameField.type], nameFieldProps));
		}
		// console.log('list.initialFields: ', list.initialFields);
		// Render inputs for all initial fields
		Object.keys(list.initialFields).forEach(key => {
			var field = list.fields[list.initialFields[key]];
			// If there's something weird passed in as field type, render the
			// invalid field type component
			if (typeof Fields[field.type] !== 'function') {
				form.push(React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path }));
				return;
			}
			// Get the props for the input field
			var fieldProps = this.getFieldProps(field);
			// If there was no focusRef set previously, set the current field to
			// be the one to be focussed. Generally the first input field, if
			// there's an initial name field that takes precedence.
			if (!focusWasSet) {
				fieldProps.autoFocus = focusWasSet = true;
			}
			form.push(React.createElement(Fields[field.type], fieldProps));
		});

		return (
			<Form layout="horizontal" onSubmit={this.submitForm}>
				<Modal.Header
					text={'Create a new ' + list.singular}
					showCloseButton
				/>
				<Modal.Body>
					<AlertMessages alerts={this.state.alerts} />
					{this.renderLanguageSelector()}
					{form}
				</Modal.Body>
				<Modal.Footer>
					<Button color="success" type="submit" data-button-type="submit">
						Create
					</Button>
					<Button
						variant="link"
						color="cancel"
						data-button-type="cancel"
						onClick={this.props.onCancel}
					>
						Cancel
					</Button>
				</Modal.Footer>
			</Form>
		);
	},
	render () {
		return (
			<Modal.Dialog
				isOpen={this.props.isOpen}
				onClose={this.props.onCancel}
				backdropClosesModal
			>
				{this.renderForm()}
			</Modal.Dialog>
		);
	},
});

module.exports = CreateForm;
