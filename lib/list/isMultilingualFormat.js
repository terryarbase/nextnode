const _ = require('lodash');
/**
 * Check and get the field value is multilingual format
 */

function isMultilingualFormat (value, supportingLanguage) {
	const types = this.keystone.Field.Types;
	const validLang = [];
	if (typeof value === 'object') {
		return _.intersection(supportingLanguage, _.keys(value));
	}
	return [];
}

module.exports = isMultilingualFormat;
