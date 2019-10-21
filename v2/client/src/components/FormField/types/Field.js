import React from 'react';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
import _forEach from 'lodash/forEach';
import _concat from 'lodash/concat';
import { findDOMNode } from 'react-dom';
import QRCode from 'qrcode.react';
import classnames from 'classnames';
import { css } from 'glamor';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import blacklist from 'blacklist';

import evalDependsOn from '../utils/evalDependsOn.js';

import { FormField, FormInput, FormNote } from '../elemental';

import CollapsedFieldLabel from '../components/CollapsedFieldLabel';
import {
	Button,
} from 'elemental';

function isObject (arg) {
	return Object.prototype.toString.call(arg) === '[object Object]';
}

// function isBase64 (str) {
// 	try {
//         return btoa(atob(str)) == str;
//     } catch (err) {
//         return false;
//     }
// }

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

var Base = module.exports.Base = {
	getInitialState () {
		return {
			copied: false,
		};
	},
	getDefaultProps () {
		return {
			adminPath: Keystone.adminPath,
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
	renderNote () {
		if (!this.props.note) return null;

		return <FormNote html={this.props.note} />;
	},
	renderField () {
		const { autoFocus, value, inputProps, disabled } = this.props;
		// console.log('1>>> ', this.props.path, value);
		return (
			<FormInput {...{
				...inputProps,
				autoFocus,
				disabled,
				autoComplete: 'off',
				name: this.getInputName(this.props.path),
				onChange: this.valueChanged,
				ref: 'focusTarget',
				value,
			}} />
		);
	},
	downloadQrCode() {
		// use hook to solve the lib no ref problem
		const canvas = document.getElementById(`${this.props.path}-qrcode`);
		console.log(canvas);
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
			<a target="_blank" className="_base64_image_preview" onClick={() => {
				const win = window.open('');
				win.document.write(`<img src='${fullPath}' />`);
			}}>
				<img src={fullPath} width="100px" />
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
		const { value, t } = this.props;
		if (!value) return (<div />);
		return (
			<div>
				<div><QRCode
					value={value}
					id={`${this.props.path}-qrcode`}
				/></div>
				{
					this.props.download && <Button ref="button" onClick={this.downloadQrCode}>
						{t('downloadqrCode')}
					</Button>
				}
				{
					this.props.copy && <FormNote html={value} />
				}
				{
					this.props.copy && <CopyToClipboard text={value}
			        onCopy={() => alert(t('message:copySuccess'))}>
			        <span className={
			        	css({
			        		float: 'right',
			        		margin: '5px',
			        		fontWeight: 'bolder',
			        		cursor: 'pointer',
			        		color: '#666',
			        	})
			        }>{t('copy', { target: this.props.label })}</span>
			    </CopyToClipboard>
				}
			</div>
		);
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
			const { t } = this.props;
			return (
				<FormField>
					<FormInput noedit={true}>{this.props.value}</FormInput>
					<CopyToClipboard text={this.props.value}
				        onCopy={() => alert(t('message:copySuccess'))}>
				        <span className={
				        	css({
				        		float: 'right',
				        		margin: '5px',
				        		fontWeight: 'bolder',
				        		cursor: 'pointer',
				        		color: '#666',
				        	})
				        }>{t('copy', { target: this.props.label })}</span>
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
		for(var i = 0; i < imageMimeType.length; i++){
			if(value.mimetype === imageMimeType[i]){
				return true;
			}
		}
		return false;
	},
	renderUI () {
		const { required } = this.props;
		var wrapperClassName = classnames(
			'field-type-' + this.props.type,
			this.props.className,
			{ 'field-monospace': this.props.monospace }
		);
		const label = this.props.label ? `${this.props.label}${required ? ' *' : ''}` : null;
		// console.log('>>>> ', this.props.path, this.props.value);
		return (
			<FormField htmlFor={this.props.path} label={label} className={wrapperClassName} cropLabel>
				<div className={'FormField__inner field-size-' + this.props.size}>
					{this.shouldRenderField() ? this.renderField() : this.renderValue()}
				</div>
				{this.renderNote()}
			</FormField>
		);
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

	var field = {
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
			return this.renderUI(...this.props);
		},
	};

	if (spec.statics) {
		Object.assign(field.statics, spec.statics);
	}

	var excludeBaseMethods = {};
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

export Mixins;
export create;
