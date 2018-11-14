/**
 * Check whether or not a `path` is a reserved path. This restricts the use
 * of `Object.prototype` method keys as well as internal mongo paths.
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
