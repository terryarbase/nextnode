/**
 * Helper method to handle List operations, e.g. creating items, deleting items,
 * getting information about those lists, etc.
 */

const listToArray = require('list-to-array');
const qs = require('qs');
const xhr = require('xhr');
const _ = require('lodash');
const assign = require('object-assign');
// Filters for truthy elements in an array
const truthy = (i) => i;

// delegated flag field name
const delegatedField = 'delegated';
/**
 * Get the columns of a list, structured by fields and headings
 *
 * @param  {Object} list The list we want the columns of
 *
 * @return {Array}       The columns
 */
function getColumns (list) {
	return list.uiElements.map((col) => {
		if (col.type === 'heading') {
			return { type: 'heading', content: col.content };
		} else {
			var field = list.fields[col.field];
			return field ? { type: 'field', field: field, title: field.label, path: field.path } : null;
		}
	}).filter(truthy);
}

/**
 * Make an array of filters an object keyed by the filtering path
 *
 * @param  {Array} filterArray The array of filters
 *
 * @return {Object}            The corrected filters, keyed by path
 */
function getFilters (filterArray) {
	var filters = {};
	filterArray.forEach((filter) => {
		filters[filter.field.path] = filter.value;
	});
	return filters;
};

/**
 * Get the sorting string for the URI
 *
 * @param  {Array} sort.paths The paths we want to sort
 *
 * @return {String}           All the sorting queries we want as a string
 */
function getSortString (sort) {
	return sort.paths.map(i => {
		// If we want to sort inverted, we prefix a "-" before the sort path
		return i.invert ? '-' + i.path : i.path;
	}).filter(truthy).join(',');
};

/**
 * Build a query string from a bunch of options
 */
function buildQueryString (options) {
	const query = {};
	if (options.search) query.search = options.search;
	if (options.filters.length) query.filters = JSON.stringify(getFilters(options.filters));
	if (options.columns) query.fields = options.columns.map(i => i.path).join(',');
	if (options.page && options.page.size) query.limit = options.page.size;
	if (options.page && options.page.index > 1) query.skip = (options.page.index - 1) * options.page.size;
	if (options.sort) query.sort = getSortString(options.sort);
	// multilingual for data language version
	// if (options.lang) query.langd = options.lang;
	query.expandRelationshipFields = true;
	query.timestamp = new Date().getTime();
	return '?' + qs.stringify(query);
};

/**
 * The main list helper class
 *
 * @param {Object} options
 */
const List = function (options) {
	// TODO these options are possibly unused
	assign(this, options);
	this.columns = getColumns(this);
	this.expandedDefaultColumns = this.expandColumns(this.defaultColumns);
	this.defaultColumnPaths = this.expandedDefaultColumns.map(i => i.path).join(',');
};
/**
 * (POST) Execute realtime update list
 *
 * @param  {String}   url       The url you want to be called
 * @param  {FormData} formData The submitted form data
 * @param  {Function} callback Called after the API call
 */
// List.prototype.realtimeSave = function (formData, callback) {
// 	console.log(this);
// 	xhr({
// 		url: `${Keystone.adminPath}/api/${this.path}/realtime?ts=${Math.random()}`,
// 		responseType: 'json',
// 		method: 'POST',
// 		headers: assign({}, Keystone.csrf.header),
// 		body: formData,
// 	}, (err, resp, data) => {
// 		if (err) callback(err);
// 		// handle unexpected JSON string not parsed
// 		data = typeof data === 'string' ? JSON.parse(data) : data;
// 		if (resp.statusCode === 200) {
// 			callback(null, data);
// 		} else {
// 			// NOTE: xhr callback will be called with an Error if
// 			//  there is an error in the browser that prevents
// 			//  sending the request. A HTTP 500 response is not
// 			//  going to cause an error to be returned.
// 			callback(data, null);
// 		}
// 	});
// };


/*
** Shared function for obtaining the value from changing or current values of state
** Support Multlingual
** Terry Chan
** 12/11/2018
*/
const getValueFrom = function({ field, values, isLocale, currentLang }) {
	// console.log(field.path, values);
	var current = values[field.path];
	// prevent set multilingual from true to false
	if (isLocale && field && field.multilingual) {
		if (current && typeof current !== 'string') {
			current = current[currentLang] || '';
		} else if (current){
			current = {
				[currentLang]: current,
			};
		}
	}
	return current;
};
List.prototype.getProperlyValue = getValueFrom;
/*
** Format the filters option for the field with self colun mapping for the self value
** e.g. :_id
** Terry Chan
** 11/06/2019
*/
List.prototype.getRelatedFilter = (field, initFilters={}, props, state) => {
	const { isLocale, currentLang, t, i18n, list } = props;
	let { values } = state;
	// let mapping = null;
	if (field.filters) {
		let { filters={} } = field;
		filters = {
			...filters,
			...initFilters,
		};
		let targetField = null;
		return _.chain(filters).reduce((accum, value, field) => {
			// while the filter value is mapping field being with colun
			if (/^:/i.test(value)) {
				targetField = value.replace(/^:/, '');
				if (targetField === '_id') {
					return {
						...accum,
						_id: values._id,
					}
				}
				return {
					...accum,
					[field]: getValueFrom({
						field: list.fields[targetField],
						isLocale,
						currentLang,
						values,
					}),
				};
			}
			return accum;
		}, filters).value();
	}
	return null;
}
List.prototype.getProperlyChangedValue = function({ currentValue, path, value, isLocale, currentLang }) {
	const fields = this.fields;
	var values = { ...currentValue };

	if (isLocale && fields[path] && fields[path].multilingual) {
		values = {
			...values,
			...{
				[path]: {
					...values[path],
					...{
						[currentLang]: value,
					},
				},
			},
		};
	} else {
		values = {
			...values,
			...{
				[path]: value,
			},
		};
	}
	return values;
};

/*
** turn any missing multilingual format value to form data
** Terry Chan
** 12/11/2018
*/
List.prototype.getFormCreateData = function({ isLocale, formData, values }) {
	const fields = this.fields;
	try {
		for (const pair of formData.entries()) {
			const key = pair[0];
			// console.log(key, typeof values[key]);
			if (values[key] && isLocale && fields[key].multilingual) {
				
				// formData.set(key, );
				if (typeof values[key] === 'object') {
					const keys = _.keys(values[key]);
					if (keys.length) {
						formData.set(key, JSON.stringify(values[key]));
					}
				}
				

			} else if (Array.isArray(values[key])) {
				
				formData.delete(key);
				formData.set(key, JSON.stringify(values[key]));
				
			} else if (typeof values[key] === 'object') {
				// console.log('> 3', values[key], key);
				const keys = _.keys(values[key]);
				if (keys.length) {
					// delete orginal formdata attr
					formData.delete(key);
					// use object declarion instead
					keys.forEach(function(k) {
						formData.set(key+'.'+k, values[key][k]);
					});
				}
			}
		}
	} catch (err) {
		console.log('Error to parse formdata: ', err);
	} finally {
		return formData;
	}
};

/**
 * (GET) Execute an item via specific api url
 *
 * @param  {String}   url       The url you want to be called
 * @param  {Function} callback Called after the API call
 */
List.prototype.getIt = function (url, callback) {
	xhr({
		url: `${Keystone.adminPath}${url}&ts=${Math.random()}`,
		responseType: 'json',
		method: 'GET',
		headers: assign({}, Keystone.csrf.header),
		body: {},
	}, (err, resp, data) => {
		if (err) callback(err);
		// handle unexpected JSON string not parsed
		data = typeof data === 'string' ? JSON.parse(data) : data;
		if (resp.statusCode === 200) {
			callback(null, data);
		} else {
			// NOTE: xhr callback will be called with an Error if
			//  there is an error in the browser that prevents
			//  sending the request. A HTTP 500 response is not
			//  going to cause an error to be returned.
			callback(data, null);
		}
	});
};
/**
 * (POST) Execute an item via specific api url
 *
 * @param  {String}   url       The url you want to be called
 * @param  {FormData} formData The submitted form data
 * @param  {Function} callback Called after the API call
 */
List.prototype.postIt = function (url, formData, callback) {
	xhr({
		url: `${Keystone.adminPath}${url}?ts=${Math.random()}`,
		responseType: 'json',
		method: 'POST',
		headers: assign({}, Keystone.csrf.header),
		body: formData,
	}, (err, resp, data) => {
		if (err) callback(err);
		// handle unexpected JSON string not parsed
		data = typeof data === 'string' ? JSON.parse(data) : data;
		if (resp.statusCode === 200) {
			callback(null, data);
		} else {
			// NOTE: xhr callback will be called with an Error if
			//  there is an error in the browser that prevents
			//  sending the request. A HTTP 500 response is not
			//  going to cause an error to be returned.
			callback(data, null);
		}
	});
};
/**
 * Create an item via the API
 *
 * @param  {FormData} formData The submitted form data
 * @param  {Object} data for extra header
 * @param  {Function} callback Called after the API call
 */
List.prototype.createItem = function (formData, options = {}, callback) {
	xhr({
		url: `${Keystone.adminPath}/api/${this.path}/create?ts=${Math.random()}`,
		responseType: 'json',
		method: 'POST',
		headers: {
			...Keystone.csrf.header,
			...options.headers,
		},
		body: formData,
	}, (err, resp, data) => {
		if (err) callback(err);
		// handle unexpected JSON string not parsed
		data = typeof data === 'string' ? JSON.parse(data) : data;
		if (resp.statusCode === 200) {
			callback(null, data);
		} else {
			// NOTE: xhr callback will be called with an Error if
			//  there is an error in the browser that prevents
			//  sending the request. A HTTP 500 response is not
			//  going to cause an error to be returned.
			callback(data, null);
		}
	});
};

/**
 * Update many items
 *
 * @param  {String}   id       The id of the item we want to update
 * @param  {FormData} formData The submitted form data
 * @param  {Function} callback Called after the API call
 */
List.prototype.updateItems = function (formData, callback) {
	xhr({
		url: `${Keystone.adminPath}/api/${this.path}/update?ts=${Math.random()}`,
		responseType: 'json',
		method: 'POST',
		headers: assign({}, Keystone.csrf.header),
		body: formData,
	}, (err, resp, data) => {
		if (err) return callback(err);
		// handle unexpected JSON string not parsed
		data = typeof data === 'string' ? JSON.parse(data) : data;
		if (resp.statusCode === 200) {
			callback(null, data);
		} else {
			callback(data);
		}
	});
};

/**
 * Update a specific item
 *
 * @param  {String}   id       The id of the item we want to update
 * @param  {FormData} formData The submitted form data
 * @param  {Function} callback Called after the API call
 */
List.prototype.updateItem = function (id, formData, callback) {
	xhr({
		url: `${Keystone.adminPath}/api/${this.path}/${id}?ts=${Math.random()}`,
		responseType: 'json',
		method: 'POST',
		headers: assign({}, Keystone.csrf.header),
		body: formData,
	}, (err, resp, data) => {
		if (err) return callback(err);
		// handle unexpected JSON string not parsed
		data = typeof data === 'string' ? JSON.parse(data) : data;
		if (resp.statusCode === 200) {
			callback(null, data);
		} else {
			callback(data);
		}
	});
};

List.prototype.expandColumns = function (input) {
	let nameIncluded = false;
	const cols = listToArray(input).map(i => {
		const split = i.split('|');
		let path = split[0];
		let width = split[1];
		if (path === '__name__') {
			path = this.namePath;
		}
		const field = this.fields[path];
		if (!field) {
			// TODO: Support arbitary document paths
			if (!this.hidden) {
				if (path === this.namePath) {
					console.warn(`List ${this.key} did not specify any default columns or a name field`);
				} else {
					console.warn(`List ${this.key} specified an invalid default column: ${path}`);
				}
			}
			return;
		}
		if (path === this.namePath) {
			nameIncluded = true;
		}
		return {
			field: field,
			label: field.label,
			path: field.path,
			type: field.type,
			width: width,
		};
	}).filter(truthy);
	if (!nameIncluded) {
		cols.unshift({
			type: 'id',
			label: 'ID',
			path: 'id',
		});
	}
	return cols;
};

List.prototype.expandSort = function (input) {
	const sort = {
		rawInput: input || this.defaultSort,
		isDefaultSort: false,
	};
	sort.input = sort.rawInput;
	if (sort.input === '__default__') {
		sort.isDefaultSort = true;
		sort.input = this.sortable ? 'sortOrder' : this.namePath;
	}
	sort.paths = listToArray(sort.input).map(path => {
		let invert = false;
		if (path.charAt(0) === '-') {
			invert = true;
			path = path.substr(1);
		}
		else if (path.charAt(0) === '+') {
			path = path.substr(1);
		}
		const field = this.fields[path];
		if (!field) {
			// TODO: Support arbitary document paths
			console.warn('Invalid Sort specified:', path);
			return;
		}
		return {
			field: field,
			type: field.type,
			label: field.label,
			path: field.path,
			invert: invert,
		};
	}).filter(truthy);
	return sort;
};

/**
 * Load a specific item via the API
 *
 * @param  {String}   itemId   The id of the item we want to load
 * @param  {Object}   options
 * @param  {Function} callback
 */
List.prototype.loadItem = function (itemId, options, callback) {
	if (arguments.length === 2 && typeof options === 'function') {
		callback = options;
		options = null;
	}
	let url = Keystone.adminPath + '/api/' + this.path + '/' + itemId + '?ts='+Math.random();
	const query = qs.stringify(options);
	if (query.length) url += '?' + query;
	xhr({
		url: url,
		responseType: 'json',
	}, (err, resp, data) => {
		if (err) return callback(err);
        // handle unexpected JSON string not parsed
		data = typeof data === 'string' ? JSON.parse(data) : data;
		// Pass the data as result or error, depending on the statusCode
		if (resp.statusCode === 200) {
			callback(null, data);
		} else {
			callback(data);
		}
	});
};

/**
 * Load all items of a list, optionally passing objects to build a query string
 * for sorting or searching
 *
 * @param  {Object}   options
 * @param  {Function} callback
 */
List.prototype.loadItems = function (options, callback) {
	const url = Keystone.adminPath + '/api/' + this.path + buildQueryString(options);
	xhr({
		url: url,
		responseType: 'json',
	}, (err, resp, data) => {
		if (err) callback(err);
        // handle unexpected JSON string not parsed
        data = typeof data === 'string' ? JSON.parse(data) : data;
		// Pass the data as result or error, depending on the statusCode
		if (resp.statusCode === 403) {
			const permissionDenied = true;
			return callback(data.error, null, permissionDenied);
		}
		if (resp.statusCode === 200) {
			callback(null, data);
		} else {
			callback(data);
		}
	});
};

/**
 * Constructs a download URL to download a list with the current sorting, filtering,
 * selection and searching options
 *
 * @param  {Object} options
 *
 * @return {String}         The download URL
 */
List.prototype.getDownloadURL = function (options) {
	const url = Keystone.adminPath + '/api/' + this.path;
	const parts = [];
	// if (options.format !== 'json') {
	// 	options.format = 'excel';
	// }
	parts.push(options.search ? 'search=' + options.search : '');
	parts.push('ts=' + Math.random());
	parts.push(options.filters.length ? 'filters=' + JSON.stringify(getFilters(options.filters)) : '');
	parts.push(options.columns ? 'select=' + options.columns.map(i => i.path).join(',') : '');
	parts.push(options.sort ? 'sort=' + getSortString(options.sort) : '');
	parts.push('expandRelationshipFields=true');
	// if (options.lang) {
	// 	parts.push(`langd=${options.lang}`);
	// }
	return url + '/export.' + options.format + '?' + parts.filter(truthy).join('&');
};

/**
 * Delete a specific item via the API
 *
 * @param  {String}   itemId   The id of the item we want to delete
 * @param  {Function} callback
 */
List.prototype.deleteItem = function (itemId, callback) {
	this.deleteItems([itemId], callback);
};

/**
 * Delete multiple items at once via the API
 *
 * @param  {Array}   itemIds  An array of ids of items we want to delete
 * @param  {Function} callback
 */
List.prototype.deleteItems = function (itemIds, callback) {
	const url = Keystone.adminPath + '/api/' + this.path + '/delete?ts='+Math.random();
	xhr({
		url: url,
		method: 'POST',
		headers: assign({}, Keystone.csrf.header),
		json: {
			ids: itemIds,
		},
	}, (err, resp, body) => {
		if (err) return callback(err);
        // data = typeof data === 'string' ? JSON.parse(data) : data;
		// Pass the body as result or error, depending on the statusCode
		if (resp.statusCode === 200) {
			callback(null, body);
		} else {
			callback(body);
		}
	});
};

List.prototype.reorderItems = function (item, oldSortOrder, newSortOrder, pageOptions, callback) {
	const url = Keystone.adminPath + '/api/' + this.path + '/' + item.id + '/sortOrder/' + oldSortOrder + '/' + newSortOrder + '/' + buildQueryString(pageOptions);
	xhr({
		url: url,
		method: 'POST',
		headers: assign({}, Keystone.csrf.header),
	}, (err, resp, body) => {
		if (err) return callback(err);
		try {
			body = JSON.parse(body);
		} catch (e) {
			console.log('Error parsing results json:', e, body);
			return callback(e);
		}
		// Pass the body as result or error, depending on the statusCode
		if (resp.statusCode === 200) {
			callback(null, body);
		} else {
			callback(body);
		}
	});
};

/**
 * Import items by file via the API
 *
 * @param  {FileList} file   The file of the items we want to import
 * @param  {Function} callback
 */
List.prototype.importItems = function (file, callback) {
	const url = Keystone.adminPath + '/api/' + this.path + '/import?ts='+Math.random();
	const formData = new FormData();
	formData.append('importFile', file);
	xhr({
		url,
		method: 'POST',
		headers: assign({}, Keystone.csrf.header),
		body: formData,
	}, (err, resp, body) => {
		if (err) return callback(err);
		if (resp.statusCode === 200) {
			callback(null, body);
		} else {
			callback(body);
		}
	});
};

module.exports = List;
