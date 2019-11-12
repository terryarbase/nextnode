/**
TODO:
- Format size of stored file (if present) using bytes package?
- Display file type icon? (see LocalFileField)
*/
import PropTypes from 'prop-types';
import Field from '../Field';
import React from 'react';
import _ from 'lodash';
import {
	// Button,
	FormField,
	FormInput,
	// FormNote,
} from '../../elemental';
import {
	Fab,
} from '@material-ui/core';
import {
	Attachment as AttachmentIcon,
	Delete as DeleteIcon,
	ClearAll as ClearAllIcon,
} from '@material-ui/icons';
import FileChangeMessage from '../../components/FileChangeMessage';
import HiddenFileInput from '../../components/HiddenFileInput';
import ImageThumbnail from '../../components/ImageThumbnail';

// locales
import i18n from '../../../../i18n';

let uploadInc = 1000;

const buildInitialState = (props, forceInit) => ({
	action: props.value === 'reset' ? props.value : null,
	removeExisting: false,
	uploadFieldPath: `File-${props.path}-${++uploadInc}`,
	// userSelectedFile: null,
		// ((typeof props.value === 'object') ? null : props.value),
		// prevent update model with uploaded object info 
});

export default Field.create({
	propTypes: {
		autoCleanup: PropTypes.bool,
		collapse: PropTypes.bool,
		label: PropTypes.string,
		note: PropTypes.string,
		path: PropTypes.string.isRequired,
		// value: PropTypes.shape({
		// 	// filename: PropTypes.string,
		// 	// TODO: these are present but not used in the UI,
		// 	//       should we start using them?
		// 	// filetype: PropTypes.string,
		// 	// originalname: PropTypes.string,
		// 	// path: PropTypes.string,
		// 	// size: PropTypes.number,
		// }),
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
		// console.log('old: ', this.props.value);
		// console.log('new: ', nextProps.value);
		// if ((this.props.value && !nextProps.value) || 
		// 	this.props.value.filename !== nextProps.value.filename ||
		// 	this.props.value.name !== nextProps.value.name) {
		// 	const state = buildInitialState(nextProps);
		// 	this.setState(state);
		// }

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
		return this.hasExisting() || !!this.props.userSelectedFile;
	},
	hasExisting () {
		// console.log('hasFile ', this.props.value);
		return this.props.value && !!this.props.value.filename;
	},
	getFilename () {
		// console.log(this.state.userSelectedFile);
		return this.props.userSelectedFile
			? this.props.userSelectedFile.name
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
		// this.setState({
		// 	userSelectedFile,
		// });
		// let payload = {
		// 	path: this.props.path,
		// 	value: null,
		// 	attachment: {
		// 		[uploadFieldPath]: null,
		// 	},
		// };
		// console.log(uploadFieldPath);
		if (!!userSelectedFile) {
			const {
				uploadFieldPath,
			} = this.state;
			const payload = {
				path: this.props.path,
				value: `upload:${uploadFieldPath}`,
				attachment: {
					[uploadFieldPath]: userSelectedFile,
				},
			};
			this.props.onChange(payload);
		}
	},
	handleRemove (e) {
		var state = {};
		let action = '';
		const {
			uploadFieldPath,
		} = this.state;
		if (this.props.userSelectedFile) {
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
			attachment: {
				// remove the target file blob
				[uploadFieldPath]: undefined,
			},
		});
	},
	undoRemove () {
		const rollbackState = buildInitialState(this.props);
		const {
			userSelectedFile,
			uploadFieldPath,
			path,
			onChange,
		} = this.props;
		this.setState(rollbackState);
		onChange({
			path,
			value: userSelectedFile ? `upload:${uploadFieldPath}` : null,
		});
	},

	// ==============================
	// RENDERERS
	// ==============================

	renderFileNameAndChangeMessage () {
		const href = this.props.value ? this.props.value.url : undefined;
		return this.hasFile() && !this.state.removeExisting && ( 
			<FileChangeMessage href={href} target="_blank">
				{this.getFilename()}
			</FileChangeMessage>
		);
	},
	// renderChangeMessage () {
	// 	if (this.props.userSelectedFile) {
	// 		return (
	// 			<FileChangeMessage color="success">
	// 				{i18n.t('list.saveToUpload')}
	// 			</FileChangeMessage>
	// 		);
	// 	} else if (this.state.removeExisting) {
	// 		return (
	// 			<FileChangeMessage color="danger">
	// 				{
	// 					this.props.autoCleanup ? 
	// 					`${i18n.t('list.deleteFile')} - ${i18n.t('list.saveToConfirm')}` : 
	// 					`${i18n.t('list.removeFile')} - ${i18n.t('list.saveToConfirm')}`
	// 				}
	// 			</FileChangeMessage>
	// 		);
	// 	} else {
	// 		return null;
	// 	}
	// },
	renderClearButton () {
		if (this.state.removeExisting) {
			return (
				<Fab color="secondary" variant="extended"
					aria-label={i18n.t('list.undoRemove')}
					onClick={this.undoRemove}
				>
					<DeleteIcon />
					{i18n.t('list.undoRemove')}
				</Fab>
			);
		} else {
			var clearText;
			if (this.props.userSelectedFile) {
				clearText = i18n.t('list.cancelUpload');
			} else {
				clearText = (this.props.autoCleanup ? i18n.t('list.deleteFile') : i18n.t('list.removeFile'));
			}
			return (
				<Fab color="secondary" variant="extended" aria-label={clearText} onClick={this.handleRemove}>
					<ClearAllIcon />
					{clearText}
				</Fab>
			);
		}
	},
	renderActionInput () {
		// If the user has selected a file for uploading, we need to point at
		// the upload field. If the file is being deleted, we submit that.
		if (this.props.userSelectedFile || this.state.action) {
			const value = this.props.userSelectedFile
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
		const mimeType = _.get(this, 'props.value.mimetype', '');
		return _.includes(imageMimeType, mimeType);
		// for(var i = 0; i < imageMimeType.length; i++){
		// 	if(this.props.value && this.props.value.mimetype === imageMimeType[i]){
		// 		return true;
		// 	}
		// }
		// return false;
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
				<img src={imageSrc} alt={imageSrc}
				style={{ height: 'auto', maxWidth: '100%', maxHeight: '90px' }} />
			</ImageThumbnail>
		);
	},
	renderUI () {
		const { note, path, required, userSelectedFile } = this.props;
		const label = this.props.label ? `${this.props.label}${required ? ' *' : ''}` : null;
		const text = this.hasFile() ? i18n.t('list.change') : i18n.t('list.upload');
		const buttons = (
			<React.Fragment>
				<span style={{marginRight: '10px'}}>
					<Fab
						variant="extended"
						onClick={this.triggerFileBrowser}
						color="primary"
						aria-label={text}
					>
				        <AttachmentIcon />
				        {text}
				    </Fab>
			    </span>
				{this.hasFile() && this.renderClearButton()}
			</React.Fragment>
		);
		return (
			<FormField label={label} htmlFor={path} note={note}>
				{this.shouldRenderField() ? (
					<React.Fragment>
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
					</React.Fragment>
				) : (
					<React.Fragment>
						{this.hasFile()
							? this.renderFileNameAndChangeMessage()
							: <FormInput noedit>{i18n.t('list.noFile')}</FormInput>}
					</React.Fragment>
				)}
			</FormField>
		);
	},

});
