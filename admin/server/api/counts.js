const async = require('async');

module.exports = function (req, res) {
	const keystone = req.keystone;
	let counts = {};
	const permissionQueries = req.permissionQuery || {};
	let conditions = {};
	// console.log(permissionQueries);
	async.each(keystone.lists, function (list, next) {
		if (permissionQueries[list.key]) {
			conditions = { ...permissionQueries[list.key] };
		}
		list.model.count(conditions, function (err, count) {
			counts[list.key] = count;
			next(err);
		});
	}, function (err) {
		if (err) return res.apiError('database error', err);
		return res.json({
			counts: counts,
		});
	});
};
