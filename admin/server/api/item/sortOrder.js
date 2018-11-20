/*
TODO: Needs Review and Spec
*/

var getList = require('../list/get');

module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		console.log('Refusing to reorder ' + req.list.key + ' ' + req.params.id + '; CSRF failure');
		return res.apiError(403, req.t.__('msg_invalid_csrf'));
	}
	req.list.model.reorderItems(req.params.id, req.params.sortOrder, req.params.newOrder, function (err) {
		if (err) return res.apiError(req.t.__('msg_db_error_withoutReason'), err);
		return getList(req, res);
	});
};
