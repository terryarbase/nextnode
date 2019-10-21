/**
 * Renders a confirmation dialog modal
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from '../elemental';
import { translate } from "react-i18next";

function ConfirmationDialog ({
	cancelLabel,
	children,
	confirmationLabel,
	confirmationType,
	html,
	isOpen,
	onCancel,
	t,
	onConfirmation,
	...props
}) {
	// Property Violation
	if (children && html) {
		console.error('Warning: FormNote cannot render `children` and `html`. You must provide one or the other.');
	}

	return (
		<Modal.Dialog
			backdropClosesModal
			isOpen={isOpen}
			onClose={onCancel}
			width={400}
		>
			{html ? (
				<Modal.Body {...props} dangerouslySetInnerHTML={{ __html: html }} />
			) : (
				<Modal.Body {...props}>{children}</Modal.Body>
			)}
			<Modal.Footer>
				<Button autoFocus size="small" data-button-type="confirm" color={confirmationType} onClick={onConfirmation}>
					{confirmationLabel || t('confirm')}
				</Button>
				<Button size="small" data-button-type="cancel" variant="link" color="cancel" onClick={onCancel}>
					{cancelLabel || t('cancel')}
				</Button>
			</Modal.Footer>
		</Modal.Dialog>
	);
};
ConfirmationDialog.propTypes = {
	body: PropTypes.string,
	cancelLabel: PropTypes.string,
	confirmationLabel: PropTypes.string,
	confirmationType: PropTypes.oneOf(['danger', 'primary', 'success', 'warning']),
	onCancel: PropTypes.func,
	onConfirmation: PropTypes.func,
};
ConfirmationDialog.defaultProps = {
	cancelLabel: null,
	confirmationLabel: null,
	confirmationType: 'danger',
	isOpen: false,
};

export default translate('form')(ConfirmationDialog);
