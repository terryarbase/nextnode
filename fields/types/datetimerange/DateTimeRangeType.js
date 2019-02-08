var FieldType = require('../Type');
var moment = require('moment');
var util = require('util');
var utils = require('keystone-utils');
var DateRangeType = require('../daterange/DateRangeType');

/**
 * DateTimeRange FieldType Constructor
 * @extends Field
 * @api public
 */
function datetimerange (list, path, options) {
	const {
		inputDateFormat='DD/MM/YYYY',
		inputTimeFormat='HH:mm',
		dateFormat='DD/MM/YYYY',
		timeFormat='HH:mm',
		formatString,
	} = options;
	this._nativeType = {
		startDate: Date,
		endDate: Date,
	};
	this._underscoreMethods = ['format', 'moment', 'parse'];
	this._fixedSize = 'medium';
	this._properties = ['formatString', 'inputDateFormat', 'inputTimeFormat', 'yearRange', 'isUTC', 'dateFormat', 'timeFormat', 'maxDate', 'minDate'];
	this.parseFormatString = `${inputDateFormat} ${inputTimeFormat}`;
	this.formatString = formatString ? formatString : `${dateFormat} ${timeFormat}`;

	this.yearRange = options.yearRange;
	this.isUTC = options.utc || false;

	// representive the placeholder elements
	this.placeholder = [
		'from',
		'to',
		'normal'
	];
	/*
	 * This offset is used to determine whether or not a stored date is probably corrupted or not.
	 * If the date/time stored plus this offset equals a time close to midnight for that day, that
	 * resulting date/time will be provided via the getData method instead of the one that is stored.
	 * By default this timezone offset matches the offset of the keystone server. Using the default
	 * setting is highly recommended.
	 */
	this.timezoneUtcOffsetMinutes = options.timezoneUtcOffsetMinutes || moment().utcOffset();

	if (this.formatString && typeof this.formatString !== 'string') {
		throw new Error('FieldType.DateRange: options.format must be a string.');
	}
	datetimerange.super_.call(this, list, path, options);
}
datetimerange.properName = 'DateTimeRange';
util.inherits(datetimerange, FieldType);

datetimerange.prototype.validateRequiredInput = DateRangeType.prototype.validateRequiredInput;

/**
 * Add filters to a query
 */
datetimerange.prototype.addFilterToQuery = DateRangeType.prototype.addFilterToQuery;

// datetimerange.prototype.addFilterToQuery = function (filter) {
// 	var query = {};
// 	const startPath = `${this.path}.startDate`;
// 	const endPath = `${this.path}.endDate`;
// 	if (filter.mode === 'between') {
// 		if (filter.after && filter.before) {
// 			filter.after = moment(filter.after);
// 			filter.before = moment(filter.before);
// 			if (filter.after.isValid() && filter.before.isValid()) {
// 				query[startPath] = {
// 					$gte: filter.after.startOf('day').toDate(),
// 				};
// 				query[endPath] = {
// 					$lte: filter.before.endOf('day').toDate(),
// 				};
// 				// query[this.path] = {
// 				// 	$lte: filter.after.startOf('day').toDate(),
// 				// 	$gte: filter.before.endOf('day').toDate(),
// 				// };
// 			}
// 		}
// 	} else if (filter.value) {
// 		var day = {
// 			moment: moment(filter.value),
// 		};
// 		day.start = day.moment.startOf('day').toDate();
// 		day.end = moment(filter.value).endOf('day').toDate();
// 		if (day.moment.isValid()) {
// 			query[this.path] = {};
// 			if (filter.mode === 'after') {
// 				query[startPath] = { $gt: day.end };
// 			} else if (filter.mode === 'before') {
// 				query[endPath] = { $lt: day.start };
// 			} else {
// 				query[startPath] = {
// 					$gte: day.start,
// 				};
// 				query[endPath] = {
// 					$lte: day.end,
// 				};
// 				// query[this.path] = { $gte: day.start, $lte: day.end };
// 			}
// 		}
// 	}
// 	if (filter.inverted) {
// 		query[this.path] = { $not: query[this.path] };
// 	}
// 	// console.log('> ', query);
// 	return query;
// };

/**
 * Formats the field value
 */
datetimerange.prototype.format = function (item, format) {
	const datFormat = this.formatString;
	// if (datFormat) {
	// use start date instead if no end date specified
	// const endDate = item.endDate || item.startDate;
	return item.get(this.path) ? 
		`${this.moment(item, 'startDate').format(datFormat)} - ${this.moment(item, 'endDate').format(datFormat)}` :
		'';
	// } 
	// else {
	// 	return item.get(this.path) || '';
	// }
};

/**
 * Returns a new `moment` object with the field value
 */
datetimerange.prototype.moment = DateRangeType.prototype.moment;

/**
 * Parses input with the correct moment version (normal or utc) and uses
 * either the provided input format or the default for the field
 */
datetimerange.prototype.parse = DateRangeType.prototype.parse;

/**
 * Asynchronously confirms that the provided date is valid
 */
datetimerange.prototype.validateInput = DateRangeType.prototype.validateInput;

/**
 *
 * Retrives the date as a 'Javascript Date'.
 *
 * Note: If the JS date retrieved is UTC and has a time other than midnight,
 * it has likely become corrupted. In this instance, the below code will
 * attempt to add the server offset to it to fix the date.
 */
datetimerange.prototype.getData = DateRangeType.prototype.getData;

datetimerange.prototype.getValueFromData = DateRangeType.prototype.getValueFromData;


/**
 * Checks that a valid date has been provided in a data object
 * An empty value clears the stored value and is considered valid
 *
 */
datetimerange.prototype.inputIsValid = DateRangeType.prototype.inputIsValid;


/**
 * Updates the value for this field in the item from a data object
 */
datetimerange.prototype.updateItem = function (item, data, callback) {
	var startDate = this.getValueFromData(data, 'startDate');
	var endDate = this.getValueFromData(data, 'endDate');
	// console.log('> ', startDate, endDate);
	if (!!startDate && !!endDate) {
		// If the value is not null, empty string or undefined, parse it
		startDate = moment(startDate);
		endDate = moment(endDate);
		var newValue = null;
		// If it's valid and not the same as the last value, save it
		if (startDate.isValid()) {
		// && (!item.get(this.path) || !newValue.isSame(item.get(this.path)))) {
			// item.set(this.path, newValue.toDate());
			newValue = {
				...newValue,
				startDate: startDate.toDate(),
			}
		}
		if (endDate.isValid()) {
			// && (!item.get(this.path) || !newValue.isSame(item.get(this.path)))) {
				// item.set(this.path, newValue.toDate());
			newValue = {
				...newValue,
				endDate: endDate.toDate(),
			}
		}

		if (newValue) {
			item.set(this.path, newValue);
		}
	} else {
		// If it's null or empty string, clear it out
		item.set(this.path, null);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = datetimerange;
