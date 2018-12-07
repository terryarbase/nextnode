/*
** The global Account Setting, displays a popover modal to modify the password
** Honor Cheung @ 28/11/2018
*/

import React from 'react';
import assign from 'object-assign';
import _ from 'lodash';
import { Fields } from 'FieldTypes';
import xhr from 'xhr';
import { Button, Form, Modal } from '../../elemental';
import { translate } from "react-i18next";
import { setUILanguage, getUILanguage } from '../../../utils/cookie'
const schema = 'User';

var Setting = React.createClass({
	displayName: 'Localization',
	propTypes: {
		isOpen: React.PropTypes.bool.isRequired,
		onCancel: React.PropTypes.func,
	},
	getInitialState () {
		// Set the field values to their default values when first rendering the
		// form. (If they have a default value, that is)
		return {
		};
	},
	closeModal() {
		this.setState(this.getInitialState());
		this.props.onCancel();
	},
	handleOnClick (lang) {
		const { i18n } = this.props;
		i18n.changeLanguage(lang);
		setUILanguage(lang);
		this.closeModal();
	},
	renderButton () {
		const currentUILanguage = getUILanguage();
		return Object.entries(Keystone.localization).map((lang, index) => {
			return (
				<div key={lang[0]} style={{marginBottom: `5px`}}>
					{
						lang[0] === currentUILanguage ?
							<span>
								<img 
									src={`data:image/png;base64,${lang[1].icon}`}
									style={{
										width: `25px`,
										marginRight: `15px`,
										maxHeight: `30px`
									}}
								/>
								{lang[1].label}
							</span>
						:
							<a onClick={() => this.handleOnClick(lang[0])}>
								<img 
									src={`data:image/png;base64,${lang[1].icon}`}
									style={{
										width: `25px`,
										marginRight: `15px`,
										maxHeight: `30px`
									}}
								/>
								{lang[1].label}
							</a>
					}
				</div>
			);
		});
	},
	// Handle input change events
	renderForm () {
		const { t } = this.props;
		
		return (
			<div>
				<Modal.Header
					text={t('language')}
					showCloseButton
				/>
				<Modal.Body>
					{this.renderButton()}
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="link"
						color="cancel"
						data-button-type="cancel"
						onClick={this.closeModal}
					>
						{t('cancel')}
					</Button>
				</Modal.Footer>
			</div>
		);
	},
	render () {
		return (
			<Modal.Dialog
				isOpen={this.props.isOpen}
				onClose={this.closeModal}
				backdropClosesModal
			>
				{this.renderForm()}
			</Modal.Dialog>
		);
	},
});

export default translate('nav')(Setting);
// module.exports = Setting;
