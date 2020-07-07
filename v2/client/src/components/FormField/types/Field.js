import React from 'react';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
import {
	// Tooltip,
	Grid,
} from '@material-ui/core';
// import {
// 	Help as HelpIcon,
// } from '@material-ui/icons';
import _ from 'lodash';
import _forEach from 'lodash/forEach';
import _concat from 'lodash/concat';
import { findDOMNode } from 'react-dom';
import QRCode from 'qrcode.react';
import classnames from 'classnames';
import { css } from 'glamor';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import blacklist from 'blacklist';
import {
  Button,
} from '@material-ui/core';


import Note from './../shared/Note';

import evalDependsOn from '../utils/evalDependsOn.js';

import { FormField, FormInput } from '../elemental';

import CollapsedFieldLabel from '../components/CollapsedFieldLabel';
// import {
// 	Button,
// } from 'elemental';

// locales
import i18n from '../../../i18n';

function isObject (arg) {
	return Object.prototype.toString.call(arg) === '[object Object]';
}

function validateSpec (spec) { 
	if (!spec) spec = {};
	if (!isObject(spec.supports)) {
		spec.supports = {};
	}
	if (!spec.focusTargetRef) {
		spec.focusTargetRef = 'focusTarget';
	}
	return spec;
}

const Base = {
	getInitialState () {
		return {
			copied: false,
		};
	},
	getDefaultProps () {
		return {
			inputProps: {},
			labelProps: {},
			valueProps: {},
			size: 'full',
		};
	},
	getInputName (path) {
		// This correctly creates the path for field inputs, and supports the
		// inputNamePrefix prop that is required for nested fields to work
		return this.props.inputNamePrefix
			? `${this.props.inputNamePrefix}[${path}]`
			: path;
	},
	valueChanged (event) {
		this.props.onChange({
			path: this.props.path,
			value: event.target.value,
		});
	},
	shouldCollapse () {
		return this.props.collapse && !this.props.value;
	},
	shouldRenderField () {
		const { restrictDelegated, values: { delegated } } = this.props;
		if (restrictDelegated && delegated) return false;
		if (this.props.mode === 'create') return true;
		return !this.props.noedit;
	},
	focus () {
		if (!this.refs[this.spec.focusTargetRef]) return;
		findDOMNode(this.refs[this.spec.focusTargetRef]).focus();
	},
	// renderNote () {
	// 	if (!this.props.note) return null;

	// 	return <FormNote html={this.props.note} />;
	// },
	renderField () {
		const { autoFocus, value, inputProps, disabled, required, path, label } = this.props;
		// console.log(this.props);
		return (
			<FormInput 
				{...{
					...inputProps,
					errorMessage: this.props.errorMessage,
					autoFocus,
					disabled,
					path,
					required,
					label,
					autoComplete: 'off',
					name: this.getInputName(path),
					onChange: this.valueChanged,
					value,
				}}
			/>
		);
	},
	downloadQrCode() {
		// use hook to solve the lib no ref problem
		const canvas = document.getElementById(`${this.props.path}-qrcode`);
		// console.log(canvas);
		if (canvas) {
			const anchorEl = document.createElement('a');
            anchorEl.href = canvas.toDataURL();
            anchorEl.download = `${this.props.value}.png`;
            document.body.appendChild(anchorEl); // required for firefox
            anchorEl.click();
            anchorEl.remove();
		}
	},
	/*
	** Render individual image block 
	** Terry Chan@11/09/2018
	*/
	renderBaseImageBlock (path) {
		if (!path) return null;
		let fullPath = `data:image/jpeg;base64,${path}`;
		if (!this.props.base64Prefix) {
			fullPath = path;
		}
		return (
			<a target="_blank" name="preview" className="_base64_image_preview" onClick={() => {
				const win = window.open('');
				win.document.write(`<img src='${fullPath}' />`);
			}}>
				<img src={fullPath} alt="fullPath"  width="100px" />
			</a>
		);
	},
	renderBaseImages () {
		let { value, base64Delimiter } = this.props;
		const self = this;
		let images = [];
		if (value) {
			if (base64Delimiter) {
				value = value.split(base64Delimiter);
			} else {
				value = [value];
			}
			if (value.length) {
				_forEach(value, function(path) {
					images = _concat([], images, [self.renderBaseImageBlock(path)]);
				});
			}
		}
		return images;
	},
	renderQRCodeImages() {
		// const { value } = this.props;
		if (!this.props.value) return (<div />);
		const { value, copy, download, label, path } = this.props;
		const qrcode = (
			<Grid
				container
				direction="row"
				justify="flex-start"
		  		alignItems="center"
			>
				<div>
					<QRCode
						value={value}
						id={`${path}-qrcode`}
					/>
				</div>
				{
					download && <Button ref="button" onClick={this.downloadQrCode}>
						{i18n.t('list.downloadqrCode')}
					</Button>
				}
				{
					this.props.copy && <Note note={value} placement="top-end" />
				}
				{
					copy && <CopyToClipboard text={value}
			        	onCopy={() => alert(i18n.t('message.copySuccess'))}
			        >
				        <span className={
				        	css({
				        		float: 'right',
				        		margin: '5px',
				        		fontWeight: 'bolder',
				        		cursor: 'pointer',
				        		color: '#666',
				        	})
				        }>
				        	{i18n.t('list.copy', { target: label })}
				        </span>
			    	</CopyToClipboard>
				}
			</Grid>
		);

		// if (!!note) {
		// 	return (
		// 		<Tooltip title={note} placement="top-start" aria-label={note}>
		// 			{qrcode}
		// 		</Tooltip>
		// 	);
		// }
		return qrcode;
	},
	renderValue () {
		/*
		** Will override the original Field type and special handle for base64Image value
		** Terry Chan@11/09/2018
		*/
		if (this.props.qrcodeImage) {
			return this.renderQRCodeImages();
		} else if (this.props.base64Image) {
			return this.renderBaseImages();
		}
		if (this.props.copy) {
			return (
				<FormField>
					<FormInput noedit={true}>{this.props.value}</FormInput>
					<CopyToClipboard text={this.props.value}
				        onCopy={() => alert(i18n.t('message.copySuccess'))}>
				        <span className={
				        	css({
				        		float: 'right',
				        		margin: '5px',
				        		fontWeight: 'bolder',
				        		cursor: 'pointer',
				        		color: '#666',
				        	})
				        }>{i18n.t('list.copy', { target: this.props.label })}</span>
				    </CopyToClipboard>
				</FormField>
			);
		}
		// console.log('this.props.value: ', this.props.value);
		return <FormInput noedit={true}>{this.props.value}</FormInput>;
	},
	isImage (value) {
		const imageMimeType = [
			"image/png",
			"image/jpeg",
			"image/jpg",
			"image/gif",
		];
		return !!_.includes(imageMimeType, value);
	},
	getRequired () {
		const {
			label,
			required,
		} = this.props;
		return label ? `${label}${required ? ' *' : ''}` : null;
	},
	renderWrapper (options={}) {
		const { note, path } = this.props;
		const label = this.getRequired();
		return (
			<FormField label={label} note={note} {...options}>
				{this.shouldRenderField() ? this.renderField() : this.renderValue()}
			</FormField>
		);
	},
	renderWithErrorUI () {
		const {
			errorMessage,
		} = this.props;
		return this.renderWrapper({ errorMessage });
	},
	renderUI () {
		return this.renderWrapper();
	},
};

const Mixins = {
	Collapse: {
		componentWillMount () {
			this.setState({
				isCollapsed: this.shouldCollapse(),
			});
		},
		componentDidUpdate (prevProps, prevState) {
			if (prevState.isCollapsed && !this.state.isCollapsed) {
				this.focus();
			}
		},
		uncollapse () {
			this.setState({
				isCollapsed: false,
			});
		},
		renderCollapse () {
			if (!this.shouldRenderField()) return null;
			return (
				<FormField>
					<CollapsedFieldLabel onClick={this.uncollapse}>+ Add {this.props.label.toLowerCase()}</CollapsedFieldLabel>
				</FormField>
			);
		},
	},
};

function create (spec) {

	spec = validateSpec(spec);

	let field = {
		spec: spec,
		displayName: spec.displayName,
		mixins: [Mixins.Collapse],
		statics: {
			getDefaultValue: function (field) {
				return field.defaultValue || '';
			},
		},
		render () {
			if (!evalDependsOn(this.props.dependsOn, this.props.values)) {
				return null;
			}
			if (this.state.isCollapsed) {
				return this.renderCollapse();
			}
			return this.renderUI(Object.assign({}, this.props));
		},
	};

	if (spec.statics) {
		Object.assign(field.statics, spec.statics);
	}

	let excludeBaseMethods = {};
	if (spec.mixins) {
		spec.mixins.forEach(function (mixin) {
			Object.keys(mixin).forEach(function (name) {
				if (Base[name]) {
					excludeBaseMethods[name] = true;
				}
			});
		});
	}

	Object.assign(field, blacklist(Base, excludeBaseMethods));
	Object.assign(field, blacklist(spec, 'mixins', 'statics'));
	if (Array.isArray(spec.mixins)) {
		field.mixins = field.mixins.concat(spec.mixins);
	}
	return createClass(field);

};

export default {
	Mixins,
	Base,
	create,
};