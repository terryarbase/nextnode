const _ = require('lodash');

module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, req.t.__('msg_invalid_csrf'));
	}
	const { body, locales, list: { options: { multilingual, nolist }, fields } } = req;
	// var newData = {};
	const newData = req.list.prepareCorrectParam(body);
		
	const item = new req.list.model();
	const options = {
		files: req.files,
		ignoreNoEdit: true,
		user: req.user,
		__: req.t.__,
		lang: locales && locales.langd,
		isMultilingual: !!locales,
		defaultLang: locales && locales.defaultLanguage,
		supportLang: locales && locales.localization,
	};
	req.list.updateItem(item, newData, options, function (err) {
		if (err) {
			var status = err.error === 'validation errors' ? 400 : 500;
			const error = err.error === 'database error' ? req.t.__('msg_db_error_without', {
					reason: err.detail,
				}) : err;
			return res.apiError(status, error);
		}
		res.json(req.list.getData(item, undefined, null, options));
	});
};
