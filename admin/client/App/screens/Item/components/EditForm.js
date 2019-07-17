import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import assign from 'object-assign';
import { translate } from "react-i18next";

import {
	Form,
	FormField,
	FormInput,
	Grid,
	ResponsiveText,
} from '../../../elemental';
import { Alert } from '../../../elemental';

import { Fields } from 'FieldTypes';
import { fade } from '../../../../utils/color';
import theme from '../../../../theme';

import { Button, LoadingButton } from '../../../elemental';
import AlertMessages from '../../../shared/AlertMessages';
import ConfirmationDialog from '../../../shared/ConfirmationDialog';

import FormHeading from './FormHeading';
import AltText from './AltText';
import FooterBar from './FooterBar';
import InvalidFieldType from '../../../shared/InvalidFieldType';

import { deleteItem } from '../actions';

import { upcase } from '../../../../utils/string';
import { getTranslatedLabel } from '../../../../utils/locale';
// const WrapperComponent = ({ display, children }) => (<div style={{ display: display ? 'block' : 'none' }}>{children}</div>);

function getNameFromData (data) {
	if (typeof data === 'object') {
		if (typeof data.first === 'string' && typeof data.last === 'string') {
			return data.first + ' ' + data.last;
		} else if (data.id) {
			return data.id;
		}
	}
	return data;
}

function smoothScrollTop () {
	var position = window.scrollY || window.pageYOffset;
	var speed = position / 10;

	if (position > 1) {
		var newPosition = position - speed;

		window.scrollTo(0, newPosition);
		window.requestAnimationFrame(smoothScrollTop);
	} else {
		window.scrollTo(0, 0);
	}
}

var EditForm = React.createClass({
	displayName: 'EditForm',
	propTypes: {
		data: React.PropTypes.object,
		list: React.PropTypes.object,
	},
	getInitialState () {
		this.statelessUI = {}; // special for file upload element
		return {
			values: assign({}, this.props.data.fields),
			confirmationDialog: null,
			loading: false,
			lastValues: null, // used for resetting
			focusFirstField: !this.props.list.nameField && !this.props.list.nameFieldIsFormHeader,
			// statelessUI: {},	// special for file upload element
		};
	},
	componentDidMount () {
		this.__isMounted = true;
	},
	componentWillUnmount () {
		this.__isMounted = false;
	},
	getFieldProps (field) {
		const { isLocale, currentLang, t, i18n } = this.props;
		const { values } = this.state;
		const props = assign({}, field);
		const alerts = this.state.alerts;
		// Display validation errors inline
		if (alerts && alerts.error) {
			// && alerts.error.error === 'validation errors') {
			if (alerts.error.detail[field.path]) {
				// NOTE: This won't work yet, as ElementalUI doesn't allow
				// passed in isValid, only invalidates via internal state.
				// PR to fix that: https://github.com/elementalui/elemental/pull/149
				props.isValid = false;
			}
		}
		props.list = this.props.list;
		props.value = this.props.list.getProperlyValue({ field, isLocale, currentLang, values });
		props.values = values;
		props.currentLang = currentLang;
		props.onChange = this.handleChange;
		props.mode = 'edit';
		props.isCore = this.props.list.isCore;
		props.listKey = this.props.list.key;
		props.t = t;
		props.i18n = i18n;
		return props;
	},
	/*
	** check field permission for UI
	** Fung Lee
	** 20/06/2019
	*/
	checkFieldPermission(props) {
		const { user, permission } = this.props;
		if (user.delegated) return props;	// ignore checking

		switch(permission[props.path]) {
			case 0:
				// No View
				return;
			case 1: 
				// View Only
				props.noedit = true;
				return props;
			case 2:
				// Edit
				return props;
			default:
				// still render for no permission set
				return props;
		}
	},
	handleChange ({ path, value }) {
		// const { path, value } = e;
		// console.log(path, value);
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

	toggleDeleteDialog () {
		this.setState({
			deleteDialogIsOpen: !this.state.deleteDialogIsOpen,
		});
	},
	toggleResetDialog () {
		this.setState({
			resetDialogIsOpen: !this.state.resetDialogIsOpen,
		});
	},
	handleReset () {
		this.setState({
			values: assign({}, this.state.lastValues || this.props.data.fields),
			resetDialogIsOpen: false,
		});
	},
	handleDelete () {
		const { data } = this.props;
		this.props.dispatch(deleteItem(data.id, this.props.router));
	},
	handleKeyFocus () {
		const input = this.refs.keyOrIdInput;
		input.select();
	},
	removeConfirmationDialog () {
		this.setState({
			confirmationDialog: null,
		});
	},
	updateItem () {
		const { data, list } = this.props;
		const editForm = this.refs.editForm;
		var formData = new FormData(editForm);
		const { isLocale, currentLang, t } = this.props;
		const { values } = this.state;
		formData = this.props.list.getFormCreateData({
			formData,
			values,
			isLocale,
		});
		// convert multilingual field to formdata
		
		// for (var pair of formData.entries()) {
		//     console.log(pair[0]+ ', ' + pair[1]); 
		// }
		// Fix for Safari where XHR form submission fails when input[type=file] is empty
		// https://stackoverflow.com/questions/49614091/safari-11-1-ajax-xhr-form-submission-fails-when-inputtype-file-is-empty
		$(editForm).find("input[type='file']").each(function () {
			if ($(this).get(0).files.length === 0) { $(this).prop('disabled', true); }
		});

		$(editForm).find("input[type='file']").each(function () {
			if ($(this).get(0).files.length === 0) { $(this).prop('disabled', false); }
		});

		// Show loading indicator
		this.setState({
			loading: true,
		});

		list.updateItem(data.id, formData, (err, data) => {
			smoothScrollTop();
			if (err) {
				this.setState({
					alerts: {
						error: err,
					},
					loading: false,
				});
			} else {
				// Success, display success flash messages, replace values
				this.statelessUI = {};
				// TODO: Update key value
				this.setState({
					alerts: {
						success: {
							success: t('editMsg'),
						},
					},
					lastValues: this.state.values,
					values: data.fields,
					loading: false,
				});
			}
		});
	},
	renderKeyOrId () {
		var className = 'EditForm__key-or-id';
		var list = this.props.list;
		const { t } = this.props;
		if (list.nameField && list.autokey && this.props.data[list.autokey.path]) {
			return (
				<div className={className}>
					<AltText
						modified="ID:"
						normal={`${upcase(list.autokey.path)}: `}
						title={t('altRevealTitle')}
						className="EditForm__key-or-id__label" />
					<AltText
						modified={<input ref="keyOrIdInput" onFocus={this.handleKeyFocus} value={this.props.data.id} className="EditForm__key-or-id__input" readOnly />}
						normal={<input ref="keyOrIdInput" onFocus={this.handleKeyFocus} value={this.props.data[list.autokey.path]} className="EditForm__key-or-id__input" readOnly />}
						title={t('altRevealTitle')}
						className="EditForm__key-or-id__field" />
				</div>
			);
		} else if (list.autokey && this.props.data[list.autokey.path]) {
			return (
				<div className={className}>
					<span className="EditForm__key-or-id__label">{list.autokey.path}: </span>
					<div className="EditForm__key-or-id__field">
						<input ref="keyOrIdInput" onFocus={this.handleKeyFocus} value={this.props.data[list.autokey.path]} className="EditForm__key-or-id__input" readOnly />
					</div>
				</div>
			);
		} else if (list.nameField) {
			return (
				<div className={className}>
					<span className="EditForm__key-or-id__label">ID: </span>
					<div className="EditForm__key-or-id__field">
						<input ref="keyOrIdInput" onFocus={this.handleKeyFocus} value={this.props.data.id} className="EditForm__key-or-id__input" readOnly />
					</div>
				</div>
			);
		}
	},
	renderNameField () {
		const { t, list } = this.props;
		var nameField = this.props.list.nameField;
		var nameFieldIsFormHeader = this.props.list.nameFieldIsFormHeader;
		var wrapNameField = field => (
			<div className="EditForm__name-field">
				{field}
			</div>
		);
		if (list.nolist) {
			return wrapNameField(
				<h2>{t(`table_${list.key}`)}</h2>
			);
		} else if (nameFieldIsFormHeader) {
			var nameFieldProps = this.getFieldProps(nameField);
			nameFieldProps.label = null;
			nameFieldProps.size = 'full';
			nameFieldProps.autoFocus = true;
			nameFieldProps.inputProps = {
				className: 'item-name-field',
				placeholder: _.startCase('name'),
				size: 'large',
			};
			if (nameFieldProps.note) {
				nameFieldProps = {
					...nameFieldProps,
					...{
						note: getTranslatedLabel(t, {
							listKey: list.key, 
							prefix: 'note', 
							content: _.camelCase(nameFieldProps.path),
							altContent: nameFieldProps.note,
						})
					},
				};
			}
			return wrapNameField(
				React.createElement(Fields[nameField.type], nameFieldProps)
			);
		} else {
			return wrapNameField(
				<h2>{this.props.data.name || `(${t('noNameLabel')})`}</h2>
			);
		}
	},
	// getLocaleLabel (listKey, prefix, content, altContent) {
	// 	const { t } = this.props;
	// 	const tableLocaleLabelKey = `${listKey}-${prefix}-${content}`;
	// 	const tableLocaleLabel = t(tableLocaleLabelKey);
	// 	// console.log(exists);
	// 	// console.log('tableLocaleLabel ', tableLocaleLabelKey, t(tableLocaleLabelKey));
	// 	if (tableLocaleLabel !== tableLocaleLabelKey) {
	// 		return tableLocaleLabel;
	// 	} else {
	// 		const globalLocaleLabelKey = `${prefix}-${content}`;
	// 		const globalLocaleLabel = t(globalLocaleLabelKey);
	// 		if (globalLocaleLabelKey !== globalLocaleLabel) {
	// 			return globalLocaleLabel;
	// 		}
	// 	}
	// 	return altContent || content;
	// },
	// getRelatedFilter(field, initFilters={}) {
	// 	const { isLocale, currentLang, t, i18n, list } = this.props;
	// 	let { values } = this.state;
	// 	// let mapping = null;
	// 	if (field.filters) {
	// 		let { filters={} } = field;
	// 		filters = {
	// 			...filters,
	// 			...initFilters,
	// 		};
	// 		let targetField = null;
	// 		return _.chain(filters).reduce((accum, value, field) => {
	// 			// while the filter value is mapping field being with colun
	// 			if (/^:/i.test(value)) {
	// 				targetField = value.replace(/^:/, '');
	// 				return {
	// 					...accum,
	// 					[field]: list.getProperlyValue({
	// 						field: list.fields[targetField],
	// 						isLocale,
	// 						currentLang,
	// 						values,
	// 					}),
	// 				};
	// 			}
	// 			return accum;
	// 		}, filters).value();
	// 	}
	// 	return null;
	// 	// this.props.list.getProperlyValue({ field, isLocale, currentLang, values });
	// },
	renderFormElements () {
		var headings = 0;
		const { currentLang, t, list: { key: listKey }, i18next } = this.props;
		var elements = [];
		this.props.list.uiElements.forEach((el, index) => {
			// Don't render the name field if it is the header since it'll be rendered in BIG above
			// the list. (see renderNameField method, this is the reverse check of the one it does)
			if (
				this.props.list.nameField
				&& el.field === this.props.list.nameField.path
				&& this.props.list.nameFieldIsFormHeader
			) return;

			if (el.type === 'heading') {
				headings++;
				el.t = t;
				el.options.values = this.state.values;
				el.key = 'h-' + headings;
				el.content = getTranslatedLabel(t, {
					listKey, 
					prefix: 'heading', 
					content: _.camelCase(el.content),
				});
				elements = [ ...elements, React.createElement(FormHeading, el) ];
			} else if (el.type === 'field') {
				let field = this.props.list.fields[el.field];
				
				let props = this.getFieldProps(field);
				const filters = this.props.list.getRelatedFilter(field, props.filters, this.props, this.state);
				const { path } = field;

				props = this.checkFieldPermission(props);
				// No permission, no render
				if (!props) return;

				props = {
					...props,
					restrictDelegated: field.restrictDelegated,
					label: getTranslatedLabel(t, {
						listKey, 
						prefix: 'field', 
						content: _.camelCase(props.path),
						altContent: props.label,
					}),
				};

				if (filters) {
					props = {
						...props,
						filters,
					};
				}

				if (props.note) {
					props = {
						...props,
						note: getTranslatedLabel(t, {
							listKey, 
							prefix: 'note', 
							content: _.camelCase(props.path),
							altContent: props.note,
						}),
					};
				}
				// console.log(props.label);
				if (typeof Fields[field.type] !== 'function') {
					elements = [ ...elements, React.createElement(InvalidFieldType, { type: field.type, path, key: path }) ];
				}
				props.key = `${path}-${currentLang}`;
				if (index === 0 && this.state.focusFirstField) {
					props.autoFocus = true;
				}

				const element = React.createElement(Fields[field.type], props);
				// console.log(field.type, path, props);

				// prevent stateless file element to be rendered again, get from state
				if (field.stateless || field.cloneable) {
					const { localization } = Keystone;
					const self = this;
					let stateless = this.statelessUI[path];
					let allComponents = [];
					if (field.multilingual) {
						if (!stateless) {
							stateless = {};
							this.statelessUI[path] = {};
						}
						// console.log('>>> ', stateless);
						_.keys(localization).forEach(language => {
							// console.log(language);
							if (!stateless[language]) {
								stateless = React.cloneElement(
									element,
									{
										...props,
										key: `${path}-${language}`,
									}
								);
								self.statelessUI[path][language] = stateless;
							} else {
								stateless = React.cloneElement(
									stateless[language],
									props,
								);
							}
							allComponents = [
								...allComponents,
								(
									<div key={`${path}${language}`} style={{
										display: language === currentLang ? 'block' : 'none'
									}}>
										{ stateless }
									</div>
								)
							];
						});
					} else {
						if (!stateless) {
							self.statelessUI[path] = element;
						}
						allComponents = [
							(stateless || element),
						];
					}
					elements = [ 
						...elements,
						...allComponents,
					];
					// } else if (!stateless[currentLang]) {
					// 	elements = [ ...elements, element ];
					// }
				} else {
					elements = [ ...elements, element ];
				}
				
			}
		});

		return elements;
	},
	renderFooterBar () {
		if (this.props.list.noedit && this.props.list.nodelete) {
			return null;
		}
		const { t } = this.props;
		const { loading, values: { delegated } } = this.state;
		const loadingButtonText = loading ? t('saving') : t('save');
		// Padding must be applied inline so the FooterBar can determine its
		// innerHeight at runtime. Aphrodite's styling comes later...

		return (
			<FooterBar style={styles.footerbar}>
				<div style={styles.footerbarInner}>
					{!this.props.list.noedit && (
						<LoadingButton
							color="primary"
							disabled={loading}
							loading={loading}
							onClick={this.updateItem}
							data-button="update"
						>
							{loadingButtonText}
						</LoadingButton>
					)}
					{!this.props.list.noedit && (
						<Button disabled={loading} onClick={this.toggleResetDialog} variant="link" color="cancel" data-button="reset">
							<ResponsiveText
								hiddenXS={t('resetChanges')}
								visibleXS={t('resetChanges')}
							/>
						</Button>
					)}
					{!this.props.list.nodelete && !delegated && (
						<Button disabled={loading} onClick={this.toggleDeleteDialog} variant="link" color="delete" style={styles.deleteButton} data-button="delete">
							<ResponsiveText
								hiddenXS={`${t('deleteWithList', { listName: t(`table_${this.props.list.key}`) })}`}
								visibleXS={t('deleteWithList', { listName: t(`table_${this.props.list.key}`) })}
							/>
						</Button>
					)}
				</div>
			</FooterBar>
		);
	},
	renderTrackingMeta () {
		// TODO: These fields are visible now, so we don't want this. We may revisit
		// it when we have more granular control over hiding fields in certain
		// contexts, so I'm leaving this code here as a reference for now - JW
		if (true) return null; // if (true) prevents unreachable code linter errpr

		if (!this.props.list.tracking) return null;

		var elements = [];
		var data = {};
		const { t } = this.props;
		if (this.props.list.tracking.createdAt) {
			data.createdAt = this.props.data.fields[this.props.list.tracking.createdAt];
			if (data.createdAt) {
				elements.push(
					<FormField key="createdAt" label={t('createdOn')}>
						<FormInput noedit title={moment(data.createdAt).format('DD/MM/YYYY h:mm:ssa')}>{moment(data.createdAt).format('Do MMM YYYY')}</FormInput>
					</FormField>
				);
			}
		}

		if (this.props.list.tracking.createdBy) {
			data.createdBy = this.props.data.fields[this.props.list.tracking.createdBy];
			if (data.createdBy && data.createdBy.name) {
				let createdByName = getNameFromData(data.createdBy.name);
				if (createdByName) {
					elements.push(
						<FormField key="createdBy" label={t('createdBy')}>
							<FormInput noedit>{data.createdBy.name.first} {data.createdBy.name.last}</FormInput>
						</FormField>
					);
				}
			}
		}

		if (this.props.list.tracking.updatedAt) {
			data.updatedAt = this.props.data.fields[this.props.list.tracking.updatedAt];
			if (data.updatedAt && (!data.createdAt || data.createdAt !== data.updatedAt)) {
				elements.push(
					<FormField key="updatedAt" label={t('updatedOn')}>
						<FormInput noedit title={moment(data.updatedAt).format('DD/MM/YYYY h:mm:ssa')}>{moment(data.updatedAt).format('Do MMM YYYY')}</FormInput>
					</FormField>
				);
			}
		}

		if (this.props.list.tracking.updatedBy) {
			data.updatedBy = this.props.data.fields[this.props.list.tracking.updatedBy];
			if (data.updatedBy && data.updatedBy.name) {
				let updatedByName = getNameFromData(data.updatedBy.name);
				if (updatedByName) {
					elements.push(
						<FormField key="updatedBy" label={t('updatedOn')}>
							<FormInput noedit>{data.updatedBy.name.first} {data.updatedBy.name.last}</FormInput>
						</FormField>
					);
				}
			}
		}

		return Object.keys(elements).length ? (
			<div className="EditForm__meta">
				<h3 className="form-heading">{t('metaTitle')}</h3>
				{elements}
			</div>
		) : null;
	},
	renderWarning () {
		const { values: { delegated } } = this.state;
		if (delegated) {
			const { list: { key }, t } = this.props;
			return (
				<Alert color="warning">
					{t('delegatedMsg', { key })}
				</Alert>
			);
		}
	},
	render () {
		const { t } = this.props;
		return (
			<form ref="editForm" className="EditForm-container">
				{(this.state.alerts) ? <AlertMessages
					alerts={this.state.alerts}
					t={t}
					list={this.props.list} /> : null}
				<Grid.Row>
					<Grid.Col large="three-quarters">
						<Form layout="horizontal" component="div">
							{this.renderNameField()}
							{this.renderWarning()}
							{/* this.renderKeyOrId() */}
							{this.renderFormElements()}
						</Form>
					</Grid.Col>
					<Grid.Col large="one-quarter">
						{this.renderTrackingMeta()}
					</Grid.Col>
				</Grid.Row>
				{this.renderFooterBar()}
				<ConfirmationDialog
					confirmationLabel={t('reset')}
					isOpen={this.state.resetDialogIsOpen}
					onCancel={this.toggleResetDialog}
					onConfirmation={this.handleReset}
				>
					<p>{t('resetTo')} <strong>{this.props.data.name}</strong>?</p>
				</ConfirmationDialog>
				<ConfirmationDialog
					confirmationLabel={t('delete')}
					isOpen={this.state.deleteDialogIsOpen}
					onCancel={this.toggleDeleteDialog}
					onConfirmation={this.handleDelete}
				>
					{t('deleteAskMsg')} <strong>{this.props.data.name}?</strong>?
					<br />
					<br />
					{t('cannotUndo')}
				</ConfirmationDialog>
			</form>
		);
	},
});

const styles = {
	footerbar: {
		backgroundColor: fade(theme.color.body, 93),
		boxShadow: '0 -2px 0 rgba(0, 0, 0, 0.1)',
		paddingBottom: 20,
		paddingTop: 20,
		zIndex: 99,
	},
	footerbarInner: {
		height: theme.component.height, // FIXME aphrodite bug
	},
	deleteButton: {
		float: 'right',
	},
};

export default translate(['form', 'message'])(EditForm);
// module.exports = EditForm;
