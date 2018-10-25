/*
TODO: Needs Review and Spec
*/

var moment = require('moment');
var assign = require('object-assign');
// const Json2csvParser = require('json2csv').Parser;
const xlsx = require('xlsx');

module.exports = function (req, res, next) {
	var baby = require('babyparse');
	var keystone = req.keystone;

	var format = req.params.format.split('.')[1]; // json or csv
	var where = {};
	var filters = req.query.filters;
	if (filters && typeof filters === 'string') {
		try { filters = JSON.parse(req.query.filters); }
		catch (e) { /* */ }
	}
	if (typeof filters === 'object') {
		assign(where, req.list.addFiltersToQuery(filters));
	}
	if (req.query.search) {
		assign(where, req.list.addSearchToQuery(req.query.search));
	}
	var query = req.list.model.find(where);
	if (req.query.populate) {
		query.populate(req.query.populate);
	}
	if (req.query.expandRelationshipFields) {
		req.list.relationshipFields.forEach(function (i) {
			query.populate(i.path);
		});
	}
	var sort = req.list.expandSort(req.query.sort);
	query.sort(sort.string);
	query.exec()
	.then(function (results) {
		var data;
		var fields = [];
		if (format === 'excel') {
			data = results.map(function (item) {
				var row = req.list.getCSVData(item, {
					expandRelationshipFields: req.query.expandRelationshipFields,
					fields: req.query.select,
					user: req.user,
				});
				// If nested values in the first item aren't present, babyparse
				// won't add them even if they are present in others. So we
				// add keys from all items to an array and explicitly provided
				// the complete set to baby.unparse() below
				Object.keys(row).forEach(function (i) {
					if (fields.indexOf(i) === -1) fields.push(i);
				});
				return row;
			});
			/*
			** Terry Chan 04/08/2018
			*/
			const wb = {
            	SheetNames: ["datasheet"],
            	Sheets:{},
            };
			wb.Sheets['datasheet'] = xlsx.utils.json_to_sheet(data);
            const fileName = req.list.path + '-' + moment().format('YYYYMMDD-HHMMSS') + '.xlsx';
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            const wbout = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer'});
            res.send(new Buffer(wbout));
		} else {
			data = results.map(function (item) {
				return req.list.getData(item, req.query.select, req.query.expandRelationshipFields);
			});
			res.json(data);
		}
	})
	.catch(next);
};
