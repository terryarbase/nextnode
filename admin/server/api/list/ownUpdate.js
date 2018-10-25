/*
TODO: Needs Review and Spec
*/

var async = require('async');

module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}

	req.list.model.findById(req.user._id, function (err, item) {
		if (err) res.apiError(500, err);
		if (!item) res.apiError(404, 'User not found');
		req.list.updateItem(item, req.body, { user: req.user }, function (err) {
			if (err) {
				var status = err.error === 'validation errors' ? 400 : 500;
				var error = err.error === 'database error' ? err.detail : err;
				return res.apiError(status, error);
			}
			res.json(req.list.getData(item));
		});
	});

};
