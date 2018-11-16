const _ = require('lodash');

module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	const { params: { id }, body, locales, list: { options: { multilingual }, fields } } = req;
	var newData = {};
	/*
	** if turn on localization and the list is supporting multilingual
	** then convert the multilingual field to json object also
	*/
	if (locales && multilingual && _.keys(body).length) {
		_.forOwn(body, (b, key) => {
			if (fields[key] && fields[key].options.multilingual) {
				newData = {
					...newData,
					...{
						[key]: req.list.convertJson(b),
					},
				};
			} else {
				newData = {
					...newData,
					...{
						[key]: b,
					},
				};
			}
		});
	} else {
		newData = { ...body };
	}
	req.list.model.findById(req.params.id, function (err, item) {
		if (err) return res.status(500).json({ error: 'database error', detail: err });
		if (!item) return res.status(404).json({ error: 'not found', id: req.params.id });
		req.list.updateItem(item, newData, {
			files: req.files,
			user: req.user,
			lang: locales && locales.langd,
			isMultilingual: !!locales,
			defaultLang: locales && locales.defaultLanguage,
			supportLang: locales && locales.localization,
		}, function (err) {
			if (err) {
				var status = err.error === 'validation errors' ? 400 : 500;
				var error = err.error === 'database error' ? err.detail : err;
				return res.apiError(status, error);
			}
			// Reload the item from the database to prevent save hooks or other
			// application specific logic from messing with the values in the item
			req.list.model.findById(req.params.id, function (err, updatedItem) {
				res.json(req.list.getData(updatedItem));
			});
		});
	});
};
