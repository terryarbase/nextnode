import _ from 'lodash';
import qs from "query-string";
import blacklist from 'blacklist';
import isEqual from 'lodash/isEqual';

function checkForQueryChange (nextProps, thisProps) {
	const { query } = nextProps.location;
	const { cachedQuery } = nextProps.active;

	const parsedQuery = Object.assign(
		{},
		query,
		{ page: parseInt(query.page) }
	);

	if (!parsedQuery.page) delete parsedQuery.page;

	const attenuatedQuery = blacklist(parsedQuery, 'search');
	const attenuatedCache = blacklist(cachedQuery, 'search');

	if (nextProps.location.pathname !== thisProps.location.pathname) return true;

	if (!isEqual(attenuatedQuery, attenuatedCache)) return true;

	return false;
}

function normaliseValue (value, benchmark) {
	if (value === benchmark) return void 0;
	return value;
}

function createSortQueryParams (rawInput, defaultSort) {
	return normaliseValue(rawInput, defaultSort);
}

function createPageQueryParams (page, defaultValue) {
	return normaliseValue(page, defaultValue);
}

/**
 * Updates the query parameters with the ones passed as the first argument
 *
 * @param  {Object} params         The new parameters to be added
 * @param  {Object} location       The current location object
 */
function updateQueryParams (params, location) {
	if (!location) return;
	const {
		query,
		search,
	} = location;
	let newParams = {};
	if (query) {
		newParams = { ...query };
	} else if (search) {
		newParams = qs.parse(search);
	}
	// Stringify nested objects inside the parameters
	_.forOwn(params, (p, field) => {
		let value = encodeURIComponent(p);
		if (typeof p === 'object') {
			value = JSON.stringify(p);
		}
		newParams = {
			...newParams,
			[field]: value,
		}; 
	});
	return newParams;
}

/*
** Repalce a new param query to the current url without pushing new state
** Terry Chan
** 21/10/2019
*/
function replaceQueryParams (params, history) {
	const {
		location,
		replace,
	} = history;
	let newParams = updateQueryParams(params, location);
	newParams = `?${qs.stringify(newParams)}`;
	if (replace) {
		const {
			location: {
				pathname,
			},
		} = history;
		replace(`${pathname}${newParams}`);
	}
}

/**
 * Stringify the columns array from the state
 *
 * @param  {Array}  columns            The columns from the active state
 * @param  {String} defaultColumnPaths The default column paths of the current list
 *
 * @return {String}                    The column array, stringified
 */
function stringifyColumns (columns, defaultColumnPaths) {
	if (!columns) {
		return;
	}
	// Turns [{ path: 'someColumn' }, { path: 'someOtherColumn' }]
	// into ['someColumn', 'someOtherColumn']
	let columnString = columns.map((column) => column.path);
	// Turns that array into 'someColumn,someOtherColumn'
	if (Array.isArray(columnString)) columnString = columnString.join(',');
	// If that is the same as the default columns, don't set the query param
	if (columnString === defaultColumnPaths) columnString = undefined;
	return columnString;
}


/**
 * Flattens filters from state into the minimum needed object to be used as a url
 * param
 *
 * @param  {Object} filterArray         The array of filters from state
 */
function parametizeFilters (filterArray) {
	if (!filterArray || filterArray.length === 0) {
		return;
	}
	return filterArray.map((filter) => {
		return Object.assign({
			path: filter.field.path,
		}, filter.value);
	});
}


export {
	parametizeFilters,
	stringifyColumns,
	createPageQueryParams,
	createSortQueryParams,
	updateQueryParams,
	normaliseValue,
	checkForQueryChange,
	replaceQueryParams,
};