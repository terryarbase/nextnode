const _ = require('lodash');
const nextnode = require('./../');

const MONGO_INDEX_CONSTRAINT_ERROR_REGEXP = /E11000 duplicate key error index\: [^\$]+\$(\w+) dup key\: \{ \: "([^"]+)" \}/;

const specialMessage = (field, type) => {
	const {
		type: fieldType,
	} = field;

	switch (fieldType) {
		case 'file':
		case 'cloudinaryimage':
			return `msg_${type}_file_field`;
		case 'date':
		case 'datetime':
		case 'datearray':
		case 'datetimerange':
		case 'daterange':
			return `msg_${type}_date_field`;
		case 'relationship':
		case 'select':
			return `msg_${type}_object_field`;
		case 'list':
			return `msg_${type}_item_field`;
		default:
			return `msg_${type}_field`;
	}
}

//msg_required_field
// Adds a validation message to the errors object in the common format
const addValidationError = (options, errors, field, type, detail) => {
	// const langd = nextnode.get('langf');
	// const langPack = nextnode.get('language pack');
	// const messagePack = require(`./../locales/langs/${langd}.json`);
	// const clientLangPack = require(`./../admin/client/App/locale/pack/${langd}`);
	// console.log(clientLangPack);
	if (detail instanceof Error) {
		detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
	}
	const fieldMultinlingual = _.get(options, 'field.options.isMultilingual');
	var error = '';

	if (typeof detail === 'string') {
		error = detail;
	} else {
		if (type === 'required' && options.requiredMessages && options.requiredMessages[field.path]) {
			error = options.requiredMessages[field.path];
		} else if (type === 'invalid' && options.invalidMessages && options.invalidMessages[field.path]) {
			error = options.invalidMessages[field.path];
		} else {
			// const field = field.path.substr(0, 1).toUpperCase() + field.path.substr(1);
			error = options.__(specialMessage(field, type));
		}
	}

	// errors[field.path] = `${options.lang ? `(${options.lang}) `: ''}${error}`;

	if (fieldMultinlingual && !!options.lang) {
		errors[field.path] = {
			...errors[field.path],
			[options.lang]: error,
		};
	} else {
		errors[field.path] = error;
	}
	// console.log(error);
};

// Adds a field update error message to the errors object in the common format
const addFieldUpdateError = (options, errors, field, detail) => {
	if (detail instanceof Error) {
		detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
	}
	const fieldMultinlingual = _.get(options, 'field.options.isMultilingual');
	const error = typeof detail === 'string' ? detail : options.__('msg_update_error');
	if (fieldMultinlingual && !!options.lang) {	// if the field is turned on multilingual
		errors[field.path] = {
			...errors[field.path],
			[options.lang]: error,
		};
	} else {
		errors[field.path] = error;
	}
}

module.exports = {
	MONGO_INDEX_CONSTRAINT_ERROR_REGEXP,
	addFieldUpdateError,
	addValidationError,
};
