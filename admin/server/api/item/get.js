var _ = require('lodash');
var async = require('async');
var listToArray = require('list-to-array');

module.exports = function (req, res) {
	var keystone = req.keystone;
	const { locales } = req;
	var query = req.list.model.findById(req.params.id);
	var fields = req.query.fields;
	if (fields === 'false') {
		fields = false;
	}
	if (typeof fields === 'string') {
		fields = listToArray(fields);
	}
	if (fields && !Array.isArray(fields)) {
		return res.status(401).json({ error: req.t.__('msg_request_filed_invalid') });
	}
	query.exec(function (err, item) {

		if (err) return res.status(500).json({
			err: req.t.__('msg_db_error_withoutReason'),
			detail: err,
		});
		if (!item) return res.status(404).json({
			err: req.t.__('msg_user_notfound'),
			id: req.params.id,
		});

		var tasks = [];
		var drilldown;

		if (req.query.basic === '' || req.query.basic === 'true') {
			return res.json(req.list.getBasicData(item));
		}

		/* Drilldown (optional, provided if ?drilldown=true in querystring) */
		if (req.query.drilldown === 'true' && req.list.get('drilldown')) {
			drilldown = {
				def: req.list.get('drilldown'),
				items: [],
			};

			tasks.push(function (cb) {

				// TODO: proper support for nested relationships in drilldown

				// step back through the drilldown list and load in reverse order to support nested relationships
				drilldown.def = drilldown.def.split(' ').reverse();

				async.eachSeries(drilldown.def, function (path, done) {

					var field = req.list.fields[path];

					if (!field || field.type !== 'relationship') {
						throw new Error(
							req.t.__('msg_drilldown_invalid', {
								key: req.list.key,
								path,
							})
						);
					}

					var refList = field.refList;

					if (field.many) {
						if (!item.get(field.path).length) {
							return done();
						}
						refList.model.find().where('_id').in(item.get(field.path)).limit(4).exec(function (err, results) {
							if (err || !results) {
								done(err);
							}
							var more = (results.length === 4) ? results.pop() : false;
							if (results.length) {
								// drilldown.data[path] = results;
								drilldown.items.push({
									list: refList.getOptions(),
									items: _.map(results, function (i) {
										return {
											label: refList.getDocumentName(i),
											href: '/' + keystone.get('admin path') + '/' + refList.path + '/' + i.id,
										};
									}),
									more: (more) ? true : false,
								});
							}
							done();
						});
					} else {
						if (!item.get(field.path)) {
							return done();
						}
						refList.model.findById(item.get(field.path)).exec(function (err, result) {
							if (result) {
								// drilldown.data[path] = result;
								drilldown.items.push({
									list: refList.getOptions(),
									items: [{
										label: refList.getDocumentName(result),
										href: '/' + keystone.get('admin path') + '/' + refList.path + '/' + result.id,
									}],
								});
							}
							done(err);
						});
					}

				}, function (err) {
					// put the drilldown list back in the right order
					drilldown.def.reverse();
					drilldown.items.reverse();
					cb(err);
				});

			});
		}

		/* Process tasks & return */
		async.parallel(tasks, function (err) {
			if (err) {
				return res.status(500).json({
					err: req.t.__('msg_db_error_withoutReason'),
					detail: err,
				});
			}
			const data = req.list.getData(item, fields, null, {
				lang: locales && locales.langd,
				// list: false,	// flag to identify the value whether is specificed
				isMultilingual: !!locales,
				defaultLang: locales && locales.defaultLanguage,
				supportLang: locales && locales.localization,
			});

			res.json(_.assign(data, {
				drilldown: drilldown,
			}));
		});
	});
};
