const async = require('async');
const _ 	= require('lodash');

module.exports = function (req, res) {
	const keystone = req.keystone;
	async.map(req.body.items, function (param, done) {
		const updateItem = async () => {
			param = req.list.convertJson(param);
			req.list.prepareDataPermission(req, param);

			let doc = null
			try {
				doc = await req.list.model.findOne({
					_id: keystone.mongoose.Types.ObjectId(param.id),
					...req.permissionquery,
				});

				if (!doc) {
					return done({
						statusCode: 404,
						error: req.t.__('msg_user_notfound'),
						id: param.id,
					});
				}
			} catch (err) {
				return done({
					statusCode: 500,
					error: req.t.__('msg_db_error_withoutReason'),
					detail: err,
					id: param.id,
				});
			}

			// trigger before update list hook
			const [bsError] = await req.list.applyHook('beforeSave', doc, param, { req });
			if (bsError) return done({
				statusCode: 406,
				error: bsError,
			});

			const [buError] = await req.list.applyHook('beforeUpdate', doc, param, { req });
			if (buError) return done({
				statusCode: 406,
				error: buError,
			});

			const options = {
				ignoreNoEdit: true,
				files: req.files,
				fields: req.permissionAllowFields,
				user: req.user,
				fields: _.keys(param).filter(f => f !== '_id'),
				__: req.t.__,
			};

			req.list.updateItem(doc, param, options, async function (err) {
				if (err) {
					err.id = param.id;
					// validation errors send http 400; everything else sends http 500
					err.statusCode = err.error === 'validation errors' ? 400 : 500;
					return done(err);
				}

				// trigger after update list hook
				const [asError] = await req.list.applyHook('afterSave', doc, { req });
				if (asError) return done({
					statusCode: 406,
					error: asError,
				});

				const [auError] = await req.list.applyHook('afterUpdate', doc, { req });
				if (auError) return done({
					statusCode: 406,
					error: auError,
				});

				// updateCount++;
				done(null, req.query.returnData ? req.list.getData(doc) : doc.id);
			});
		}
		updateItem();

		// req.list.model.findOne({
		// 	_id: keystone.mongoose.Types.ObjectId(data.id),
		// 	...req.permissionquery,
		// }, function (err, item) {
		// 	if (err) return done({
		// 		statusCode: 500,
		// 		error: req.t.__('msg_db_error_withoutReason'),
		// 		detail: err,
		// 		id: data.id,
		// 	});
		// 	if (!item) return done({
		// 		statusCode: 404,
		// 		error: req.t.__('msg_user_notfound'),
		// 		id: data.id,
		// 	});
		// 	req.list.updateItem(item, data, {
		// 		ignoreNoEdit: true,
		// 		files: req.files,
		// 		user: req.user,
		// 		fields: _.keys(data).filter(f => f !== '_id'),
		// 		__: req.t.__,
		// 	}, function (err) {
		// 		if (err) {
		// 			err.id = data.id;
		// 			// validation errors send http 400; everything else sends http 500
		// 			err.statusCode = err.error === 'validation errors' ? 400 : 500;
		// 			return done(err);
		// 		}
		// 		// updateCount++;
		// 		done(null, req.query.returnData ? req.list.getData(item) : item.id);
		// 	});
		// });
	}, function (err, results) {
		if (err) {
			if (err.statusCode) {
				res.status(err.statusCode);
				delete err.statusCode;
			}
			return res.json(err);
		}
		 res.json({
 			success: true,
			items: results,
 		});
	});
};
