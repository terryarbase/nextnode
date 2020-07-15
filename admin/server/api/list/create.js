const _ = require('lodash');

module.exports = async function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, req.t.__('msg_invalid_csrf'));
	}
	const { body, locales, list: { options: { multilingual, nolist }, fields } } = req;
	req.list.prepareDataPermission(req, body);
	let newData = req.list.prepareCorrectParam(body);
	/*
	** How to check the field permission like this
	{
		redeemAt_date: '2020-07-10',
		redeemAt_time: '6:14:10 pm',
		redeemAt_tzOffset: '+08:00',
	}
	*/
	// newData = _.pick(newData, req.permissionAllowFields);
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

	// trigger before create list hook
	const [bsError] = await req.list.applyHook('beforeSave', item, newData, { req });
	if (bsError) return res.apiError(406, 'database error', bsError);

	const [bcError] = await req.list.applyHook('beforeCreate', item, newData, { req });
	if (bcError) return res.apiError(406, 'database error', bcError);
	
	req.list.updateItem(item, newData, options, async function (err) {
		if (err) {
			var status = err.error === 'validation errors' ? 400 : 500;
			let error = err;
			if (err.error === 'database error' && err.detail && err.detail.errors) {
				/* mongoose error */
				error = {
					...err,
					detail: _.map(err.detail.errors, e => {
						return `[${e.path}] : ${e.message}`;
					}).join(', ')
				}
			} else if (err.status === 'validation errors') {
				/* nextnode validation error */
				error = {
					error: 'database error',
					detail: _.map(err.error, (message, path) => {
						return `[${path}] : ${message}`;
					}).join(', ')
				}
			}
			return res.apiError(status, error);
		}

		// trigger after create list hook
		const [asError] = await req.list.applyHook('afterSave', item, { req });
		if (asError) return res.apiError(406, 'database error', asError);

		const [acError] = await req.list.applyHook('afterCreate', item, newData, { req });
		if (acError) return res.apiError(406, 'database error', acError);

		res.json(req.list.getData(item, undefined, null, options));
	});
};
