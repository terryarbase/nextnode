const _ = require('lodash');

module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	const { body, locales, list: { options: { multilingual }, fields } } = req;
	var newData = {};
	/*
	** if turn on localization and the list is supporting multilingual
	** then convert the multilingual field to json object also
	*/
	if (locales && multilingual && _.keys(body).length) {
		_.forOwn(body, (b, key) => {
			if (fields[key].options.multilingual) {
				newData = {
					...newData,
					...{
						[key]: req.list.convertJson(b),
					},
				};
			}
		});
	} else {
		newData = { ...body };
	}
	// console.log('>>>>> ', newData);
	const item = new req.list.model();
	req.list.updateItem(item, body, {
		files: req.files,
		ignoreNoEdit: true,
		user: req.user,
		lang: locales && locales.langd,
		isMultilingual: !!locales,
		defaultLang: locales && locales.defaultLanguage,
	}, function (err) {
		if (err) {
			var status = err.error === 'validation errors' ? 400 : 500;
			var error = err.error === 'database error' ? err.detail : err;
			return res.apiError(status, error);
		}
		res.json(req.list.getData(item));
	});
};
