// import PropTypes from 'prop-types';
import Field from '../Field';
import React from 'react';
// import { Editor } from '@tinymce/tinymce-react';
import Editor from 'react-tinymce';
// import tinymce from 'tinymce';
import { FormInput, FormField } from '../../elemental';

export default Field.create({

	displayName: 'HtmlField',
	statics: {
		type: 'Html',
	},

	valueChanged ({ target }) {
		// const content;
		// if (this.editor) {
		// 	content = this.editor.getContent();
		// } else {
		// 	content = event.target.value;
		// }

		// this._currentValue = content;
		this.props.onChange({
			path: this.props.path,
			value: target.getContent(),
		});
	},

	getOptions () {
		const {
			uploadPath,
		} = this.props;
		const plugins = ['code', 'link'];
		const options = Object.assign(
				{},
				this.props.wysiwygOptions,
				this.props.wysiwyg
			);
		let toolbar = options.overrideToolbar ? '' : 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | removeformat | link ';
		let i;

		if (options.enableImages) {
			plugins.push('image');
			toolbar += ' | image';
		}

		if (options.enableCloudinaryUploads || options.enableS3Uploads) {
			plugins.push('uploadimage');
			toolbar += options.enableImages ? ' uploadimage' : ' | uploadimage';
		}

		if (options.additionalButtons) {
			const additionalButtons = options.additionalButtons.split(',');
			for (i = 0; i < additionalButtons.length; i++) {
				toolbar += (' | ' + additionalButtons[i]);
			}
		}
		if (options.additionalPlugins) {
			const additionalPlugins = options.additionalPlugins.split(',');
			for (i = 0; i < additionalPlugins.length; i++) {
				plugins.push(additionalPlugins[i]);
			}
		}
		if (options.importcss) {
			plugins.push('importcss');
			const importcssOptions = {
				content_css: options.importcss,
				importcss_append: true,
				importcss_merge_classes: true,
			};

			Object.assign(options.additionalOptions, importcssOptions);
		}

		if (!options.overrideToolbar) {
			toolbar += ' | code';
		}

		const opts = {
			toolbar: toolbar,
			plugins: plugins,
			menubar: options.menubar || false,
			// skin: options.skin || 'keystone',
		};

		if (this.shouldRenderField()) {
			opts.uploadimage_form_url = options.enableS3Uploads ? uploadPath + '/s3/upload' : uploadPath + '/cloudinary/upload';
		} else {
			Object.assign(opts, {
				mode: 'textareas',
				readonly: true,
				menubar: false,
				toolbar: 'code',
				statusbar: false,
			});
		}

		if (options.additionalOptions) {
			Object.assign(opts, options.additionalOptions);
		}

		return opts;
	},

	renderField () {
		// const className = this.state.isFocused ? 'is-focused' : '';
		// const style = {
		// 	height: this.props.height,
		// };
		const {
			path,
			value,
			// label,
		} = this.props;
		// const name = this.getInputName(path);
		// console.log(value);
		return (
			<Editor
				content={value}
				onChange={this.valueChanged}
				config={this.getOptions()}
			/>
		);
	},

	renderValue () {
		return (
			<FormInput multiline noedit>
				{this.props.value}
			</FormInput>
		);
	},

	renderUI() {
		return this.renderWithErrorUI();
	},

});
