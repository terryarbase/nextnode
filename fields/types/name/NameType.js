var _ = require('lodash');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');
var keystone = require('../../../');
var displayName = require('display-name');

/**
 * Name FieldType Constructor
 * @extends Field
 * @api public
 */
function name (list, path, options) {
	this._fixedSize = 'full';
	options.default = { first: '', last: '' };
	// representive the placeholder elements
	this.placeholder = [
		'firstname',
		'lastname',
	];
	name.super_.call(this, list, path, options);
}
name.properName = 'Name';
util.inherits(name, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * Adds String properties for .first and .last name, and a virtual
 * with get() and set() methods for .full
 *
 * @api public
 */
name.prototype.addToSchema = function (schema) {
	var paths = this.paths = {
		first: this.path + '.first',
		last: this.path + '.last',
		full: this.path + '.full',
		firstname: '.first',
		lastname: '.last',
	};
	const mongoose = keystone.mongoose;
	const ops = this.schemaOptions;

	if (ops.multilingual) {
		ops.type = keystone.mongoose.Schema.Types.Mixed;
		schema.path(this.path, ops);
	} else {
		schema.nested[this.path] = true;
		schema.add({
			first: String,
			last: String,
		}, this.path + '.');
	}

	schema.virtual(paths.full).get(function () {
		return displayName(this.get(paths.first), this.get(paths.last));
	});

	schema.virtual(paths.full).set(function (value) {
		if (typeof value !== 'string') {
			this.set(paths.first, undefined);
			this.set(paths.last, undefined);
			return;
		}
		var split = value.split(' ');
		this.set(paths.first, split.shift());
		this.set(paths.last, split.join(' ') || undefined);
	});

	this.bindUnderscoreMethods();
};

/**
 * Gets the string to use for sorting by this field
 */
name.prototype.getSortString = function (options) {
	if (options.invert) {
		return '-' + this.paths.first + ' -' + this.paths.last;
	}
	return this.paths.first + ' ' + this.paths.last;
};

/**
 * Add filters to a query
 */
name.prototype.addFilterToQuery = function (filter, options) {
	const isMultilingual = this.options.multilingual;
	const { langd } = options;
	var query = {};
	if (filter.mode === 'exactly' && !filter.value) {
		query[this.paths.first] = query[this.paths.last] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
		// if (isMultilingual && langd) {
		// 	query = {
		// 		$or: [
		// 			{
		// 				[this.paths.first]: query[this.paths.first],
		// 			},
		// 			{
		// 				[this.paths.last]: query[this.paths.last],
		// 			},
		// 			{
		// 				[`${this.path.first}.${langd}`]: query[this.paths.first],
		// 			},
		// 			{
		// 				[`${this.path.last}.${langd}`]: query[this.paths.last],
		// 			}
		// 		],
		// 	};
		// }
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
		if (filter.inverted) {
			query[this.paths.first] = query[this.paths.last] = { $not: value };
		} else {
			var first = {}; first[this.paths.first] = value;
			var last = {}; last[this.paths.last] = value;
			query.$or = [first, last];
		}
	}
	// console.log(isMultilingual, langd);
	if (isMultilingual && langd) {
		query = {
			$or: [
				query,
				{
					[`${this.paths.first}.${langd}`]: query[this.path.first],
				},
				{
					[`${this.paths.last}.${langd}`]: query[this.path.last],
				}
			],
		};
	}
	return query;
};

/**
 * Formats the field value
 */

name.prototype.format = function (item, options) {
	return this.getItemFromElasticData(item, this.paths.full, options);
};

/**
 * Get the value from a data object; may be simple or a pair of fields
 */
name.prototype.getInputFromData = function (data) {
	// this.getValueFromData throws an error if we pass name: null
	if (data[this.path] === null) {
		return null;
	}
	var first = this.getValueFromData(data, '_first');
	if (first === undefined) first = this.getValueFromData(data, '.first');
	var last = this.getValueFromData(data, '_last');
	if (last === undefined) last = this.getValueFromData(data, '.last');
	if (first !== undefined || last !== undefined) {
		return {
			first: first,
			last: last,
		};
	}
	return this.getValueFromData(data) || this.getValueFromData(data, '.full');
};

/**
 * Validates that a value for this field has been provided in a data object
 */
name.prototype.validateInput = function (data, callback) {
	var value = this.getInputFromData(data);
	var result = value === undefined
		|| value === null
		|| typeof value === 'string'
		|| (typeof value === 'object' && (
			typeof value.first === 'string'
			|| value.first === null
			|| typeof value.last === 'string'
			|| value.last === null)
		);
	utils.defer(callback, result);
};

/**
 * Validates that input has been provided
 */
name.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getInputFromData(data);
	var result;
	const first = (item.get && item.get(this.paths.first)) || item[this.path.first];
	const last = (item.get && item.get(this.paths.last)) || item[this.path.last];
	if (value === null) {
		result = false;
	} else {
		result = (
			typeof value === 'string' && value.length
			|| typeof value === 'object' && (
				typeof value.first === 'string' && value.first.length
				|| typeof value.last === 'string' && value.last.length)
				|| first
				|| last && (
					value === undefined
					|| (value.first === undefined
						&& value.last === undefined))
			) ? true : false;
	}
	utils.defer(callback, result);
};

/**
 * Validates that a value for this field has been provided in a data object
 *
 * Deprecated
 */
name.prototype.inputIsValid = function (data, required, item) {
	// Input is valid if none was provided, but the item has data
	if (!(this.path in data || this.paths.first in data || this.paths.last in data || this.paths.full in data) && item && item.get(this.paths.full)) return true;
	// Input is valid if the field is not required
	if (!required) return true;
	// Otherwise check for valid strings in the provided data,
	// which may be nested or use flattened paths.
	if (_.isObject(data[this.path])) {
		return (data[this.path].full || data[this.path].first || data[this.path].last) ? true : false;
	} else {
		return (data[this.paths.full] || data[this.paths.first] || data[this.paths.last]) ? true : false;
	}
};

/**
 * Detects whether the field has been modified
 *
 * @api public
 */
name.prototype.isModified = function (item) {
	return item.isModified(this.paths.first) || item.isModified(this.paths.last);
};

// name.prototype.updateField = function (paths, value, options) {
// 	if (options.subPath) {
// 		const subPath = options.subPath;
// 		const currentPathValue = item.get(this.path) || {};
// 		console.log('currentPathValue: ', currentPathValue);
// 		currentPathValue = {
// 			...currentPathValue,
// 			...{
// 				[subPath]: {
// 					...currentPathValue[subPath],
// 					...{
// 						[paths]: value,
// 					},
// 				},
// 			},
// 		};
// 		console.log('after currentPathValue: ', currentPathValue);
// 		item.set(this.path, currentPathValue);
// 	} else {
// 		item.set(paths, value);
// 	}
// };

/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */
name.prototype.updateItem = function (item, data, callback) {
	var paths = this.paths;
	var value = this.getInputFromData(data);
	const isMultilingualFormat = this.list.isMultilingualFormat(value).length;
	if (isMultilingualFormat) {
		item.set(this.path, value);
	} else {
		if (typeof value === 'string' || value === null) {
			item.set(paths.full, value);
		} else if (typeof value === 'object') {
			if (typeof value.first === 'string' || value.first === null) {
				item.set(paths.first, value.first);
			}
			if (typeof value.last === 'string' || value.last === null) {
				item.set(paths.last, value.last);
			}
		}
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = name;
