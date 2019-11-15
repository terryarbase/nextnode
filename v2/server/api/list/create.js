const _ = require('lodash');

const create = async ({
    nextnode,
    req,
    res,
}) => {
	const { body, locales, list: { options: { multilingual, nolist }, fields } } = req;
	req.list.prepareDataPermission(req, body);
	const newData = req.list.prepareCorrectParam(body);
		
	const item = new req.list.model();
	const options = {
		files: req.files,
		ignoreNoEdit: true,
		user: req.user,
		__: req.__,
		lang: locales && locales.langd,
		uiLang: locales && locales.langf,
		isMultilingual: !!locales,
		defaultLang: locales && locales.defaultLanguage,
		supportLang: locales && locales.localization,
	};
	req.list.updateItem(item, newData, options, function (err) {
		if (err) {
			var status = err.status === 'validation errors' ? 406 : 500;
			var error = err.status === 'database error' ? err.detail : err;
			return res.apiError(status, err);
		}
		res.json(req.list.getData(item, undefined, null, options));
	});
};

module.exports = create;

