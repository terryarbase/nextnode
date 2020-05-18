/**
 * Return the fields permission value from list's permission data
 *
 * @param {Object} listPermission
 * @return {Object}
 */

const _ = require('lodash');

module.exports = function filterFieldsPermission (listPermission) {
    const nextNode = this;
	const permissionKeyList = nextNode.reservedPermissionKeyList();
	if (typeof listPermission.toObject === 'function') {
		listPermission = listPermission.toObject();
    }
	return _.pickBy(listPermission, (p, field) => !_.includes(permissionKeyList, field));
};