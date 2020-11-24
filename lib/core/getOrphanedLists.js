var _ = require('lodash');

/**
 * Retrieves orphaned lists (those not in a nav section)
 */

function getOrphanedLists (permission) {
	if (!this.nav) {
		return [];
	}
	return _.filter(this.lists, function (list, key) {
		if (list.get('hidden')) return false;
		if (permission && permission[list.key] === 0) return false;
		return (!this.nav.by.list[key]) ? list : false;
	}.bind(this));
}

module.exports = getOrphanedLists;
