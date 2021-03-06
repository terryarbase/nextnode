var async = require('async');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');
var _ = require('lodash');

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

	if (typeof fieldsSpec !== 'object') {
		throw new Error(
			'Object field ' + field.list.key + '.' + field.path
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
object.prototype.format = function (item, options) {
	let data = _.get(item.get(this.path), '_doc', {});
	const pickList = _.difference(_.keys(data), [
		'_id',
	])
	return _.pick(data, pickList);
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

const _getData = (value, field) => {
	let data = null;
	if (field.type === 'object') {
		let objectData = { id: _.get(value, '_id') };
		// traverse subfields and do same thing
		_.forEach(field.fieldsArray, nestedField => {
			// TODO: how to handle nested 'Object' type when value be undefined instead of Document Object
			// create Document Object? but how?
			// for now ignore the error
			const v = nestedField.type === 'object' ? value[nestedField.path] : value
			try {
				objectData[nestedField.path] = _getData(v, nestedField);
			} catch(err) {
				// trigger on non Document Object value
			}
		});
		data = objectData
	} else {
		data = field.getData(value)
	}
	return data;
}

object.prototype.getData = function (item) {
	const field = this;
	const value = item.get(this.path);
	return _getData(value, field);
};

/*
** mongoose Document Object is needed in getDate()
** we must save an object in db whichs type is 'Object' type
** to make sure mongoose return a Document Object
** Fung Lee
** 2020-05-14
*/
object.prototype._prepareValue = function (value, field) {
	if (field.type === 'object') {
		// make sure value of 'Object' type must be object
		if (!value) {
			value = {};
		}
		// traverse subfields and do same thing
		_.forEach(field.fieldsArray, nestedField => {
			value[nestedField.path] = this._prepareValue(value[nestedField.path], nestedField);
		});
	}
	
	// handle another field type
	if (field.type === 'relationship') {
		const ObjectId = this.list.keystone.mongoose.Types.ObjectId;
		value = ObjectId.isValid(value) ? value : undefined;
	}
	return value;
}

/**
 * Updates the value for this field in the item from a data object.
 * If the data object does not contain the value, then the value is set to empty object.
 */
object.prototype.updateItem = function (item, data, files, callback, isNested) {
	const field = this;
	let value = this.getValueFromData(data);
	let objectData = item.get(this.path);

	// for performance, only prepare whole value in the outermost nested 'Object' type
	if (!isNested) {
		value = this._prepareValue(value, field);		
	}
	
	if (objectData) {
		async.forEach(field.fieldsArray, function (nestedField, done) {
			if (nestedField.type === 'object') {
				nestedField.updateItem(objectData, value, files, done, true);
			} else if (nestedField.type === 'file') {
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
		item.set(field.path, value);
		callback();
	}
};

/* Export Field Type */
module.exports = object;
