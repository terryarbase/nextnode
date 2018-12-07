import React from 'react';
import _ from 'lodash';
import { translate } from "react-i18next";

import { Alert } from '../elemental';
import { upcase } from '../../utils/string';
import { getTranslatedLabel } from '../../utils/locale';
/**
 * This renders alerts for API success and error responses.
 *   Error format: {
 *     error: 'validation errors' // The unique error type identifier
 *     detail: { ... } // Optional details specific to that error type
 *   }
 *   Success format: {
 *     success: 'item updated', // The unique success type identifier
 *     details: { ... } // Optional details specific to that success type
 *   }
 *   Eventually success and error responses should be handled individually
 *   based on their type. For example: validation errors should be displayed next
 *   to each invalid field and signin errors should promt the user to sign in.
 */
var AlertMessages = React.createClass({
	displayName: 'AlertMessages',
	propTypes: {
		alerts: React.PropTypes.shape({
			error: React.PropTypes.Object,
			success: React.PropTypes.Object,
		}),
	},
	getDefaultProps () {
		return {
			localization: Keystone.localization,
			alerts: {},
		};
	},
	renderValidationErrors () {
		let errors = this.props.alerts.error.detail;
		const { t, list={}, localization } = this.props;
		if (errors.name === 'ValidationError') {
			errors = errors.errors;
		}
		let errorCount = Object.keys(errors).length;
		let alertContent;
		let messages = Object.keys(errors).map((path) => {
			const { [path]: { type, fieldType, error, lang } } = errors;
			const field = _.startCase(
				getTranslatedLabel(t, {
					listKey: list.key || '',
					content: path,
					prefix: 'field',
					namespace: 'form',
					altContent: 'error',
				})
			);
			const languageVerionPrefix =  localization && localization[lang] ? `${localization[lang].label} ` : '';
			if (errorCount > 1) {
				return (
					<li key={path}>
						{
							// upcase(errors[path].error || errors[path].message)
							`${languageVerionPrefix}${t(type, {
								field,
							})}`
						}
					</li>
				);
			} else {
				return (
					<div key={path}>
						{
							// upcase(errors[path].error || errors[path].message)
						}
						{
							// upcase(errors[path].error || errors[path].message)
							`${languageVerionPrefix}${t(type, {
								field: field,
							})}`
						}
					</div>
				);
			}
		});

		if (errorCount > 1) {
			alertContent = (
				<div>
					<h4>{t('message:validationTitle', { errorCount })}</h4>
					<ul>{messages}</ul>
				</div>
			);
		} else {
			alertContent = messages;
		}

		return <Alert color="danger">{alertContent}</Alert>;
	},
	render () {
		const { t } = this.props;
		let { error, success } = this.props.alerts;
		if (error) {
			// Render error alerts
			switch (_.toLower(error.error)) {
				case 'validation errors':
					return this.renderValidationErrors();
				case 'error':
					if (error.detail.name === 'ValidationError') {
						return this.renderValidationErrors();
					} else {
						return <Alert color="danger">{upcase(error.error)}</Alert>;
					}
				default:
					return <Alert color="danger">{t('message:operationError')}</Alert>;
			}
		}

		if (success) {
			// Render success alerts
			return <Alert color="success">{t('message:successSave')}</Alert>;
		}
		return null; // No alerts, render nothing
	},
});

module.exports = AlertMessages;
