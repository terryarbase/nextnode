/**
 * Return the result which is pass the permission
 *
 * @param {Object} permission
 * @param {Object} requiredPermission
 * @return {Boolean}
 */

const _ = require('lodash');

module.exports = function isPermissionAllow (permission, requiredPermission) {
	if (typeof permission.toObject === 'function') {
		permission = permission.toObject();
	}
	const checklist = _.pick(permission, requiredPermission);
	const denied = _.some(checklist, allow => allow === false);
	return !denied
};