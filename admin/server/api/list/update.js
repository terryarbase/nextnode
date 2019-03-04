const async = require('async');


module.exports = function (req, res) {
	async.map(req.body.items, function (param, done) {
		var data = req.list.convertJson(param);
		req.list.model.findById(data.id, function (err, item) {
			if (err) return done({
				statusCode: 500,
				error: req.t.__('msg_db_error_withoutReason'),
				detail: err,
				id: data.id,
			});
			if (!item) return done({
				statusCode: 404,
				error: req.t.__('msg_user_notfound'),
				id: data.id,
			});
			
			console.log(item);
				
			req.list.updateItem(item, data, {
				ignoreNoEdit: true,
				files: req.files,
				user: req.user,
				__: req.t.__,
			}, function (err) {
				if (err) {
					err.id = data.id;
					// validation errors send http 400; everything else sends http 500
					err.statusCode = err.error === 'validation errors' ? 400 : 500;
					return done(err);
				}
				// updateCount++;
				done(null, req.query.returnData ? req.list.getData(item) : item.id);
			});
		});
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
