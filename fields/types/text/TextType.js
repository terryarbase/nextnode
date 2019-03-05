var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */
function text (list, path, options) {
	this.options = options;
	this._nativeType = String;
	this._properties = ['monospace', 'copy'];
	this._underscoreMethods = ['crop'];
	// representive the placeholder elements
	this.placeholder = [
		'normal',
	];
	text.super_.call(this, list, path, options);
}
text.properName = 'Text';
util.inherits(text, FieldType);

text.prototype.validateInput = function (data, callback) {
	// console.log(this.options.isMultilingual);
	var max = this.options.max;
	var min = this.options.min;
	var regex = this.options.regex;
	var value = this.getValueFromData(data);

	/*
	** casting to string, prevent input number directly
	** Terry Chan
	** 19/11/2018
	*/ 
	value = String(value);
	var result = value === undefined || value === null || typeof value === 'string';

	/*
	** Logical Concern for less and equals than
	** Terry Chan
	** 13/11/2018
	*/
	if (min && typeof value === 'string') {
		result = value.length >= min;
	}

	if (max && typeof value === 'string') {
		result = value.length <= max;
	}

	if (regex && typeof value === 'string') {
		result = new RegExp(regex).test(value);
	}

	utils.defer(callback, result);
};

text.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	const newItem = (item.get && item.get(this.path)) || item[this.path];
	var result = !!value;
	if (value === undefined && newItem) {
		result = true;
	}
	utils.defer(callback, result);
};

/**
 * Add filters to a query
 */
text.prototype.addFilterToQuery = function (filter, options) {
	const isMultilingual = this.options.multilingual;
	const { langd } = options;
	// console.log(options, isMultilingual, this.options);
	var query = {};
	const path = this.path
	if (filter.mode === 'exactly' && !filter.value) {
		query[path] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
	} else {
		var value = utils.escapeRegExp(filter.value);
		if (filter.mode === 'beginsWith') {
			value = '^' + value;
		} else if (filter.mode === 'endsWith') {
			value = value + '$';
		} else if (filter.mode === 'exactly') {
			value = '^' + value + '$';
		}
		value = new RegExp(value, filter.caseSensitive ? '' : 'i');
		query[path] = filter.inverted ? { $not: value } : value;
	}
	if (isMultilingual && langd) {
		query = {
			$or: [
				query,
				{
					[`${this.path}.${langd}`]: query[this.path],
				}
			],
		};
	}
	return query;
};

/**
 * Crops the string to the specifed length.
 */
text.prototype.crop = function (item, length, append, preserveWords) {
	return utils.cropString(item.get(this.path), length, append, preserveWords);
};

/* Export Field Type */
module.exports = text;
