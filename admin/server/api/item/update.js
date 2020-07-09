const _ = require('lodash');

module.exports = async function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, req.t.__('msg_invalid_csrf'));
	}
	const { params: { id }, body, locales } = req;
	// locales, list: { options: { multilingual }, fields } } = req;
	const newData = req.list.prepareCorrectParam(body);

	let doc = null
	try {
		doc = await req.list.model.findOne({
			_id: keystone.mongoose.Types.ObjectId(id),
			...req.permissionquery,
		});

		if (!doc) {
			return res.status(404).json({ error: req.t.__('msg_user_notfound'), id });
		}
	} catch (err) {
		return res.status(500).json({ error: req.t.__('msg_db_error_withoutReason'), detail: err });
	}
	
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

	// trigger before update list hook
	const [bsError] = await req.list.applyHook('beforeSave', doc, newData, { req });
	if (bsError) return res.apiError(406, 'database error', bsError);

	const [buError] = await req.list.applyHook('beforeUpdate', doc, newData, { req });
	if (buError) return res.apiError(406, 'database error', buError);

	req.list.updateItem(doc, newData, options, async function (err) {
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

		// Reload the item from the database to prevent save hooks or other
		// application specific logic from messing with the values in the item
		const updatedDoc = await req.list.model.findById(id);

		// trigger after update list hook
		const [asError] = await req.list.applyHook('afterSave', updatedDoc, { req });
		if (asError) return res.apiError(406, 'database error', asError);

		const [auError] = await req.list.applyHook('afterUpdate', updatedDoc, { req });
		if (auError) return res.apiError(406, 'database error', auError);

		/*
		** pass options to format the data structure if needed
		*/
		res.json(req.list.getData(updatedDoc, undefined, null, options));
	});

	// req.list.model.findOne({
	// 	_id: keystone.mongoose.Types.ObjectId(id),
	// 	...req.permissionquery,
	// }, function (err, item) {

	// 	if (err) return res.status(500).json({ error: req.t.__('msg_db_error_withoutReason'), detail: err });
	// 	if (!item) return res.status(404).json({ error: req.t.__('msg_user_notfound'), id });
	// 	const options = {
	// 		files: req.files,
	// 		user: req.user,
	// 		lang: locales && locales.langd,
	// 		__: req.t.__,
	// 		isMultilingual: !!locales,
	// 		defaultLang: locales && locales.defaultLanguage,
	// 		supportLang: locales && locales.localization,
	// 		frontLang: locales && locales.frontLang,
	// 	};

	// 	// apply assign req data hook before save
	// 	newData = req.list.applyHook('preSave', item, newData, { req });

	// 	req.list.updateItem(item, newData, options, function (err) {
	// 		if (err) {
	// 			var status = err.error === 'validation errors' ? 400 : 500;
	// 			let error = err;
	// 			if (err.error === 'database error' && err.detail && err.detail.errors) {
	// 				error = {
	// 					...err,
	// 					detail: _.map(err.detail.errors, e => {
	// 						return `[${e.path}] : ${e.message}`;
	// 					}).join(', ')
	// 				}
	// 			}
	// 			return res.apiError(status, error);
	// 		}
	// 		// Reload the item from the database to prevent save hooks or other
	// 		// application specific logic from messing with the values in the item
	// 		req.list.model.findById(id, function (err, updatedItem) {
	// 			/*
	// 			** pass options to format the data structure if needed
	// 			*/
	// 			res.json(req.list.getData(updatedItem, undefined, null, options));
	// 		});
	// 	});
	// });
};
