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
import { translate } from "react-i18next";

import { getTranslatedLabel } from '../../utils/locale';

const CreateForm = React.createClass({
	displayName: 'CreateForm',
	propTypes: {
		err: React.PropTypes.object,
		isOpen: React.PropTypes.bool,
		list: React.PropTypes.object,
		defaultLang: React.PropTypes.string,
		currentLang: React.PropTypes.string,
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
		this.statelessUI = {}; // special for file upload element
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
		const { isLocale, currentLang, t } = this.props;
		const { values } = this.state;
		// console.log(currentLang, values);
		return {
			...field,
			value: this.props.list.getProperlyValue({ field, isLocale, currentLang, values }),
			values,
			t,
			listKey: this.props.list.key,
			currentLang,
			onChange: this.handleChange,
			mode: 'create',
			key: field.path,
		};
	},
	renderLanguageSelector() {
		const { t } = this.props;
		if (this.props.isLocale && this.props.list.multilingual) {
			return (
				<ToolbarSection left className="Toolbar__section-inline create">
					<div>{t('contentVersion')}</div>
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
		const { isLocale, currentLang } = this.props;
		const { values } = this.state;
		// convert multilingual field to formdata
		formData = this.props.list.getFormCreateData({
			formData,
			values,
			isLocale,
		});
		this.props.list.createItem(formData, { headers: { langd: currentLang } }, (err, data) => {
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
		const { currentLang, t } = this.props;
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
		};
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
			fieldProps = {
				...fieldProps,
				...{
					label: getTranslatedLabel(t, {
						listKey: list.key, 
						prefix: 'field', 
						content: fieldProps.path,
					}),	
				},
			};
			if (fieldProps.note) {
				fieldProps = {
					...fieldProps,
					...{
						note: getTranslatedLabel(t, {
							listKey: list.key, 
							prefix: 'note', 
							content: fieldProps.path,
							altContent: fieldProps.note,
						}),
					},
				};
			}
			console.log(fieldProps);
			var element = React.createElement(Fields[field.type], fieldProps);
			// If there was no focusRef set previously, set the current field to
			// be the one to be focussed. Generally the first input field, if
			// there's an initial name field that takes precedence.
			if (!focusWasSet) {
				fieldProps.autoFocus = focusWasSet = true;
			}
			if ((field.stateless || field.cloneable) && field.multilingual) {
				if (this.statelessUI[field.path]) {
					if (this.statelessUI[field.path][currentLang]) {
						/*
						** [IMPORTANT]
						** Special for handle two kinds of element
						** 1. stateless: the state should be only handled inside the component without any value inspection (FILE Stream types)
						** 2. cloneable: the state should be only copied to everytime except the first time (HTML type)
						** Terry Chan
						** 23/11/2018
						*/
						if (field.cloneable) {
							element = React.cloneElement(
								this.statelessUI[field.path][currentLang],
								fieldProps
							);
						} else {
							element = this.statelessUI[field.path][currentLang];
								
						}
					}
				}
				// store the stateless element to state, no matter it is existing
				this.statelessUI = {
					...this.statelessUI,
					...{
						[field.path]: {
							...this.statelessUI[field.path],
							...{
								[currentLang]: element,
							}
						}
					}
				}
				const keys = Object.keys(this.statelessUI[field.path]);
				if (keys && keys.length) {
					keys.forEach(key => {
						form.push(
							<div key={`${field.path}${key}`} style={{ display: key === currentLang ? 'block' : 'none' }}>
								{this.statelessUI[field.path][key]}
							</div>
						);
					});
				}
			} else {
				form.push(element);
			}
			// form.push(React.createElement(Fields[field.type], fieldProps));
		});

		return (
			<Form layout="horizontal" onSubmit={this.submitForm}>
				<Modal.Header
					text={t('createANew', { listName: t(`table_${list.key}`) })}
					showCloseButton
				/>
				<Modal.Body>
					<AlertMessages alerts={this.state.alerts} />
					{this.renderLanguageSelector()}
					{form}
				</Modal.Body>
				<Modal.Footer>
					<Button color="success" type="submit" data-button-type="submit">
						{t('create')}
					</Button>
					<Button
						variant="link"
						color="cancel"
						data-button-type="cancel"
						onClick={this.props.onCancel}
					>
						{t('cancel')}
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

export default translate('form')(CreateForm);
// module.exports = CreateForm;
