/**
 * Check whether or not a `path` is a reserved path. This restricts the use
 * of `Object.prototype` method keys as well as internal mongo paths.
 */

const reverseSystemIdentity = {
	'system-identities': 'SystemIdentity',
};

function isReserved (path) {
	return reverseSystemIdentity[path];
}

module.exports = isReserved;
