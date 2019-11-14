/*
TODO: CloudinaryImageType actally supports 'remove' and 'reset' actions, but
this field will only submit `""` when 'remove' is clicked. @jossmac we need to
work out whether we're going to support deleting through the UI.
*/

import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
// import {
// 	Button,
// } from '@material-ui/core';
import Lightbox from 'react-images';
import {
	Fab,
	Grid,
} from '@material-ui/core';
import {
	Attachment as AttachmentIcon,
	Delete as DeleteIcon,
	ClearAll as ClearAllIcon,
	GetApp as GetAppIcon,
} from '@material-ui/icons';

import Field from '../Field';
import cloudinaryResize from './../../../../utils/v1/cloudinaryResize';
import downloadImage from './../../../../utils/v1/downloadImage';
import { FormField, FormInput } from '../../elemental';

import ImageThumbnail from '../../components/ImageThumbnail';
import FileChangeMessage from '../../components/FileChangeMessage';
import HiddenFileInput from '../../components/HiddenFileInput';

// locales
import i18n from '../../../../i18n';

const SUPPORTED_TYPES = ['image/*'];
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
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.shape({
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
		]),
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
		const {
			value,
		} = this.props;
		const {
			value: nextValue,
		} = nextProps;
	// 	// Reset the action state when the value changes
	// 	// TODO: We should add a check for a new item ID in the store
	// 	// if (this.props.value.public_id !== nextProps.value.public_id) {
		if ((value && !nextValue) || (
				_.get(value, 'public_id') !== _.get(nextValue, 'public_id')
			)) {
			const state = buildInitialState(nextProps);
			this.setState(state);
		}
	},

	// ==============================
	// HELPERS
	// ==============================

	hasLocal () {
		return !!this.props.userSelectedFile;
	},
	hasExisting () {
		return !!(this.props.value && this.props.value.url);
	},
	hasImage () {
		return this.hasExisting() || this.hasLocal();
	},
	getFilename () {
		const { format, height, public_id, width } = this.props.value;

		return this.props.userSelectedFile
			? this.props.userSelectedFile.name
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
	// handleFileChange (event) {
	// 	const userSelectedFile = event.target.files[0];

	// 	if (!!userSelectedFile) {
	// 		const {
	// 			uploadFieldPath,
	// 		} = this.state;
	// 		const payload = {
	// 			path: this.props.path,
	// 			value: `upload:${uploadFieldPath}`,
	// 			attachment: {
	// 				[uploadFieldPath]: userSelectedFile,
	// 			},
	// 		};
	// 		this.props.onChange(payload);
	// 	}
	// },

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
		if (!window.FileReader) {
			return alert(i18n.t('list.fileReaderNotSupport'));
		}

		var reader = new FileReader();
		var file = e.target.files[0];
		if (!file) return;

		if (!file.type.match(SUPPORTED_REGEX)) {
			return alert(i18n.t('list.fileFormatNotSupport'));
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
				// userSelectedFile: file,
			});
			const {
				uploadFieldPath,
			} = this.state;
			const payload = {
				path: this.props.path,
				value: `upload:${uploadFieldPath}`,
				attachment: {
					[uploadFieldPath]: file,
				},
			};
			this.props.onChange(payload);
		};
	},

	// If we have a local file added then remove it and reset the file field.
	handleRemove (e) {
		var state = {};

		// if (this.props.userSelectedFile) {
		// 	state.userSelectedFile = null;
		// } else 
		if (this.hasExisting()) {
			state.removeExisting = true;
		}

		this.setState(state);
		const {
			uploadFieldPath,
		} = this.state;
		this.props.onChange({
			path: this.props.path,
			value: '',
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
			value: `upload:${uploadFieldPath}`,
			attachment: {
				// remove the target file blob
				[uploadFieldPath]: userSelectedFile,
			},
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
				key={this.state.uploadFieldPath}
				href={this.getImageSource({ height: 600 })}
				onClick={shouldOpenLightbox && this.openLightbox}
				mask={mask}
				target="__blank"
				style={{ float: 'left', marginRight: '1em' }}
			>
				<img
					src={this.getImageSource()}
					alt={mask}
					style={{
						maxHeight: '120px',
    					maxWidth: '300px',
					}}
				/>
			</ImageThumbnail>
		);
	},
	renderFileNameAndOptionalMessage() {
	// (showChangeMessage = false) {
		if (this.hasImage()) {
			return (
				<FileChangeMessage>
					{this.getFilename()}
				</FileChangeMessage>
			);
		}
		return null;
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
	// 				{i18n.t('list.saveToDelete')}
	// 			</FileChangeMessage>
	// 		);
	// 	} else {
	// 		return null;
	// 	}
	// },

	// Output [cancel/remove/undo] button
	renderClearButton () {
		const clearText = this.hasLocal() ? i18n.t('list.cancel') : i18n.t('list.removeImage');
		
		return (
			<span style={{marginRight: '10px'}}>
				{
					this.state.removeExisting ? (
						<Fab color="secondary" variant="extended"
							aria-label={i18n.t('list.undoRemove')}
							onClick={this.undoRemove}
						>
							<DeleteIcon />
							{i18n.t('list.undoRemove')}
						</Fab>
					) : (
						<Fab color="secondary" variant="extended" aria-label={clearText} onClick={this.handleRemove}>
							<ClearAllIcon />
							{clearText}
						</Fab>
					)
				}
			</span>
		);
	},

	renderImageToolbar () {
		const downloadText = i18n.t('list.downloadImage');
		const updateText = this.hasImage() ? i18n.t('list.change') : (
			_.includes(['zhtw', 'zhcn'], i18n.locale) ? `${i18n.t('list.uploadTo')}${i18n.t('list.image')}` : `${i18n.t('list.upload')} ${i18n.t('list.image')}` 
		);
		// const filename = `${signature}.${format}`;
		return (
			<div key={this.props.path + '_toolbar'} className="image-toolbar">
				<span style={{marginRight: '10px'}}>
					<Fab color="primary" variant="extended" aria-label={updateText} onClick={this.triggerFileBrowser}>
						<AttachmentIcon />
						{updateText}
					</Fab>
				</span>
				{this.hasImage() ? this.renderClearButton() : null}
				{
					this.hasExisting() &&
					<Fab
						color="secondary"
						variant="extended"
						aria-label={downloadText}
						onClick={() => {
							const { value: { signature, format, secure_url } } = this.props;
							downloadImage(secure_url, `${signature}.${format}`);
						}}
					>
						<GetAppIcon />
						{downloadText}
					</Fab>
				}
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
		const toolbar = this.shouldRenderField()
			? this.renderImageToolbar()
			: <FormInput noedit />;

		return (
			<FormField label={label} className="field-type-cloudinaryimage" htmlFor={path} note={note}>
				<Grid container
		          direction="row"
		          justify="flex-start"
		          alignItems="center"
		        >
		          	{
		          		this.hasImage() && <Grid item xs={5}>
			            	{this.renderImagePreview()}
			          	</Grid>
			      	}
		          	<Grid item>
		          		{
		          			this.hasImage() && this.renderFileNameAndOptionalMessage(this.shouldRenderField())
		          		}
						{toolbar}
						{this.renderLightbox()}
						{this.renderFileInput()}
						{this.renderActionInput()}
					</Grid>
				</Grid>
			</FormField>
		);
	},
});
