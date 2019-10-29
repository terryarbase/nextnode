/*
TODO: CloudinaryImageType actally supports 'remove' and 'reset' actions, but
this field will only submit `""` when 'remove' is clicked. @jossmac we need to
work out whether we're going to support deleting through the UI.
*/

import React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
} from '@material-ui/core';
import Lightbox from 'react-images';

import Field from '../Field';
import cloudinaryResize from './../../../../utils/v1/cloudinaryResize';
import downloadImage from './../../../../utils/v1/downloadImage';
import { FormField, FormInput, FormNote } from '../../elemental';

import ImageThumbnail from '../../components/ImageThumbnail';
import FileChangeMessage from '../../components/FileChangeMessage';
import HiddenFileInput from '../../components/HiddenFileInput';

// locales
import i18n from '../../../../i18n';

const SUPPORTED_TYPES = ['image/*', 'application/pdf', 'application/postscript'];
const SUPPORTED_REGEX = new RegExp(/^image\/|application\/pdf|application\/postscript/g);

let uploadInc = 1000;

const buildInitialState = (props) => ({
	removeExisting: false,
	uploadFieldPath: `CloudinaryImage-${props.path}-${++uploadInc}`,
	userSelectedFile: null,
});

export default Field.create({
	propTypes: {
		collapse: PropTypes.bool,
		label: PropTypes.string,
		note: PropTypes.string,
		path: PropTypes.string.isRequired,
		value: PropTypes.shape({
			format: PropTypes.string,
			height: PropTypes.number,
			public_id: PropTypes.string,
			resource_type: PropTypes.string,
			secure_url: PropTypes.string,
			signature: PropTypes.string,
			url: PropTypes.string,
			version: PropTypes.number,
			width: PropTypes.number,
		}),
	},
	displayName: 'CloudinaryImageField',
	statics: {
		type: 'CloudinaryImage',
		getDefaultValue: () => ({}),
	},
	getInitialState () {
		return buildInitialState(this.props);
	},
	componentWillReceiveProps (nextProps) {
		// console.log('CloudinaryImageField nextProps:', nextProps);
	},
	componentWillUpdate (nextProps) {
		// Reset the action state when the value changes
		// TODO: We should add a check for a new item ID in the store
		// if (this.props.value.public_id !== nextProps.value.public_id) {
			if ((this.props.value && !nextProps.value) || 
				(this.props.value && nextProps.value && this.props.value.public_id !== nextProps.value.public_id)) {
			this.setState({
				removeExisting: false,
				userSelectedFile: null,
			});
		}
	},

	// ==============================
	// HELPERS
	// ==============================

	hasLocal () {
		return !!this.state.userSelectedFile;
	},
	hasExisting () {
		return !!(this.props.value && this.props.value.url);
	},
	hasImage () {
		return this.hasExisting() || this.hasLocal();
	},
	getFilename () {
		const { format, height, public_id, width } = this.props.value;

		return this.state.userSelectedFile
			? this.state.userSelectedFile.name
			: `${public_id}.${format} (${width}×${height})`;
	},
	getImageSource (options = {}) {
		const { height = 90, resizable = true } = options;
		// TODO: This lets really wide images break the layout
		let src;
		if (this.hasLocal()) {
			src = this.state.dataUri;
		} else if (this.hasExisting()) {
			if (resizable) {
				const {
					cloudinary,
				} = this.props;
				src = cloudinaryResize(cloudinary.cloud_name, this.props.value.public_id, {
					crop: 'fit',
					height: height,
					format: 'jpg',
					secure: this.props.secure,
				});
			} else {
				src = this.props.value.secure_url;
			}
		}

		return src;
	},

	// ==============================
	// METHODS
	// ==============================

	triggerFileBrowser () {
		this.refs.fileInput.clickDomNode();
	},
	handleFileChange (event) {
		const userSelectedFile = event.target.files[0];

		this.setState({ userSelectedFile });
		this.props.onChange({
			path: this.props.path,
			value: userSelectedFile ? `upload:${this.state.uploadFieldPath}` : null,
		});
	},

	// Toggle the lightbox
	openLightbox (event) {
		event.preventDefault();
		this.setState({
			lightboxIsVisible: true,
		});
	},
	closeLightbox () {
		this.setState({
			lightboxIsVisible: false,
		});
	},

	// Handle image selection in file browser
	handleImageChange (e) {
		const { t } = this.props;
		if (!window.FileReader) {
			return alert(t('fileReaderNotSupport'));
		}

		var reader = new FileReader();
		var file = e.target.files[0];
		if (!file) return;

		if (!file.type.match(SUPPORTED_REGEX)) {
			return alert(t('fileFormatNotSupport'));
		}

		reader.readAsDataURL(file);

		reader.onloadstart = () => {
			this.setState({
				loading: true,
			});
		};
		reader.onloadend = (upload) => {
			this.setState({
				dataUri: upload.target.result,
				loading: false,
				userSelectedFile: file,
			});
			this.props.onChange({
				file: file,
				path: this.props.path, 
				value: this.state.userSelectedFile ? `upload:${this.state.uploadFieldPath}` : null,
			});
		};
	},

	// If we have a local file added then remove it and reset the file field.
	handleRemove (e) {
		var state = {};

		if (this.state.userSelectedFile) {
			state.userSelectedFile = null;
		} else if (this.hasExisting()) {
			state.removeExisting = true;
		}

		this.setState(state);
		this.props.onChange({
			path: this.props.path,
			value: '',
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

	renderLightbox () {
		const { value } = this.props;

		if (!value || !value.public_id) return;

		return (
			<Lightbox
				currentImage={0}
				images={[{ src: this.getImageSource({ height: 600 }) }]}
				isOpen={this.state.lightboxIsVisible}
				onClose={this.closeLightbox}
				showImageCount={false}
			/>
		);
	},
	renderImagePreview () {
		const { value } = this.props;

		// render icon feedback for intent
		let mask;
		if (this.hasLocal()) mask = 'upload';
		else if (this.state.removeExisting) mask = 'remove';
		else if (this.state.loading) mask = 'loading';

		const shouldOpenLightbox = value.format !== 'pdf';

		return (
			<ImageThumbnail
				component="a"
				href={this.getImageSource({ height: 600 })}
				onClick={shouldOpenLightbox && this.openLightbox}
				mask={mask}
				target="__blank"
				style={{ float: 'left', marginRight: '1em' }}
			>
				<img src={this.getImageSource()} alt={mask} style={{ height: 90 }} />
			</ImageThumbnail>
		);
	},
	renderFileNameAndOptionalMessage (showChangeMessage = false) {
		return (
			<div>
				{this.hasImage() ? (
					<FileChangeMessage>
						{this.getFilename()}
					</FileChangeMessage>
				) : null}
				{showChangeMessage && this.renderChangeMessage()}
			</div>
		);
	},
	renderChangeMessage () {
		if (this.state.userSelectedFile) {
			return (
				<FileChangeMessage color="success">
					{i18n.t('list.saveToUpload')}
				</FileChangeMessage>
			);
		} else if (this.state.removeExisting) {
			return (
				<FileChangeMessage color="danger">
					{i18n.t('list.saveToDelete')}
				</FileChangeMessage>
			);
		} else {
			return null;
		}
	},

	// Output [cancel/remove/undo] button
	renderClearButton () {
		const clearText = this.hasLocal() ? i18n.t('list.cancel') : i18n.t('list.removeImage');
		
		return this.state.removeExisting ? (
			<Button onClick={this.undoRemove}>
				{i18n.t('list.undoRemove')}
			</Button>
		) : (
			<Button color="cancel" onClick={this.handleRemove}>
				{clearText}
			</Button>
		);
	},

	renderImageToolbar () {
		// const filename = `${signature}.${format}`;
		return (
			<div key={this.props.path + '_toolbar'} className="image-toolbar">
				{
					this.hasExisting() ? 
					<Button onClick={() => {
						const { value: { signature, format, secure_url } } = this.props;
						downloadImage(secure_url, `${signature}.${format}`);
					}}>
						{i18n.t('list.downloadImage')}
					</Button> : null
					// <a 
					// 	href={`data:application/octet-stream, ${encodeURIComponent(this.getImageSource({ resizable: false }))}`}
					// 	target="_blank"
					// 	download={filename}
					// >
					// 	Original Image
					// </a> : null
				}
				<Button color="secondary" variant="contained" onClick={this.triggerFileBrowser}>
					{this.hasImage() ? i18n.t('list.changeTo') : i18n.t('list.uploadTo')} {i18n.t('list.image')}
				</Button>
				{this.hasImage() ? this.renderClearButton() : null}
			</div>
		);
	},

	renderFileInput () {
		if (!this.shouldRenderField()) return null;

		return (
			<HiddenFileInput
				accept={SUPPORTED_TYPES.join()}
				ref="fileInput"
				name={this.state.uploadFieldPath}
				onChange={this.handleImageChange}
			/>
		);
	},

	// This renders a hidden input that holds the payload data for how the field
	// should be updated. It should be upload:{filename}, undefined, or 'remove'
	renderActionInput () {
		if (!this.shouldRenderField()) return null;

		if (this.state.userSelectedFile || this.state.removeExisting) {
			let value = '';
			if (this.state.userSelectedFile) {
				value = `upload:${this.state.uploadFieldPath}`;
			} else if (this.state.removeExisting && this.props.autoCleanup) {
				value = 'delete';
			}
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

	renderUI () {
		const { label, note, path } = this.props;

		const imageContainer = (
			<div style={this.hasImage() ? { marginBottom: '1em' } : null}>
				{this.hasImage() && this.renderImagePreview()}
				{this.hasImage() && this.renderFileNameAndOptionalMessage(this.shouldRenderField())}
			</div>
		);

		const toolbar = this.shouldRenderField()
			? this.renderImageToolbar()
			: <FormInput noedit />;

		return (
			<FormField label={label} className="field-type-cloudinaryimage" htmlFor={path}>
				{imageContainer}
				{toolbar}
				{!!note && <FormNote html={note} />}
				{this.renderLightbox()}
				{this.renderFileInput()}
				{this.renderActionInput()}
			</FormField>
		);
	},
});
