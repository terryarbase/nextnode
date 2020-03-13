const _        = require('lodash');
const fs       = require('fs');
const csv      = require('csv-parser');
const Promise  = require('bluebird');

function toModelData(keystone, data) {
	const {
		Types:{
			ObjectId,
		},
	} = keystone.mongoose
	const item = {
		_id: ObjectId(),
	}
	_.forEach(data, (value, path) => {
		let v = value
		if (v === 'TRUE' || v === 'true') {
			v = true
		} else if (v === 'FASLE' || v === 'false') {
			v = false
		} else if (v === 'NUll' || v === 'null') {
			v = null
		} else if (v === 'UNDEFINED' || v === 'undefined') {
			// skip the path
			return
		}
		_.set(item, path, v)
	})
	return item
}

module.exports = async function (req, res) {
	const keystone = req.keystone;
	const {
		Types:{
			ObjectId,
		},
	} = keystone.mongoose

	if (!keystone.security.csrf.validate(req)) {
		console.log('Refusing to delete ' + req.list.key + ' items; CSRF failure');
		return res.apiError(403, req.t.__('msg_invalid_csrf'));
	}
	if (req.list.get('noimport')) {
		console.log('Refusing to import ' + req.list.key + ' items; List.noimport is true');
		return res.apiError(400, req.t.__('msg_noimport_permission'));
	}

	const importFile = req.files.importFile;
	const itemArray = [];

	try {
		let readCSV = fs.createReadStream(importFile.path, 'utf8')
        .pipe(csv())
        .on('data', data => {
			const modelData = toModelData(keystone, data);
			itemArray.push(modelData);
		});

		await new Promise((resolve, reject) => {
			readCSV.on('end', () => resolve(itemArray));
			readCSV.on('error', err => reject(err));
		});
	} catch(err) {
		console.log('> [File Import] read file error', err);
		return res.apiError(req.t.__('msg_db_error_withoutReason'), err);
	}

    try {
		console.log(`> [File Import] start insert ${itemArray.length} entry`)
		// Save data for 20 process each round
		const insertResult = await Promise.mapSeries(itemArray, async item => {
			const entry = new req.list.model(item)
			return await entry.save()
		}, { concurrency: 20 })

		console.log(`> [File Import] completed with ${insertResult.length} entry`)
		return res.json({
			success: true,
			count: insertResult.length,
		});
    } catch (err) {
		console.log('> [File Import] insert error', err);
		// rollback
		const ids = _.map(itemArray, item => item._id)
		console.log('> [File Import] rollback ids', ids);
		await req.list.model.deleteMany({
			_id: {
				$in: ids
			}
		});
		return res.apiError(req.t.__('msg_db_error_withoutReason'), err);
	}
};
