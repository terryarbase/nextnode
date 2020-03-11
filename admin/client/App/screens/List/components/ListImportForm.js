import React, { PropTypes } from 'react';
import assign from 'object-assign';
import _ from 'lodash';
import { translate } from "react-i18next";
import Popout from '../../../shared/Popout';
import PopoutList from '../../../shared/Popout/PopoutList';
import ListHeaderButton from './ListHeaderButton';
import FileChangeMessage from '../../../../../../fields/components/FileChangeMessage';
import HiddenFileInput from '../../../../../../fields/components/HiddenFileInput';
import { LabelledControl, Form, FormField, SegmentedControl, Button } from '../../../elemental';

import { importItems } from '../actions';
import { getTranslatedLabel } from '../../../../utils/locale';

var ListImportForm = React.createClass({
	propTypes: {
		activeColumns: PropTypes.array,
		dispatch: PropTypes.func.isRequired,
		list: PropTypes.object,
		currentLang: PropTypes.string,
	},
	getInitialState () {
		return {
			isOpen: false,
			uploadFieldPath: `File-import-${this.props.path}`,
			importFile: null,
		};
	},
	togglePopout (visible) {
		this.setState({
			isOpen: visible,
		});
	},
	handleImportRequest () {
		this.props.dispatch(
			importItems(this.state.importFile)
		);
		this.togglePopout(false);
	},
	hasFile () {
		return !!this.state.importFile;
	},
	getFilename () {
		return this.state.importFile ? this.state.importFile.name : null
	},
	renderFileName () {
		return (
			<div>
				{this.hasFile() ? (
					<FileChangeMessage >
						{this.getFilename()}
					</FileChangeMessage>
				) : null}
			</div>
		);
	},
	handleFileChange (event) {
		const userSelectedFile = event.target.files[0];
		this.setState({
			importFile: userSelectedFile,
		});
	},
	triggerFileBrowser () {
		this.refs.fileInput.clickDomNode();
	},
	render () {
		const { t } = this.props;
		return (
			<div>
				<ListHeaderButton
					active={this.state.isOpen}
					id="listHeaderImportButton"
					glyph="cloud-download"
					label={t('label')}
					onClick={() => this.togglePopout(!this.state.isOpen)}
				/>
				<Popout isOpen={this.state.isOpen} onCancel={() => this.togglePopout(false)} relativeToID="listHeaderImportButton">
					<Popout.Header title={t('label')} />
					<Popout.Body scrollable>
						<Form layout="horizontal" labelWidth={100} component="div">
							<FormField label={t('fileUpload')}>
								{this.hasFile() && this.renderFileName()}
								<Button onClick={this.triggerFileBrowser}>
									{this.hasFile() ? t('change') : t('upload')}
								</Button>
								<HiddenFileInput
									key={this.state.uploadFieldPath}
									name={this.state.uploadFieldPath}
									onChange={this.handleFileChange}
									ref="fileInput"
									accept={'.csv'}
								/>
							</FormField>
						</Form>
					</Popout.Body>
					<Popout.Footer
						primaryButtonAction={this.handleImportRequest}
						primaryButtonLabel={t('label')}
						secondaryButtonAction={() => this.togglePopout(false)}
						secondaryButtonLabel={t('cancel')} />
				</Popout>
			</div>
		);
	},
});

export default translate('import')(ListImportForm);