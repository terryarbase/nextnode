const _        = require('lodash');
const fs       = require('fs');
const csv      = require('csv-parser');

function toModelData(data) {
	const item = {}
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
	console.log('> api call success', req.files)
	const keystone = req.keystone;
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
			const modelData = toModelData(data);
			console.log('modelData', modelData);
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
		const session = await keystone.mongoose.startSession();
        session.startTransaction();
		const insertResult = await req.list.model.insertMany(itemArray, { session });
        await session.commitTransaction();
		session.endSession();
		
		return res.json({
			success: true,
			count: insertResult.length,
		});
    } catch (err) {
        console.log('> [File Import] insert error', err);
        await session.abortTransaction();
		session.endSession();
		return res.apiError(req.t.__('msg_db_error_withoutReason'), err);
	}
};
