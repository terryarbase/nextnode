/**
 * Check whether or not a field is a invalid multilingual
 */

function isBlockingMultilingual (type) {
	const types = this.keystone.Field.Types;
	const blockingType = [
		types.Datetime.name,
        types.Password.name,
	];
	return blockingType.indexOf(type) >= 0;
}

module.exports = isBlockingMultilingual;
