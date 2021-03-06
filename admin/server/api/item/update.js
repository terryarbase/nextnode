const _ = require('lodash');

module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, req.t.__('msg_invalid_csrf'));
	}
	const { params: { id }, body, locales } = req;
	// locales, list: { options: { multilingual }, fields } } = req;
	const newData = req.list.prepareCorrectParam(body);

	req.list.model.findOne({
		_id: keystone.mongoose.Types.ObjectId(id),
		...req.permissionquery,
	}, function (err, item) {

		if (err) return res.status(500).json({ error: req.t.__('msg_db_error_withoutReason'), detail: err });
		if (!item) return res.status(404).json({ error: req.t.__('msg_user_notfound'), id });
		const options = {
			files: req.files,
			user: req.user,
			lang: locales && locales.langd,
			__: req.t.__,
			isMultilingual: !!locales,
			defaultLang: locales && locales.defaultLanguage,
			supportLang: locales && locales.localization,
			frontLang: locales && locales.frontLang,
		};
		req.list.updateItem(item, newData, options, function (err) {
			if (err) {
				var status = err.error === 'validation errors' ? 400 : 500;
				let error = err;
				if (err.error === 'database error' && err.detail && err.detail.errors) {
					error = {
						...err,
						detail: _.map(err.detail.errors, e => {
							return `[${e.path}] : ${e.message}`;
						}).join(', ')
					}
				}
				return res.apiError(status, error);
			}
			// Reload the item from the database to prevent save hooks or other
			// application specific logic from messing with the values in the item
			req.list.model.findById(id, function (err, updatedItem) {
				/*
				** pass options to format the data structure if needed
				*/
				res.json(req.list.getData(updatedItem, undefined, null, options));
			});
		});
	});
};
