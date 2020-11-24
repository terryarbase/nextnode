/**
 * Return the lists permission value from user's permission data
 *
 * @param {Object} userPermission
 * @return {Object}
 */

const _ = require('lodash');

module.exports = function filterListsPermission (userPermission) {
	const nextNode = this;
    const lists = _.keys(nextNode.lists);
	if (typeof userPermission.toObject === 'function') {
		userPermission = userPermission.toObject();
	}
	return _.pick(userPermission, lists);
};