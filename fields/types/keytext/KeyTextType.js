var FieldType = require('../Type');
var _ = require('lodash');
var util = require('util');
var keystone = require('../../../');
var utils = require('keystone-utils');
var addPresenceToQuery = require('../../utils/addPresenceToQuery');

/**
 * KeyText FieldType Constructor
 * @extends Field
 * @api public
 * Terry Chan
 * 29/11/2018
 */
function KeyText (list, path, options) {
	this._nativeType = [
		{
			key: String,
			value: String,
			id: String,
		}
	];
	this._underscoreMethods = ['format'];
	this.separator = options.separator || ' | ';
	// representive the placeholder elements
	this.placeholder = [
		'key',
		'value'
	];
	const newOptions = {
		...options,
		...{
			cloneable: true,	// for clone ui element everytime
		},
	};
	if (newOptions.multilingual) {
		this._nativeType = keystone.mongoose.Schema.Types.Mixed;
	} 
	KeyText.super_.call(this, list, path, newOptions);
}
KeyText.properName = 'KeyText';
util.inherits(KeyText, FieldType);

/**
 * Formats the field value
 */
KeyText.prototype.format = function (item, separator) {
	const sep = (separator && typeof separator === 'string') || this.separator;
	const value = this.getItemFromElasticData(item, this.path, separator);
	return _.map(value, v => `(${v.key}: ${v.value || ''})`).join(sep);
};

/**
 * Add filters to a query
 *
 * @param {Object} filter 			   		The data from the frontend
 * @param {String} filter.mode  	   		The filter mode, either one of
 *                                     		"beginsWith", "endsWith", "exactly"
 *                                     		or "contains"
 * @param {String} [filter.presence='some'] The presence mode, either on of
 *                                          "none" and "some". Default: 'some'
 * @param {String|Object} filter.value 		The value that is filtered for
 */
KeyText.prototype.addFilterToQuery = function (filter, options) {
	const isMultilingual = this.options.multilingual;
	const { langd } = options;
	var query = {};
	var presence = filter.presence || 'some';
	// Filter empty/non-empty arrays
	if (!filter.value) {
		// "At least one element contains nothing"
		// This isn't 100% accurate because this will only return arrays that
		// don't have elements, not ones that have empty elements, but it works
		// fine for 99% of the usecase
		query[this.path] = presence === 'some' ? {
			$size: 0,
		// "No elements contain nothing"
		} : {
			$not: {
				$size: 0,
			},
		};
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
		if (presence === 'none') {
			query[this.path] = {
				$or: [
					{
						key: addPresenceToQuery(presence, value),
					},
					{
						text: addPresenceToQuery(presence, value),
					}
				
				]
			};
		} else {
			query[this.path] = {
				$or: [
					{
						key: addPresenceToQuery(presence, {
							$regex: value,
						}),
					},
					{
						text: addPresenceToQuery(presence, {
							$regex: value,
						}),
					}
				]
			};
		}
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
 * Asynchronously confirms that the provided value is valid
 * the key value is mandatary no matter required: true
 */
KeyText.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	var result = true;
	// If the value is null, undefined or an empty string
	// bail early since updateItem sanitizes that just fine
	if (value) {
		// If the value is not an array, convert it to one
		// e.g. if textarr = 'somestring' (which is valid)
		if (!_.isArray(value)) {
			value = [value];
		}
		const { max = -1, min = -1 } = this.options;
		// check for duplicated key
		const newValue = _.uniqBy(value, 'key');
		if (newValue.length !== value.length) {
			result = false;
		} else if (max !== -1 && value.length > max) {
			result = false;
		} else if (min !== -1 && value.length < min) {
			result = false;
		} else {
			// check for any missing key
			result = !_.some(value, v => !v.key);
		}
	}
	utils.defer(callback, result);
};

/**
 * Asynchronously confirms that the a value is present
 * the text value must be inputed
 */
KeyText.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	var result = true;
	// If the value is undefined and we have something stored already, validate
	if (value) {
		// check for any missing text
		result = !_.some(value, v => !v.text);
	}
	utils.defer(callback, result);
};

/**
 * Validates that a value for this field has been provided in a data object
 *
 * Deprecated
 */
KeyText.prototype.inputIsValid = function (data, required, item) {
	var value = this.getValueFromData(data);
	if (required) {
		if (!(_.isArray(value) && value.length)) {
			return false;
		}
		return value && value.length && !_.values(value).some(v => v.key || v.text);
	}
	return true;
};

/* Export Field Type */
module.exports = KeyText;
