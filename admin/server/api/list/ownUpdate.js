/*
TODO: Needs Review and Spec
*/

var async = require('async');

module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, req.t.__('msg_invalid_csrf'));
	}

	req.list.model.findById(req.user._id, function (err, item) {
		if (err) res.apiError(req.t.__('msg_db_error_withoutReason'), err);
		if (!item) res.apiError(404, req.t.__('msg_user_notfound'));
		req.list.updateItem(item, req.body, { user: req.user, __: req.t.__ }, function (err) {
			if (err) {
				var status = err.error === 'validation errors' ? 400 : 500;
				const error = this.req.t.__('msg_db_error', {
	                reason: err.error === 'database error' ?  err.detail : err
	            });
				return res.apiError(status, error);
			}
			res.json(req.list.getData(item));
		});
	});

};
