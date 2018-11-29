/*
** The global Account Setting, displays a popover modal to modify the password
** Honor Cheung @ 28/11/2018
*/

import React from 'react';
import assign from 'object-assign';
import _ from 'lodash';
import { Fields } from 'FieldTypes';
import xhr from 'xhr';
import AlertMessages from '../../shared/AlertMessages';
import { Button, Form, Modal } from '../../elemental';
import { translate } from "react-i18next";

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
		this.closeModal();
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
					{Object.entries(Keystone.localization).map((lang, index) => {
						return (
							<div key={index}>
								<Button key={lang[0]} onClick={() => this.handleOnClick(lang[0])}>
									<img
										src={`data:image/png;base64,${lang[1].icon}`} 
										alt={lang[1].label}
										style={{
											width: `30px`,
											marginRight: `10px`
										}}
									/>
									{lang[1].label}
								</Button>
							</div>
						);
					})}
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
