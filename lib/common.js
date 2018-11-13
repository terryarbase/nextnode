const MONGO_INDEX_CONSTRAINT_ERROR_REGEXP = /E11000 duplicate key error index\: [^\$]+\$(\w+) dup key\: \{ \: "([^"]+)" \}/;

// Adds a validation message to the errors object in the common format
const addValidationError = (options, errors, field, type, detail) => {
	if (detail instanceof Error) {
		detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
	}
	var error = '';
	if (typeof detail === 'string') {
		error = detail;
	} else {
		if (type === 'required' && options.requiredMessages && options.requiredMessages[field.path]) {
			error = options.requiredMessages[field.path];
		} else if (type === 'invalid' && options.invalidMessages && options.invalidMessages[field.path]) {
			error = options.invalidMessages[field.path];
		} else {
			error = field.path.substr(0, 1).toUpperCase() + field.path.substr(1) + ' is ' + type;
		}
	}
	errors[field.path] = {
		type: type,
		// TODO modify it when doing adminUI multlingual for better msg handling
		error: `${options.lang ? `(${options.lang}) `: ''}${error}`,
		lang: options.lang,
		detail: typeof detail === 'object' ? detail : undefined,
		fieldLabel: field.label,
		fieldType: field.type,
	};
};

// Adds a field update error message to the errors object in the common format
const addFieldUpdateError = (errors, field, detail) => {
	if (detail instanceof Error) {
		detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
	}
	errors[field.path] = {
		error: typeof detail === 'string' ? detail : field.path + ' error',
		detail: typeof detail === 'object' ? detail : undefined,
		fieldLabel: field.label,
		fieldType: field.type,
	};
}

module.exports = {
	MONGO_INDEX_CONSTRAINT_ERROR_REGEXP,
	addFieldUpdateError,
	addValidationError,
};
