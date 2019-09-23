const _		= require('lodash');

function declareCustomizedOption (nextNode, field) {
	let extraFields = {};
    _.forOwn(field, (schema, f) => {
        let newSchema = { ...schema };
        if (schema.options && typeof schema.options === 'object') {
            newSchema = {
                ...schema,
                options: new nextNode.Options.customized(
                    schema.options.options,
                    schema.options.lang,
                ).getSectionValues()
            }
        }
        extraFields = {
            ...extraFields,
            [f]: newSchema,
        }
    });
	return extraFields;
}

module.exports = declareCustomizedOption;
