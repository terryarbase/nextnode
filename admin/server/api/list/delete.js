var async = require('async');
const _ = require('lodash');

module.exports = function (req, res) {
	if (req.nextnode.get('stage') < 2) {
		var keystone = req.keystone;
		if (!keystone.security.csrf.validate(req)) {
			console.log('Refusing to delete ' + req.list.key + ' items; CSRF failure');
			return res.apiError(403, req.t.__('msg_invalid_csrf'));
		}
	}
	if (req.list.get('nodelete')) {
		console.log('Refusing to delete ' + req.list.key + ' items; List.nodelete is true');
		return res.apiError(400, req.t.__('msg_nodelete_permission'));
	}
	var ids = req.body.ids || req.body.id || req.params.id;
	if (typeof ids === 'string') {
		ids = ids.split(',');
	}
	if (!Array.isArray(ids)) {
		ids = [ids];
	}

	// if (req.user) {
	// 	var checkResourceId = (keystone.get('user model') === req.list.key);

	// 	var userId = String(req.user.id);
	// 	// check if user can delete this resources based on resources ids and userId
	// 	if (checkResourceId && ids.some(function (id) {
	// 		return id === userId;
	// 	})) {
	// 		console.log('Refusing to delete ' + req.list.key + ' items; ids contains current User id');
	// 		return res.apiError(403, req.t.__('title_notallowed'), req.t.__('msg_delete_yourself'));
	// 	}
	// }
	var deletedCount = 0;
	var deletedIds = [];
	// console.log(req.permissionQuery);
	req.list.model.find({
		...req.permissionQuery,
	}).where('_id').in(ids).exec(function (err, results) {
		// console.log(req.t.locale);
		if (err) {
			console.log('Error deleting ' + req.list.key + ' items:', err);
			return res.apiError(req.t.__('msg_db_error_withoutReason'), err);
		}
		// const entries = _.filter(results, r => r.delegated)
		async.forEachLimit(results, 10, function (item, next) {
	
			if (!!item.delegated) {
				return next();
			}

			/* Track plugin support */
			// If the track plugin is enabled for the list, it looks for ._req_user to
			// detect the user that performed the updated.
			item._req_user = req.user;
			
			item.remove(function (err) {
				if (err) return next(err);
				deletedCount++;
				deletedIds.push(item.id);
				return next();
			});
		}, function () {
			return res.json({
				success: true,
				ids: deletedIds,
				count: deletedCount,
			});
		});
	});
};
