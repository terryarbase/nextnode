const _ = require('lodash');
/**
 * Check and get the field value is multilingual format
 */

function isMultilingualFormat (value) {
	const types = this.keystone.Field.Types;
	const multilingualShortCode = [
                'en',
                'zhtw', 
                'zhcn',
	];
	const validLang = typeof value === 'object' && _.intersection(multilingualShortCode, _.keys(value));
	return validLang.length ? validLang : [];
}

module.exports = isMultilingualFormat;
