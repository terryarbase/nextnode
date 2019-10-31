// import _ from 'lodash';
// import PropTypes from 'prop-types';
// import CodeMirror from 'codemirror';
import CodeMirror from 'react-codemirror';
import Field from '../Field';
import {
	Button,
} from '@material-ui/core';
import React from 'react';
// import { findDOMNode } from 'react-dom';
import {
	// FormInput,
} from '../../elemental';
// import classnames from 'classnames';

// locales
import i18n from '../../../../i18n';

/**
 * TODO:
 * - Remove dependency on lodash
 */

// See CodeMirror docs for API:
// http://codemirror.net/doc/manual.html

export default Field.create({
	displayName: 'CodeField',
	statics: {
		type: 'Code',
	},

	// getInitialState () {
	// 	return {
	// 		isFocused: false,
	// 	};
	// },
	// componentDidMount () {
	// 	if (!this.codemirrorRef) {
	// 		return;
	// 	}

	// 	var options = _.defaults({}, this.props.editor, {
	// 		lineNumbers: true,
	// 		readOnly: this.shouldRenderField() ? false : true,
	// 	});

	// 	this.codeMirror = CodeMirror.fromTextArea(this.codemirrorRef, options);
	// 	this.codeMirror.setSize(null, this.props.height);
	// 	this.codeMirror.on('change', this.codemirrorValueChanged);
	// 	this.codeMirror.on('focus', this.focusChanged.bind(this, true));
	// 	this.codeMirror.on('blur', this.focusChanged.bind(this, false));
	// 	this._currentCodemirrorValue = this.props.value;
	// },
	// componentWillUnmount () {
	// 	// todo: is there a lighter-weight way to remove the cm instance?
	// 	if (this.codeMirror) {
	// 		this.codeMirror.toTextArea();
	// 	}
	// },
	// componentWillReceiveProps (nextProps) {
	// 	if (this.codeMirror && this._currentCodemirrorValue !== nextProps.value) {
	// 		this.codeMirror.setValue(nextProps.value);
	// 	}
	// },
	// focus () {
	// 	if (this.codeMirror) {
	// 		this.codeMirror.focus();
	// 	}
	// },
	// focusChanged (focused) {
	// 	this.setState({
	// 		isFocused: focused,
	// 	});
	// },
	downloadCode() {
		const {
			fileExtension,
			value,
		} = this.props;
		const element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(value));
		element.setAttribute('download', `code_${Math.floor(Math.random())}.${fileExtension}`);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	},
	valueChanged (value) {
		// var newValue = doc.getValue();
		// this._currentCodemirrorValue = newValue;
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},
	renderCodemirror () {
		const {
			download,
		} = this.props;
		const options = {
			lineNumbers: true,
		};
		return (
			<React.Fragment>
				{
					!!download && <Button onClick={this.downloadCode}>
						{i18n.t('list.downloadCode')}
					</Button>
				}
				<div style={{
						border: '1px solid #ccc',
				}}>
			 		<CodeMirror
			 			value={this.props.value}
			 			onChange={this.valueChanged}
			 			options={options}
			 			name={this.getInputName(this.props.path)}
			 		/>
		 		</div>
			</React.Fragment>
		);
	},
	renderValue () {
		return this.renderCodemirror();
	},
	renderField () {
		return this.renderCodemirror();
	},
});
