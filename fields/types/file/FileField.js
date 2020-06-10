/**
TODO:
- Format size of stored file (if present) using bytes package?
- Display file type icon? (see LocalFileField)
*/

import Field from '../Field';
import React, { PropTypes } from 'react';
import {
	Button,
	FormField,
	FormInput,
	FormNote,
} from '../../../admin/client/App/elemental';
import FileChangeMessage from '../../components/FileChangeMessage';
import HiddenFileInput from '../../components/HiddenFileInput';
import ImageThumbnail from '../../components/ImageThumbnail';
import _ from 'lodash';

let uploadInc = 1000;

const buildInitialState = (props, forceInit) => ({
	action: props.value === 'reset' ? props.value : null,
	removeExisting: false,
	uploadFieldPath: `File-${props.path}-${++uploadInc}`,
	userSelectedFile: null,
		// ((typeof props.value === 'object') ? null : props.value),
		// prevent update model with uploaded object info 
});

module.exports = Field.create({
	propTypes: {
		autoCleanup: PropTypes.bool,
		collapse: PropTypes.bool,
		label: PropTypes.string,
		note: PropTypes.string,
		path: PropTypes.string.isRequired,
		value: PropTypes.shape({
			filename: PropTypes.string,
			// TODO: these are present but not used in the UI,
			//       should we start using them?
			// filetype: PropTypes.string,
			// originalname: PropTypes.string,
			// path: PropTypes.string,
			// size: PropTypes.number,
		}),
	},
	statics: {
		type: 'File',
		getDefaultValue: () => ({}),
	},
	getInitialState () {
		return buildInitialState(this.props);
	},
	shouldCollapse () {
		return this.props.collapse && !this.hasExisting();
	},
	componentWillUpdate (nextProps) {
		// Show the new filename when it's finished uploading
		// console.log('old: ', this.props);
		// console.log('new: ', nextProps);
		const curtValue = _.get(this.prop, 'value', {});
		const nextvalue = _.get(nextProps, 'value', {});
		// console.log('old: ', curtValue);
		// console.log('new: ', nextvalue);
		if ((curtValue && !nextvalue) || 
			curtValue.filename !== nextvalue.filename ||
			curtValue.name !== nextvalue.name) {
			const state = buildInitialState(nextProps);
			this.setState(state);
		} 

		// if ((this.props.value && !nextProps.value)) {
		// 	this.setState(buildInitialState(nextProps));
		// } else if (this.props.value.filename !== nextProps.value.filename) {
		// 	const state = buildInitialState(nextProps);
		// 	// console.log('>>>>>>', state);
		// 	this.setState(state);
		// }
	},

	// ==============================
	// HELPERS
	// ==============================

	hasFile () {
		return this.hasExisting() || !!this.state.userSelectedFile;
	},
	hasExisting () {
		// console.log('hasFile ', this.props.value);
		return this.props.value && !!this.props.value.filename;
	},
	getFilename () {
		// console.log(this.state.userSelectedFile);
		return this.state.userSelectedFile
			? this.state.userSelectedFile.name
			: this.props.value.filename;
	},

	// ==============================
	// METHODS
	// ==============================

	triggerFileBrowser () {
		this.refs.fileInput.clickDomNode();
	},
	handleFileChange (event) {
		const userSelectedFile = event.target.files[0];
		this.setState({
			userSelectedFile: userSelectedFile,
		});
		// console.log(userSelectedFile ? `upload:${this.state.uploadFieldPath}` : null);
		this.props.onChange({
			path: this.props.path,
			value: userSelectedFile ? `upload:${this.state.uploadFieldPath}` : null,
		});
	},
	handleRemove (e) {
		var state = {};
		let action = '';
		if (this.state.userSelectedFile) {
			state = buildInitialState(this.props, true);
		} else if (this.hasExisting()) {
			state.removeExisting = true;

			if (this.props.autoCleanup) {
				if (e.altKey) {
					state.action = action = 'reset';
				} else {
					state.action = 'delete';
				}
			} else {
				if (e.altKey) {
					state.action = 'delete';
				} else {
					state.action = action = 'reset';
				}
			}
		}
		this.setState(state);
		// handle callback to client UI onchange
		this.props.onChange({
			path: this.props.path,
			value: action,
		});
	},
	undoRemove () {
		const rollbackState = buildInitialState(this.props);
		this.setState(rollbackState);
		this.props.onChange({
			path: this.props.path,
			value: rollbackState.userSelectedFile ? `upload:${rollbackState.uploadFieldPath}` : null,
		});
	},

	// ==============================
	// RENDERERS
	// ==============================

	renderFileNameAndChangeMessage () {
		const href = this.props.value ? this.props.value.url : undefined;
		return (
			<div>
				{(this.hasFile() && !this.state.removeExisting) ? (
					<FileChangeMessage href={href} target="_blank">
						{this.getFilename()}
					</FileChangeMessage>
				) : null}
				{this.renderChangeMessage()}
			</div>
		);
	},
	renderChangeMessage () {
		const { t } = this.props;
		if (this.state.userSelectedFile) {
			return (
				<FileChangeMessage color="success">
					{t('saveToUpload')}
				</FileChangeMessage>
			);
		} else if (this.state.removeExisting) {
			return (
				<FileChangeMessage color="danger">
					File {this.props.autoCleanup ? 'deleted' : 'removed'} - save to confirm
				</FileChangeMessage>
			);
		} else {
			return null;
		}
	},
	renderClearButton () {
		const { t } = this.props;
		if (this.state.removeExisting) {
			return (
				<Button variant="link" onClick={this.undoRemove}>
					{t('undoRemove')}
				</Button>
			);
		} else {
			var clearText;
			if (this.state.userSelectedFile) {
				clearText = t('cancelUpload');
			} else {
				clearText = (this.props.autoCleanup ? t('deleteFile') : t('removeFile'));
			}
			return (
				<Button variant="link" color="cancel" onClick={this.handleRemove}>
					{clearText}
				</Button>
			);
		}
	},
	renderActionInput () {
		// If the user has selected a file for uploading, we need to point at
		// the upload field. If the file is being deleted, we submit that.
		if (this.state.userSelectedFile || this.state.action) {
			const value = this.state.userSelectedFile
				? `upload:${this.state.uploadFieldPath}`
				: (this.state.action === 'delete' || this.state.action === 'reset' ? 'remove' : '');
			return (
				<input
					name={this.getInputName(this.props.path)}
					type="hidden"
					value={value}
				/>
			);
		} else {
			return null;
		}
	},
	isImage () {
		const imageMimeType = [
			"image/png",
			"image/jpeg",
			"image/jpg",
			"image/gif",
		];
		for(var i = 0; i < imageMimeType.length; i++){
			if(this.props.value && this.props.value.mimetype === imageMimeType[i]){
				return true;
			}
		}
		return false;
	},
	renderImagePreview () {
		const { value: { publicPath, filename, url } } = this.props;
		const imageSrc = publicPath ? publicPath + filename : url;
		return (
			<ImageThumbnail
				component="a"
				href={imageSrc}
				target="__blank"
				style={{ float: 'left', marginRight: '1em' }}
			>
				<img src={imageSrc} style={{ height: 'auto', maxWidth: '100%', maxHeight: '90px' }} />
			</ImageThumbnail>
		);
	},
	renderUI () {
		const { note, path, t, required } = this.props;
		const label = this.props.label ? `${this.props.label}${required ? ' *' : ''}` : null;
		const buttons = (
			<div style={this.hasFile() ? { marginTop: '1em' } : null}>
				<Button onClick={this.triggerFileBrowser}>
					{this.hasFile() ? t('change') : t('upload')}
				</Button>
				{this.hasFile() && this.renderClearButton()}
			</div>
		);
		return (
			<div data-field-name={path} data-field-type="file">
				<FormField label={label} htmlFor={path}>
					{this.shouldRenderField() ? (
						<div>
							{this.hasFile() && this.isImage() && this.renderImagePreview()}
							{this.hasFile() && this.renderFileNameAndChangeMessage()}
							{buttons}
							<HiddenFileInput
								key={this.state.uploadFieldPath}
								name={this.state.uploadFieldPath}
								onChange={this.handleFileChange}
								ref="fileInput"
							/>
							{this.renderActionInput()}
						</div>
					) : (
						<div>
							{this.hasFile()
								? this.renderFileNameAndChangeMessage()
								: <FormInput noedit>no file</FormInput>}
						</div>
					)}
					{!!note && <FormNote html={note} />}
				</FormField>
			</div>
		);
	},

});
