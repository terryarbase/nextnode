/*!
 * Module dependencies.
 */
var _ = require('lodash');
var assign = require('object-assign');
var di = require('asyncdi');
var marked = require('marked');
const mongoose = require('mongoose');
var Path = require('../../lib/path');
var utils = require('keystone-utils');
var evalDependsOn = require('../utils/evalDependsOn.js');
var definePrototypeGetters = require('../utils/definePrototypeGetters.js');
var debug = require('debug')('keystone:fields:types:Type');

var DEFAULT_OPTION_KEYS = [
	'path',
	'paths',
	'type',
	'label',
	'note',
	'size',
	'initial',
	'required',
	'base64Image',
	'col',
	'noedit',
	'realedit',
	'nocol',
	'nosort',
	'indent',
	'hidden',
	'collapse',
	'restrictDelegated',
	'dependsOn',
	'autoCleanup',
	'multilingual',
	'stateless',
];

/**
 * Field Constructor
 * =================
 *
 * Extended by fieldType Classes, should not be used directly.
 *
 * @api public
 */
function Field (list, path, options) {

	// Set field properties and options
	this.list = list;
	this._path = new Path(path);
	this.path = path;

	// multilingual subpath
	this.subPath = null;
	
	this.type = this.constructor.name;
	this.options = _.defaults({}, options, this.defaults);
	/*
	** Special for multilingual field 
	** Convert to Mixed schema type no matter it is any kind of field type for Keystone.Types
	** Terry Chan
	** 14/11/2018
	*/
	this.schemaOptions = assign({}, this.options);
	// console.log(">>>>>>>>>> ", this.schemaOptions);
	if (this.schemaOptions.multilingual) {
		this.schemaOptions = assign({}, this.schemaOptions, { type: mongoose.Schema.Types.Mixed });
	}
	this.label = options.label || utils.keyToLabel(this.path);
	this.typeDescription = options.typeDescription || this.typeDescription || this.type;

	if (!options._isNested) {
		this.list.automap(this);
	}

	// Warn on required fields that aren't initial
	if (this.options.required
		&& this.options.initial === undefined
		&& this.options.default === undefined
		&& !this.options.value
		&& !this.list.get('nocreate')
		&& this.path !== this.list.mappings.name
	) {
		console.error('\nError: Invalid Configuration\n\n'
		+ 'Field (' + list.key + '.' + path + ') is required but not initial, and has no default or generated value.\n'
		+ 'Please provide a default, remove the required setting, or set initial: false to override this error.\n');
		process.exit(1);
	}

	// if dependsOn and required, set required to a function for validation
	if (this.options.dependsOn && this.options.required === true) {
		var opts = this.options;
		this.options.required = function () {
			// `this` refers to the validating document
			debug('validate dependsOn required', evalDependsOn(opts.dependsOn, this.toObject()));
			return evalDependsOn(opts.dependsOn, this.toObject());
		};
	}
	// Add the field to the schema
	this.addToSchema(options._isNested ? options._nestedSchema : this.list.schema);
	// Add pre-save handler to the list if this field watches others
	if (options._isNested && this.options.watch) {
		throw new Error('Nested fields do not support the `watch` option.');
	} else if (this.options.watch) {
		this.list.schema.pre('save', this.getPreSaveWatcher());
	}

	// Convert notes from markdown to html
	var note = null;
	Object.defineProperty(this, 'note', {
		get: function () {
			return (note === null) ? (note = (this.options.note) ? marked(this.options.note) : '') : note;
		},
	});

}
/**
 * Sets the dynamic option in runtime
 * Usually used for API requests
 */
Field.prototype.setOptions = function (options) {
	const optionKeys = _.keys(options);
	if (optionKeys.length) {
		_.forEach(optionKeys, key => {
			this.options[key] = options[key];
		});
	}
}
/**
 * Gets the options for the Field, as used by the React components
 */
Field.prototype.getOptions = function () {
	if (!this.__options) {
		this.__options = {};
		var optionKeys = DEFAULT_OPTION_KEYS;
		if (_.isArray(this._properties)) {
			optionKeys = optionKeys.concat(this._properties);
		}
		optionKeys.forEach(function (key) {
			if (this[key]) {
				this.__options[key] = this[key];
			} else if (this.options[key]) {
				this.__options[key] = this.options[key];
			}
		}, this);
		if (this.getProperties) {
			assign(this.__options, this.getProperties());
		}
		this.__options.hasFilterMethod = this.addFilterToQuery ? true : false;
		this.__options.defaultValue = this.getDefaultValue();
	}
	return this.__options;
};

/**
 * Validates and returns the size of the field.
 * Defaults to deprecated 'width' option.
 */
Field.prototype.getSize = function () {
	if (!this.__size) {
		var size = this._fixedSize || this.options.size || this.options.width;
		if (size !== 'small' && size !== 'medium' && size !== 'large' && size !== 'full') {
			size = this._defaultSize || 'full';
		}
		this.__size = size;
	}
	return this.__size;
};

/**
 * Gets default value for the field, based on the option or default for the type
 */
Field.prototype.getDefaultValue = function () {
	return typeof this.options.default !== 'undefined' ? this.options.default : '';
};

/**
 * Gets the field's data from an Item, as used by the React components
 */
Field.prototype.getData = function (item) {
	return item.get(this.path);
};

Field.prototype.getSubPathItemData = function (item, subPath) {
	const currentPathValue = item.get(this.path);
	// console.log('currentPathValue: ', item);
	return currentPathValue[subPath] || {};
}

// Field.prototype.setSubPathItemData = function (item, subPathValue, value, subPath) {
// 	const currentPathValue = item.get(this.path);
// 	return currentPathValue[subPath];
// }
/**
 * Field watching implementation
 */
Field.prototype.getPreSaveWatcher = function () {
	var field = this;
	var applyValue;

	if (this.options.watch === true) {
		// watch == true means always apply the value method
		applyValue = function () { return true; };
	} else {
		// if watch is a string, convert it to a list of paths to watch
		if (typeof this.options.watch === 'string') {
			this.options.watch = this.options.watch.split(' ');
		}
		if (typeof this.options.watch === 'function') {
			applyValue = this.options.watch;
		} else if (_.isArray(this.options.watch)) {
			applyValue = function (item) {
				var pass = false;
				field.options.watch.forEach(function (path) {
					if (item.isModified(path)) pass = true;
				});
				return pass;
			};
		} else if (_.isObject(this.options.watch)) {
			applyValue = function (item) {
				var pass = false;
				_.forEach(field.options.watch, function (value, path) {
					if (item.isModified(path) && item.get(path) === value) pass = true;
				});
				return pass;
			};
		}
	}

	if (!applyValue) {
		console.error('\nError: Invalid Configuration\n\n'
		+ 'Invalid watch value (' + this.options.watch + ') provided for ' + this.list.key + '.' + this.path + ' (' + this.type + ')');
		process.exit(1);
	}

	if (typeof this.options.value !== 'function') {
		console.error('\nError: Invalid Configuration\n\n'
		+ 'Watch set with no value method provided for ' + this.list.key + '.' + this.path + ' (' + this.type + ')');
		process.exit(1);
	}

	return function (next) {
		if (!applyValue(this)) {
			return next();
		}
		di(field.options.value).call(this, function (err, val) {
			if (err) {
				console.error('\nError: '
				+ 'Watch set with value method for ' + field.list.key + '.' + field.path + ' (' + field.type + ') throws error:' + err);
			} else {
				this.set(field.path, val);
			}
			next();
		}.bind(this));
	};

};
module.exports = Field;

/** Getter properties for the Field prototype */
definePrototypeGetters(Field, {
	size: function () { return this.getSize(); },
	initial: function () { return this.options.initial || false; },
	required: function () { return this.options.required || false; },
	note: function () { return this.options.note || ''; },
	col: function () { return this.options.col || false; },
	noedit: function () { return this.options.noedit || false; },
	nocol: function () { return this.options.nocol || false; },
	nosort: function () { return this.options.nosort || false; },
	collapse: function () { return this.options.collapse || false; },
	hidden: function () { return this.options.hidden || false; },
	dependsOn: function () { return this.options.dependsOn || false; },
});

/**
 * Default method to register the field on the List's Mongoose Schema.
 * Overridden by some fieldType Classes
 */
Field.prototype.addToSchema = function (schema) {
	var ops = (this._nativeType) ? _.defaults({ type: this._nativeType }, this.schemaOptions) : this.schemaOptions;
	if (ops.multilingual) {
		ops.type = mongoose.Schema.Types.Mixed;
	}
	schema.path(this.path, ops);
	this.bindUnderscoreMethods();
};

/**
 * Binds the methods specified by the _underscoreMethods property
 * Must be called by the field type's `addToSchema` method
 * Always includes the `update` method
 */
Field.prototype.bindUnderscoreMethods = function () {
	var field = this;
	(this._underscoreMethods || []).concat({ fn: 'updateItem', as: 'update' }).forEach(function (method) {
		if (typeof method === 'string') {
			method = { fn: method, as: method };
		}
		if (typeof field[method.fn] !== 'function') {
			throw new Error('Invalid underscore method (' + method.fn + ') applied to ' + field.list.key + '.' + field.path + ' (' + field.type + ')');
		}
		field.underscoreMethod(method.as, function () {
			var args = [this].concat(Array.prototype.slice.call(arguments));
			return field[method.fn].apply(field, args);
		});
	});
};

/**
 * Adds a method to the underscoreMethods collection on the field's list,
 * with a path prefix to match this field's path and bound to the document
 */
Field.prototype.underscoreMethod = function (path, fn) {
	this.list.underscoreMethod(this.path + '.' + path, function () {
		return fn.apply(this, arguments);
	});
};

/**
 * Default method to format the field value for display
 * Overridden by some fieldType Classes
 *
 * @api public
 */
Field.prototype.format = function (item, options) {
	// var value = item.get(this.path);
	const value = this.getItemFromElasticData(item, this.path, options);
	if (value === undefined) return '';
	return value;
};

/**
 * Default method to detect whether the field has been modified in an item
 * Overridden by some fieldType Classes
 *
 * @api public
 */
Field.prototype.isModified = function (item) {
	return item.isModified(this.path);
};

/**
 * Checks whether a provided value for the field is in a valid format
 * Overridden by some fieldType Classes
 *
 * @api public
 */
Field.prototype.validateInput = function (data, callback) {
	utils.defer(callback, this.inputIsValid(data));
};

/**
 * Validates that a value for this field has been provided in a data object,
 * taking into account existing data in an item
 * Overridden by some fieldType Classes
 *
 * @api public
 */
Field.prototype.validateRequiredInput = function (item, data, callback) {
	utils.defer(callback, this.inputIsValid(data, true, item));
};

/**
 * Validates that a value for this field has been provided in a data object
 * Overridden by some fieldType Classes
 *
 * Not a reliable public API; use inputIsValid, which is async, instead.
 * This method has been deprecated.
 */
Field.prototype.inputIsValid = function (data, required, item) {
	if (!required) return true;
	var value = this.getValueFromData(data);
	if (value === undefined && item && item.get(this.path)) return true;
	if (typeof data[this.path] === 'string') {
		return (data[this.path].trim()) ? true : false;
	} else {
		return (data[this.path]) ? true : false;
	}
};

/**
 * Updates the value for this field in the item from a data object
 * Overridden by some fieldType Classes
 *
 * @api public
 */
Field.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	// This is a deliberate type coercion so that numbers from forms play nice
	if (value !== undefined && value != item.get(this.path)) { // eslint-disable-line eqeqeq
		item.set(this.path, value);
	}
	process.nextTick(callback);
};

/**
 * Retrieves the value from an object, whether the path is nested or flattened
 *
 * @api public
 */
Field.prototype.getValueFromData = function (data, subpath) {
	// console.log(this.options.isMultilingual, this.path);
	return this._path.get(data, subpath);
};

/*
** Convert single value to multilingual value, and vice versa
** Terry Chan
** 18/11/2018
*/
Field.prototype.getItemFromElasticData = function(item, path, options) {
	var value = item.get(path) || item.get(this.path);
	if (this.options.multilingual && options.langd) {
		const isMultilingualFormat = this.list.isMultilingualFormat(value).length;
		if (isMultilingualFormat) {
			return value[options.langd] || '';
		}
	}
	return value || '';
}
Field.prototype.getValueFromElasticData = function(data, subpath) {
	var value = this.getValueFromData(data, subpath);
	return this.getElasticData(value);
}
Field.prototype.getElasticData = function (data, options={}) {
	const supportingLanguage = this.list.initialSupportLang;
	// perfer data language option first
	const defaultLanguage = options.langd || options.defaultLang || 'en';
	const turnOnMultilingual = this.options.multilingual;
	const isMultilingualStructure = this.list.isMultilingualFormat(data, supportingLanguage).length;
	var newData = data;
	// console.log(newData, turnOnMultilingual, options);
	// console.log(this.path, isMultilingualStructure, newData, turnOnMultilingual);
	if (turnOnMultilingual) {
		// string value or other object structure
		if (!isMultilingualStructure) {
			if (typeof data !== 'object') {
				newData = {};
				_.forEach(supportingLanguage, key => {
					newData = {
						...newData,
						...{
							[key]: data,
						},
					};
				});
			} else {
				newData = {
					[defaultLanguage]: data,
				};
			}
		} else if (!isMultilingualStructure && typeof data === 'object') {
			newData = {
				[defaultLanguage]: data,
			};
		
		}
		// the data is multilingual structure and the data should be picked by one language only
		if (options.singleLang) {
			newData = newData[defaultLanguage] || '';
		}
	// the field is turned off to single language and the current data structure is multilingual
	} else if (isMultilingualStructure) {
		// since default language field is mandatary field, this must have value
		newData = data[defaultLanguage];
	}

	return newData;
};
