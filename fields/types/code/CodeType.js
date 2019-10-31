var assign = require('object-assign');
const _ = require('lodash');
var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');
var utils = require('keystone-utils');
const {
	format,
} = require('json-string-formatter');


/**
 * Code FieldType Constructor
 * @extends Field
 * @api public
 */
function code (list, path, options) {
	this._nativeType = String;
	this._defaultSize = 'full';
	this.height = options.height || 180;
	this.download = !!options.download;
	this.lang = options.lang || options.language || 'js';
	this._properties = ['editor', 'height', 'lang', 'download', 'fileExtension'];
	this.codemirror = options.codemirror || {};
	this.editor = assign({ mode: this.lang }, this.codemirror);
	// only marks the special file extension
	const fileExtensionsList = {
		'c++': 'cc',
		'objectivec': 'm',
		'lisp': 'lsp',
		'perl': 'pl',
		'python': 'py',
		'ruby': 'rb',
	};
	let fileExtension = fileExtensionsList[this.lang];
	fileExtension = !fileExtension ? `.${this.lang}` : `.${fileExtension}`;
	const newOptions = {
		...options,
		fileExtension,
	};
	code.super_.call(this, list, path, newOptions);
}
code.properName = 'Code';
util.inherits(code, FieldType);


code.prototype.validateInput = function (data, callback) {
	utils.defer(callback, true);
};

code.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
code.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

code.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	if (!value) {
		value = data;
	}
	
	if (typeof value === 'object') {
		value = format(JSON.stringify(value));
	}
	// console.log('>>>>> ', value);
	// This is a deliberate type coercion so that numbers from forms play nice
	if (value !== undefined && value != item.get(this.path)) { // eslint-disable-line eqeqeq
		item.set(this.path, value);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = code;
