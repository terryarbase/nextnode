import Field from '../Field';
import React from 'react';
import tinymce from 'tinymce';
import { FormInput } from '../../../admin/client/App/elemental';
import evalDependsOn from '../../utils/evalDependsOn';

/**
 * TODO:
 * - Remove dependency on underscore
 */

var lastId = 0;

function getId () {
	return 'keystone-html-' + lastId++;
}

// Workaround for #2834 found here https://github.com/tinymce/tinymce/issues/794#issuecomment-203701329
function removeTinyMCEInstance (editor) {
	var oldLength = tinymce.editors.length;
	tinymce.remove(editor);
	if (oldLength === tinymce.editors.length) {
		tinymce.editors.remove(editor);
	}
}

module.exports = Field.create({

	displayName: 'HtmlField',
	statics: {
		type: 'Html',
	},

	getInitialState () {
		const { value } = this.props;
		this._currentValue = value;
		return {
			id: getId(),
			isFocused: false,
			wysiwygActive: false,
			value,
		};
	},

	initWysiwyg () {
		if (!this.props.wysiwyg) return;

		var self = this;
		var opts = this.getOptions();

		opts.setup = function (editor) {
			self.editor = editor;
			editor.on('change', self.valueChanged);
			editor.on('focus', self.focusChanged.bind(self, true));
			editor.on('blur', self.focusChanged.bind(self, false));
		};
		// console.log('initWysiwyg: ', this.props.value);
		this._currentValue = this.props.value;
		// console.log('opts: ', opts);
		tinymce.init(opts);
		if (evalDependsOn(this.props.dependsOn, this.props.values)) {
			this.setState({ wysiwygActive: true });
		}
	},

	removeWysiwyg (state) {
		removeTinyMCEInstance(tinymce.get(state.id));
		this.setState({ wysiwygActive: false });
	},

	componentDidUpdate (prevProps, prevState) {
		if (prevState.isCollapsed && !this.state.isCollapsed) {
			this.initWysiwyg();
		}

		// if (this.editor && this._currentValue !== this.props.value) {
		// 	this.editor.setContent(this.props.value);
		// } else 
		if (this.props.wysiwyg) {
			if (evalDependsOn(this.props.dependsOn, this.props.values)) {
				if (!this.state.wysiwygActive) {
					this.initWysiwyg();
				}
			} else if (this.state.wysiwygActive) {
				this.removeWysiwyg(prevState);
			}
		}
		// console.log(prevProps.value, ">>>>>>>", this.props.value);
	},

	componentDidMount () {
		this.initWysiwyg();
	},

	componentWillReceiveProps (nextProps) {
		if (this.editor && this._currentValue !== nextProps.value) {
			this.editor.setContent(nextProps.value);
		}
	},

	focusChanged (focused) {
		this.setState({
			isFocused: focused,
		});
	},

	valueChanged (event) {
		var content;
		if (this.editor) {
			content = this.editor.getContent();
		} else {
			content = event.target.value;
		}

		this._currentValue = content;
		// console.log('>>>>>>> ', content);
		this.props.onChange({
			path: this.props.path,
			value: content,
		});
	},

	getOptions () {
		var plugins = ['code', 'link'];
		var options = Object.assign(
				{},
				Keystone.wysiwyg.options,
				this.props.wysiwyg
			);
		var toolbar = options.overrideToolbar ? '' : 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | removeformat | link ';
		var i;

		if (options.enableImages) {
			plugins.push('image');
			toolbar += ' | image';
		}

		if (options.enableLocalImagesUploads) {
			plugins.push('uploadloaclimage');
			toolbar += ' | uploadloaclimage';
		}

		if (options.enableCloudinaryUploads || options.enableS3Uploads) {
			plugins.push('uploadimage');
			toolbar += options.enableImages ? ' uploadimage' : ' | uploadimage';
		}

		if (options.additionalButtons) {
			var additionalButtons = options.additionalButtons.split(',');
			for (i = 0; i < additionalButtons.length; i++) {
				toolbar += (' | ' + additionalButtons[i]);
			}
		}
		if (options.additionalPlugins) {
			var additionalPlugins = options.additionalPlugins.split(',');
			for (i = 0; i < additionalPlugins.length; i++) {
				plugins.push(additionalPlugins[i]);
			}
		}
		if (options.importcss) {
			plugins.push('importcss');
			var importcssOptions = {
				content_css: options.importcss,
				importcss_append: true,
				importcss_merge_classes: true,
			};

			Object.assign(options.additionalOptions, importcssOptions);
		}

		if (!options.overrideToolbar) {
			toolbar += ' | code';
		}
		console.log(options);
		var opts = {
			selector: '#' + this.state.id,
			toolbar: toolbar,
			plugins: plugins,
			menubar: options.menubar || false,
			skin: options.skin || 'keystone',
		};

		if (this.shouldRenderField()) {
			opts.uploadimage_form_url = options.enableS3Uploads ? Keystone.adminPath + '/api/s3/upload' : Keystone.adminPath + '/api/cloudinary/upload';
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
		var className = this.state.isFocused ? 'is-focused' : '';
		var style = {
			height: this.props.height,
		};
		return (
			<div className={className}>
				<FormInput
					id={this.state.id}
					multiline
					name={this.getInputName(this.props.path)}
					onChange={this.valueChanged}
					className={this.props.wysiwyg ? 'wysiwyg' : 'code'}
					style={style}
					value={this.props.value}
				/>
			</div>
		);
	},

	renderValue () {
		return (
			<FormInput multiline noedit>
				{this.props.value}
			</FormInput>
		);
	},

});
