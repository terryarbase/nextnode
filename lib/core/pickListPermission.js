/**
 * Return the list permission value
 *
 * @param {Object} permission
 * @return {Object}
 */

const _ = require('lodash');

module.exports = function pickListPermission (permission) {
	const nextNode = this;
	if (typeof permission.toObject === 'function') {
		permission = permission.toObject();
	}
	return _.pick(permission, nextNode.reservedPermissionKeyList());
};