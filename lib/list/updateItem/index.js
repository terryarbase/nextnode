const async = require('async');
const _ = require('lodash');
const listToArray = require('list-to-array');

const nextnode = require('./../../../');
const evalDependsOn = require('../../../fields/utils/evalDependsOn.js');
// Adds a validation message to the errors object in the common format
const {
	addValidationError,
	addFieldUpdateError,
	MONGO_INDEX_CONSTRAINT_ERROR_REGEXP,
} = require('../../common.js');


const updateItem = function(item, originalData, options, callback) {
	const newItem = item;
	// remove delegated flag update
	var data = _.omit(originalData, 'delegated');
	/* Process arguments and options */
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}
	if (!options) {
		options = {};
	}
	if (!options.__) {
		options = {
			...options,
			...{
				__: nextnode.get('i18n').__,
			},
		};
	}
	// console.log("nextnode.get('i18n').t: ", nextnode.get('i18n'));
	// update fields with noedit: true set if fields have been explicitly
	// provided, or if the ignoreNoEdit option is true
	var ignoreNoEdit = !!(options.fields || options.ignoreNoEdit);

	/*
	** get support language set
	** [******19/11/2018 Deprecated********]
	*/
	// var supportedLanguages = [];
	// if (options.isMultilingual && options.supportLang) {
	// 	supportedLanguages = _.keys(options.supportLang);
	// }
	// fields defaults to all the fields in the list
	var fields = options.fields || this.fieldsArray;
	// console.log('>>>>>>fields: ', fields);
	// fields can be a list or array of field paths or Field instances
	fields = listToArray(fields).map(function (field) {
		// TODO: Check that field is an instance of Field
		const newField = (typeof field === 'string') ? this.fields[field] : field;
		newField.setOptions({
			// the field is multilingual and the keystone is opened for localization
			isMultilingual: field.options.multilingual && options.isMultilingual,
			defaultLang: options.defaultLang,
			lang: options.lang,
		});
		
		/*
		** [******19/11/2018 Deprecated********]
		** [IMPORTANT] may be the field is turned from single lingual to multilingual
		** adjust the multilingual if it was single lingual before
		** convert the single string value to multilingual object structure just in case
		** suppose the related data should be followed the multilingual object structure
		** e.g { en: '', de: '' }
		** Terry Chan
		*/
		// if (options.isMultilingual) {
		// 	if (newField.options.isMultilingual) {
		// 		var currentData = data[field.path];
		// 		if (typeof currentData === 'string') {
		// 			currentData = {
		// 				[options.defaultLang]: currentData,
		// 			};
		// 		} else if (typeof currentData === 'object') {
		// 			const currentDataKeys = _.keys(currentData);
					 
		// 			** for validataion it is not a multilingual object structure, may be File object
		// 			** the file field also object notation
					
		// 			const intersectionKeys = _.intersection(supportedLanguages, currentDataKeys);
		// 			if (!intersectionKeys.length) {
		// 				currentData = {
		// 					[options.defaultLang]: currentData,
		// 				};
		// 			}
		// 		}
		// 		data = {
		// 			...data,
		// 			...{
		// 				[field.path]: currentData,
		// 			},
		// 		};
		// 	}
		// }
		return newField;
	}, this);
	// check for invalid fields
	if (fields.indexOf(undefined) >= 0) {
		return callback({
			error: options.__('title_invalid_configuration') || 'invalid configuration',
			detail: options.__('msg_invalid_path_update', {
				field: options.fields,
				key: this.key,
			}) || 'Invalid path specified in fields to update [' + options.fields + '] for list ' + this.key,
		});
	}

	// Strip out noedit fields
	if (!ignoreNoEdit) {
		fields = fields.filter(function (i) {
			return !i.noedit;
		});
	}

	// you can optionally require fields that aren't required in the schema
	// note that if fields are required in the schema, they will always be checked
	//
	// this option supports the backwards compatible { path: true } format, or a
	// list or array of field paths to validate
	var requiredFields = options.required;
	var requiredFieldPaths = {};
	if (typeof requiredFields === 'string') {
		requiredFields = listToArray(requiredFields);
	}
	if (Array.isArray(requiredFields)) {
		requiredFields.forEach(function (path) {
			requiredFieldPaths[path] = true;
		});
	} else if (typeof requiredFields === 'object') {
		requiredFieldPaths = requiredFields;
	}

	// turn multlingual object to signle string field with path key
	function getFieldDefaultInputData (field, data) {
		const currentData = data[field.path];
		// console.log(data);
		return {
			[field.path]: currentData && currentData[options.defaultLang],
		}
	}
	function getFieldRestInputData (field, data) {
		// remove default language and get the valid language from supporting lanugages
		// remove any useless property of multilingual value object
		if (data[field.path]) {
			return _.omit(data[field.path], [options.defaultLang])
		}
		return null;
	}
	// function getFieldInputData (field, data) {
	// 	if (data[field.path]) {
	// 		return _.intersection(
	// 			supportedLanguages,
	// 			_.keys(data[field.path]),
	// 		);
	// 	}
	// 	return null;
	// }
	/* Field Validation */
	// TODO: If a field is required but not specified in the provided fields array
	// we should explicitly include it in the set of fields to validate
	// 
	var validationErrors = {};
	function doFeildsValidation (field, newData, info={}, callback) {
		// console.log(field.path, newData);
		field.validateInput(newData, function(valid, detail) {
			if (!valid) {
			    addValidationError({ ...options, ...info }, validationErrors, field, 'invalid', detail);
			    callback();
			} else if ((field.required || requiredFieldPaths[field.path]) &&
			    (!field.dependsOn || evalDependsOn(field.dependsOn, data))) {
				var newItem = { ...item };
				if (info.lang && item[field.path] && item[field.path][info.lang]) {
					newItem = item[field.path][info.lang];
				}
			    field.validateRequiredInput(
			    	newItem,
			    	newData,
			    function(valid, detail) {
			        if (!valid) {
			            addValidationError({ ...options, ...info }, validationErrors, field, 'required', detail);
			        }
			        callback();
			    });
			} else {
				callback();
			}
		});
	}
	function doFieldValidation (field, done) {
		// Note; we don't pass back validation errors to the callback, because we don't
		// want to break the async loop before all the fields have been validated.
		// not allow to edit the field if it is restrictDelegated field
		const restricted = field.options.restrictDelegated 
		    && item.delegated
			&& _.has(data, field.path) 
			&& String(data[field.path]) !== String(item[field.path]);
		if (restricted) {
			addValidationError(options, validationErrors, field, 'forbidden', null);
			done();	// done it if the field cannot be edited
		} else if (field.options.isMultilingual) {
			const defaultLangData = getFieldDefaultInputData(field, data);
			// do the default language input validation first, which is mandatary checking object
			doFeildsValidation(field, defaultLangData, { lang: options.defaultLang }, function() {
				const restLangData = getFieldRestInputData(field, data);
				const langData = _.keys(restLangData);
				// const langData = _.intersection(supportedLanguages, _.keys(restLangData));
				if (!langData.length) {
					return done();
				}
				const tasks = [];
				langData.forEach(function(lang) {
					// if the value is provided and then execute the validation checking
					// otherwise, also do the validation checking if it is current edit language (options.lang/req.headers.langd)
					if (
						(!_.isNil(restLangData[lang]) && !_.isNull(restLangData[lang]) && !!String(restLangData[lang])) || 
						lang === options.lang
					) {
						tasks.push(function(callback) {
							doFeildsValidation(field, {
								[field.path]: restLangData[lang],
							}, { lang }, callback);
						});
					}
				});
				if (!tasks.length) {
					return done();
				}

				async.parallel(tasks, done);
			});
		} else {	// normal field value validation
			doFeildsValidation(field, data, {}, done);
		}
	}

	/* Field Updates */
	var updateErrors = {};
	function doFieldUpdate (field, done) {
		var callback = function (err) {
			// Note; we don't pass back errors to the callback, because we don't want
			// to break the async loop before all the fields have been updated.
			if (err) {
				addFieldUpdateError(updateErrors, field, err);
			}
			done();
		};
		// all fields have (item, data) as the first two arguments
		var updateArgs = [item, data];
		// for multilingual file upload case
		// the instance is designed for one file object
		// change the logic by workaround with support lanugages set
		if (field.options.stateless && field.options.multilingual) {
			const lang = _.keys(data[field.path]);
			// const lang = _.intersection(supportedLanguages, _.keys(data[field.path]));
			if (lang.length) {
				const tasks = [];
				// console.log('>>>>', field.path, lang);
				// var fileValues = {};
				lang.forEach(function(lang) {
					tasks.push(function(cb) {
						field.updateItem.apply(field, [item, {
							[field.path]: data[field.path][lang],
							'__subPath': lang,	// consider the subpath of value
						}, options.files, cb]);
					});
				});
				if (!tasks.length) {
					callback();
				}
				async.series(tasks, function(err, results) {
					if (!err) {
						// marked for mixed type for modification
						item.markModified(field.path);
					}
					callback(err);
				});
			} else {
				callback();
			}
		// no multilingual supported
		} else {
			// some fields support an optional third argument: files
			if (field.updateItem.length > 3) {
				updateArgs.push(options.files);
			}
			// callback is always the last argument
			updateArgs.push(function() {
				item.markModified(field.path);
				callback();
			});
			field.updateItem.apply(field, updateArgs);
		}
	}

	/* Track plugin support */
	// If the track plugin is enabled for the list, it looks for ._req_user to
	// detect the user that performed the updated. Default it to the user
	// specified in the options.
	if (options.user) {
		item._req_user = options.user;
	}

	/* Flow control */
	async.series([
		/* Process validation */
		function (doneValidation) {
			async.each(fields, doFieldValidation, function (err) {
				if (Object.keys(validationErrors).length) {
					return doneValidation({
						error: options.__('title_validation_error') || 'Validation Errors',
						detail: validationErrors,
					});
				}
				doneValidation();
			});
		},
		/* Apply updates to fields */
		function (doneUpdate) {
			async.each(fields, doFieldUpdate, function () {
				if (Object.keys(updateErrors).length) {
					return doneUpdate({
						error: options.__('title_field_error') || 'Field Errors',
						detail: updateErrors,
					});
				}
				item.save(doneUpdate);
			});
		},
	],

	/* Done */
	function (err) {
		if (err) {
			if (err instanceof Error) {
				// Try to make mongoose index constraint errors more friendly
				// This is brittle, but should return a more human-readable error message
				if (err.code === 11000) {
					var indexConstraintError = MONGO_INDEX_CONSTRAINT_ERROR_REGEXP.exec(err.errmsg);
					if (indexConstraintError) {
						var probableFieldPath = indexConstraintError[1];
						probableFieldPath = probableFieldPath.substr(0, probableFieldPath.lastIndexOf('_'));
						return callback({
							error: 'database error',
							detail: 'Duplicate ' + probableFieldPath + ' value "' + indexConstraintError[2] + '" already exists',
						});
					}
				}
				// Wrap Error objects in the standard format, they're most likely
				// a database error (not sure if we can make this more specific?)
				return callback({
					error: 'database error',
					detail: err,
				});
			} else {
				// Return other error object directly
				return callback(err);
			}
		}
		return callback();
	});
};

module.exports = updateItem;
