var async = require('async');
const _ = require('lodash');
var assign = require('object-assign');
var listToArray = require('list-to-array');

module.exports = function (req, res) {
	var where = {};
	const { locales } = req;
	var fields = req.query.fields;
	var includeCount = req.query.count !== 'false';
	var includeResults = req.query.results !== 'false';
	if (includeResults && fields) {
		if (fields === 'false') {
			fields = false;
		}
		if (typeof fields === 'string') {
			fields = listToArray(fields);
		}
		if (fields && !Array.isArray(fields)) {
			return res.status(401).json({ error: req.t.__('msg_request_filed_invalid') });
		}
	}
	var filters = req.query.filters;
	if (filters && typeof filters === 'string') {
		try { filters = JSON.parse(req.query.filters); }
		catch (e) { } // eslint-disable-line no-empty
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
	if (req.query.expandRelationshipFields && req.query.expandRelationshipFields !== 'false') {
		req.list.relationshipFields.forEach(function (i) {
			query.populate(i.path);
		});
	}
	var sort = req.list.expandSort(req.query.sort);
	async.waterfall([
		function (next) {
			if (!includeCount) {
				return next(null, 0);
			}
			query.count(next);
		},
		function (count, next) {
			if (!includeResults) {
				return next(null, count, []);
			}
			query.find();
			query.limit(Number(req.query.limit) || 100);
			query.skip(Number(req.query.skip) || 0);
			if (sort.string) {
				query.sort(sort.string);
			}
			query.exec(function (err, items) {
				next(err, count, items);
			});
		},
	], function (err, count, items) {
		if (err) {
			res.logError('admin/server/api/list/get', 'database error finding items', err);
			return res.apiError(req.t.__('msg_db_error_withoutReason'), err);
		}
		var results;
		var editCount;
		const options = {
			lang: locales && locales.langd,
			defaultLang: locales && locales.defaultLanguage,
		};
		if (includeResults) {
			results = _.map(items, item => req.list.getData(item, fields, req.query.expandRelationshipFields, options));
			editCount = _.filter(items, item => !item.delegated).length;
		} else {
			count = null;
		}
		return res.json({
			results,
			count,
			editCount,
		});
	});
};
