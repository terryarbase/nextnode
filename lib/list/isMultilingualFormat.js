const _ = require('lodash');
/**
 * Check and get the field value is multilingual format
 */

function isMultilingualFormat (value, supportingLanguage) {
	const supports = supportingLanguage || this.initialSupportLang;
	const types = this.keystone.Field.Types;
	const validLang = [];
	if (typeof value === 'object') {
		return _.intersection(supports, _.keys(value));
	}
	return [];
}

module.exports = isMultilingualFormat;
