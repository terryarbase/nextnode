var FieldType = require('../Type');
var util = require('util');
const _ = require('lodash');
const keystone = require('../../../');
// const mongoose = require('mongoose');
var utils = require('keystone-utils');

var debug = require('debug')('keystone:fields:file');

/**
 * File FieldType Constructor
 */
function file (list, path, options) {
	this._underscoreMethods = ['format', 'upload', 'remove', 'reset'];
	this._fixedSize = 'full';

	if (!options.storage) {
		throw new Error('Invalid Configuration\n\n'
			+ 'File fields (' + list.key + '.' + path + ') require storage to be provided.');
	}
	const newOptions = {
		...options,
		...{
			stateless: true,	// for create ui element state
		},
	};
	this.storage = newOptions.storage;
	file.super_.call(this, list, path, newOptions);
}
file.properName = 'File';
util.inherits(file, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 */
file.prototype.addToSchema = function (schema) {

	var field = this;

	const ops = this.schemaOptions;
	if (ops.multilingual) {
		ops.type = keystone.mongoose.Schema.Types.Mixed;
		schema.path(this.path, ops);
	} else {
		this.paths = {};
		// add field paths from the storage schema
		Object.keys(this.storage.schema).forEach(function (path) {
			field.paths[path] = field.path + '.' + path;
		});
		var schemaPaths = this._path.addTo({}, this.storage.schema);
		schema.add(schemaPaths);
	}

	this.bindUnderscoreMethods();
};

/**
 * Uploads a new file
 */
file.prototype.upload = function (item, file, options, callback) {
	var field = this;
	// TODO; Validate there is actuall a file to upload
	debug('[%s.%s] Uploading file for item %s:', this.list.key, this.path, item.id, file);
	this.storage.uploadFile(file, function (err, result) {
		if (err) return callback(err);
		// console.log('[%s.%s] Uploaded file for item %s with result:', field.list.key, field.path, item.id, result);
		debug('[%s.%s] Uploaded file for item %s with result:', field.list.key, field.path, item.id, result);
		/*
		** set sub path
		** Terry Chan
		*/
		var newResult = result;
		if (options.subPath) {
			newResult = item.get(field.path) || {};
			newResult[options.subPath] = result;
		}
		item.set(field.path, newResult);
		// console.log('>>>>>upload>>>', options.subPath, newResult);
		// special for Mixed type without auto detecting
		// item.markModified(field.path);
		callback(null, newResult);
	});
};

/**
 * Resets the field value
 */
file.prototype.reset = function (item, options) {
	const ops = this.schemaOptions;
	var value = {};
	if (ops.multilingual) {
		if (options.subPath) {
			value = item.get(this.path);
			delete value[options.subPath];
		}
		if (!Object.keys(value).length) {
			value = null;
		} 
	} else {
		Object.keys(this.storage.schema).forEach(function (path) {
			value[path] = null;
		});
	}
	item.set(this.path, value);
	// special for Mixed type without auto detecting
	// item.markModified(this.path);
};

/**
 * Deletes the stored file and resets the field value
 */
// TODO: Should we accept a callback here? Seems like a good idea.
file.prototype.remove = function (item, subPath, options) {
	var target = item.get(this.path);
	if (options.subPath) {
		const langFile = item.get(this.path);
		target = langFile[options.subPath];
	}
	this.storage.removeFile(target, function() {});
	this.reset(item, options);
};

/**
 * Formats the field value
 */
file.prototype.format = function (item) {
	var value = item.get(this.path);
	if (value) return value.filename || '';
	return '';
};

/**
 * Detects whether the field has been modified
 */
file.prototype.isModified = function (item) {
	var modified = false;
	var paths = this.paths;
	Object.keys(this.storageSchema).forEach(function (path) {
		if (item.isModified(paths[path])) modified = true;
	});
	return modified;
};


function validateInput (value) {
	// undefined, null and empty values are always valid
	if (value === undefined || value === null || value === '') return true;
	// If a string is provided, check it is an upload or delete instruction
	if (typeof value === 'string' && /^(upload\:)|(delete$)|(remove$)/.test(value)) return true;
	// If the value is an object with a filename property, it is a stored value
	// TODO: Need to actually check a dynamic path based on the adapter
	if (typeof value === 'object' && value.filename) return true;
	return false;
}

/**
 * Validates that a value for this field has been provided in a data object
 */
file.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	debug('[%s.%s] Validating input: ', this.list.key, this.path, value);
	var result = validateInput(value);
	debug('[%s.%s] Validation result: ', this.list.key, this.path, result);
	utils.defer(callback, result);
};

/**
 * Validates that input has been provided
 */
file.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	// TODO: We need to also get the `files` argument, so we can check for
	// uploaded files. without it, this will return false negatives so we
	// can't actually validate required input at the moment.
	var result = value || item;
	// var value = this.getValueFromData(data);
	// debug('[%s.%s] Validating required input: ', this.list.key, this.path, value);
	// TODO: Need to actually check a dynamic path based on the adapter
	// TODO: This incorrectly allows empty values in the object to pass validation
	// var result = (value || item.get(this.paths.filename)) ? true : false;
	// debug('[%s.%s] Validation result: ', this.list.key, this.path, result);
	utils.defer(callback, result);
};

file.prototype.getData = function(item){
	const value = item.get(this.path);
	const validLang = this.list.isMultilingualFormat(value, this.list.initialSupportLang);
	var newValue = {};
	// console.log(this.path, validLang, value, this.list.initialSupportLang);
	if (validLang.length) {
		validLang.forEach(key => {
			newValue = {
				...newValue,
				...{
					[key]: {
						...value[key],
						...{
							publicPath: this.storage.adapter.options.publicPath,
						},
					},
				},
			};
		});
	} else if (value) {
		newValue = { ...value, ...{ publicPath: this.storage.adapter.options.publicPath } };
	}
	// console.log(newValue);
	return newValue;
};

/**
 * Updates the value for this field in the item from a data object
 * TODO: It is not possible to remove an existing value and upload a new fiel
 * in the same action, this should be supported
 */
file.prototype.updateItem = function (item, data, files, callback) {
	// Process arguments
	if (typeof files === 'function') {
		callback = files;
		files = {};
	}
	if (!files) {
		files = {};
	}

	// Prepare values
	var value = this.getValueFromData(data);
	var uploadedFile;
	const options = { 
		subPath: data['__subPath'],
	};

	// Providing the string "remove" removes the file and resets the field
	if (value === 'remove') {
		this.remove(item, null, options);
		// return callback();
		utils.defer(callback);
	}


	
	// Find an uploaded file in the files argument, either referenced in the
	// data argument or named with the field path / field_upload path + suffix
	if (typeof value === 'string' && value.substr(0, 7) === 'upload:') {
		uploadedFile = files[value.substr(7)];
	} else {
		uploadedFile = this.getValueFromData(files) || this.getValueFromData(files, '_upload');
	}

	// Ensure a valid file was uploaded, else null out the value
	if (uploadedFile && !uploadedFile.path) {
		uploadedFile = undefined;
	}
	// If we have a file to upload, we do that and stop here
	if (uploadedFile) {
		return this.upload(item, uploadedFile, options, callback);
	}
	// console.log('value: ', value);
	// Empty / null values reset the field
	if (value === null || value === '' || (typeof value === 'object' && !Object.keys(value).length)) {
		this.reset(item, options);
		value = undefined;
	}

	// If there is a valid value at this point, set it on the field
	if (typeof value === 'object') {
		if (options.subPath) {
			const subPath = options.subPath;
			const currentPathValue = item.get(this.path) || {};
			//console.log('>>>>>>>>>>', options.subPath, currentPathValue);
			currentPathValue[subPath] = value;
			item.set(this.path, currentPathValue);
		} else {
			item.set(this.path, value);
		}
		// special for Mixed type without auto detecting
		// item.markModified(this.path);
		// console.log('>>>>>set object: ', options.subPath, value);
	}
	utils.defer(callback);
};

/* Export Field Type */
module.exports = file;
