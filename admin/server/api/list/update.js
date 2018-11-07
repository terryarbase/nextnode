const async = require('async');
// const _ = require('lodash'); 
// /*
// ** Revamped Version to use await promise
// ** Terry Chan
// ** 07/11/2018
// */

const isJson = param => {
	var data;
    try {
        data = JSON.parse(param);
    } catch (e) {
    	data = param;
    }
    return data;
}

// const updateIt = async(req, data) => {
// 	const param = isJson(data);
// 	if (param && param.id) {
// 		const { id } = param;

// 		var item;
// 		// check for existing item
// 		try {
// 			item = await req.list.model.findById(id);
// 		} catch (err) {
// 			throw { statusCode: 500, error: 'database error', detail: err, id, };
// 		}
// 		if (!item) throw { statusCode: 404, error: 'not found', id };

// 		// update the items
// 		var err;
// 		const { query, files, user } = req;
// 		try {
// 			err = await req.list.updateItems(req.list, item, data, { files, user });
// 		} catch (error) {
// 			console.log('error>>>>>', error);
// 		}
// 		if (err) {
// 			err = {
// 				...err,
// 				...{
// 					id,
// 					statusCode: err.error === 'validation errors' ? 400 : 500,
// 				},
// 			};
// 			throw err;
// 		}
// 		console.log('>>>>>> ', query.returnData ? list.getData(item) : id);
// 		return query.returnData ? list.getData(item) : id;
// 	}
// 	return null;
// }

// const updateItems = async (req, res) => {
// 	var keystone = req.keystone;
// 	if (!keystone.security.csrf.validate(req)) {
// 		return res.apiError(403, 'invalid csrf');
// 	}

// 	const { 
// 		body: {
// 			items = [],
// 		},
// 	} = req;
// 	// var updateCount = 0;
// 	const tasks = _.map(items, data => updateIt(req, data));
// 	try {
// 		const items = await Promise.all(tasks);
// 		res.json({
// 			success: true,
// 			items,
// 		});
// 	} catch (err) {
// 		if (err.statusCode) {
// 			res.status(err.statusCode);
// 		}
// 		res.json(err);
// 	}
// };

// module.exports = updateItems;
module.exports = function (req, res) {
	async.map(req.body.items, function (param, done) {
		var data = isJson(param);
		req.list.model.findById(data.id, function (err, item) {
			if (err) return done({ statusCode: 500, error: 'database error', detail: err, id: data.id });
			if (!item) return done({ statusCode: 404, error: 'not found', id: data.id });
			req.list.updateItem(item, data, { files: req.files, user: req.user }, function (err) {
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
