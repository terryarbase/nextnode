var async = require('async');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');
var _map = require('lodash/map');

var isReserved = require('../../../lib/list/isReserved');

/**
 * Object FieldType Constructor
 * @extends Field
 * @api public
 */
function object (keystoneList, path, options) {
	this._underscoreMethods = ['format'];
	object.super_.call(this, keystoneList, path, options);
}
object.properName = 'Object';
util.inherits(object, FieldType);

function validateFieldType (field, path, type) {
	var Field = field.list.keystone.Field;
	if (!(type.prototype instanceof Field)) {
		// Convert native field types to their default Keystone counterpart
		if (type === String) {
			type = Field.Types.Text;
		} else if (type === Number) {
			type = Field.Types.Number;
		} else if (type === Boolean) {
			type = Field.Types.Boolean;
		} else if (type === Date) {
			type = Field.Types.Datetime;
		} else {
			throw new Error(
				'Unrecognised field constructor for nested schema path `' + path
				+ '` in `' + field.list.key + '.' + field.path + '`: ' + type
			);
		}
	}
	return type;
}

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */
object.prototype.addToSchema = function (schema) {
	var field = this;
	var mongoose = this.list.keystone.mongoose;
	var fields = this.fields = {};
	var fieldsArray = this.fieldsArray = [];
	var fieldsSpec = this.schemaOptions.fields;
	var itemSchema = new mongoose.Schema();

	if (typeof fieldsSpec !== 'object' || !Object.keys(fieldsSpec).length) {
		throw new Error(
			'List field ' + field.list.key + '.' + field.path
			+ ' must be configured with `fields`.'
		);
	}

	function createField (path, options) {
		if (typeof options === 'function') {
			options = { type: options };
		}
		if (field.list.get('noedit') || field.noedit) {
			options.noedit = true;
		}
		if (typeof options.type !== 'function') {
			throw new Error(
				'Invalid type for nested schema path `' + path + '` in `'
				+ field.list.key + '.' + field.path + '`.\n'
				+ 'Did you misspell the field type?\n'
			);
		}
		options.type = validateFieldType(field, path, options.type);
		// We need to tell the Keystone List that this field type is in use
		field.list.fieldTypes[options.type.name] = options.type.properName;
		// WYSIWYG HTML fields are special-cased
		if (options.type.name === 'html' && options.wysiwyg) {
			field.list.fieldTypes.wysiwyg = true;
		}
		// Tell the Field that it is nested, this changes the constructor slightly
		options._isNested = true;
		options._nestedSchema = itemSchema;
		return new options.type(field.list, path, options);
	}

	Object.keys(fieldsSpec).forEach(function (path) {
		if (!fieldsSpec[path]) {
			throw new Error(
				'Invalid value for nested schema path `' + path + '` in `'
				+ field.list.key + '.' + field.path + '`.\n'
				+ 'Did you misspell the field type?\n'
			);
		}
		if (isReserved(path)) {
			throw new Error(
				'Nested schema path ' + path + ' on field '
				+ field.list.key + '.' + field.path + ' is a reserved path'
			);
		}
		var newField = createField(path, fieldsSpec[path]);
		fields[path] = newField;
		fieldsArray.push(newField);
	});

	if (this.schemaOptions.decorateSchema) {
		this.schemaOptions.decorateSchema(itemSchema);
	}

	schema.add(this._path.addTo({}, itemSchema));
	this.bindUnderscoreMethods();
};

/**
 * Provides additional properties for the Admin UI
 */
object.prototype.getProperties = function (item, separator) {
	var fields = {};
	this.fieldsArray.forEach(function (field) {
		const options = field.getOptions();
		if (options.hidden) {
			return;
		}
		fields[field.path] = options;
	});
	return {
		fields,
	};
};

/**
 * Formats the field value
 */
object.prototype.format = function (item, separator) {
	// TODO: How should we format nested items? Returning length for now.
	var items = item.get(this.path) || [];
	return utils.plural(items.length, '* Value', '* Values');
};

// TODO: How should we filter object values?
/*
object.prototype.addFilterToQuery = function (filter) { };
*/

/**
 * Asynchronously confirms that the provided value is valid
 */
object.prototype.validateInput = function (data, callback) {
	// TODO
	var value = this.getValueFromData(data);
	var result = true;
	utils.defer(callback, result);
};

/**
 * Asynchronously confirms that the a value is present
 */
object.prototype.validateRequiredInput = function (item, data, callback) {
	// TODO
	var value = this.getValueFromData(data);
	var result = true;
	utils.defer(callback, result);
};

object.prototype.getData = function (item) {
	const value = item.get(this.path);
	const fieldsArray = this.fieldsArray;

	let data = { id: value._id, };
	_map(fieldsArray, field => {
		data[field.path] = field.getData(value);
	})
	return data;
};

/**
 * Updates the value for this field in the item from a data object.
 * If the data object does not contain the value, then the value is set to empty object.
 */
object.prototype.updateItem = function (item, data, files, callback) {
	const field = this;
	let value = this.getValueFromData(data);
	let objectData = item.get(this.path);

	// Reset the value when null or an empty string is provided
	if (value === undefined || value === null || value === '') {
		value = {};
	}

	if (objectData) {
		async.forEach(field.fieldsArray, function (nestedField, done) {
			if (nestedField.type === 'file') {
				nestedField.updateItem(objectData, value, files, done);
			} else {
				nestedField.updateItem(objectData, value, done);
			}
		}, function(err) {
			if (err) throw err;
			item.set(field.path, objectData);
			callback();
		});
	} else {
		/*
		** part of nested field need mongoose SingleNested Object
		** however objectData is 'undefined' at method first call for creation
		** Solution: save empty object at creation let mongoose create correct object
		*/
		item.set(field.path, {});
		callback();
	}
};

/* Export Field Type */
module.exports = object;
