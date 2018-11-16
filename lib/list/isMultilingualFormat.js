const _ = require('lodash');
/**
 * Check whether or not field is supporting multilingual
 */

function isMultilingualFormat (value) {
	const types = this.keystone.Field.Types;
	const multilingualShortCode = [
                'en',
                'zhtw', 
                'zh',
	];
	return (typeof value === 'string') || 
		(typeof value === 'object' && _.intersection(multilingualShortCode, _.keys(value)));
}

module.exports = isMultilingualFormat;
