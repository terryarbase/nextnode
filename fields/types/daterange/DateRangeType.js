var FieldType = require('../Type');
var moment = require('moment');
var util = require('util');
var utils = require('keystone-utils');
var TextType = require('../text/TextType');

/**
 * DateRange FieldType Constructor
 * @extends Field
 * @api public
 */
function daterange (list, path, options) {
	this._nativeType = {
		startDate: Date,
		endDate: Date,
	};
	this._underscoreMethods = ['format', 'moment', 'parse'];
	this._fixedSize = 'medium';
	this._properties = ['formatString', 'yearRange', 'isUTC', 'inputFormat', 'maxDate', 'minDate'];
	this.parseFormatString = options.inputFormat || 'YYYY-MM-DD';
	this.formatString = (options.format === false) ? false : (options.format || 'Do MMM YYYY');

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
	daterange.super_.call(this, list, path, options);
}
daterange.properName = 'DateRange';
util.inherits(daterange, FieldType);



daterange.prototype.validateRequiredInput = function (item, data, callback) {
	const startValue = this.getValueFromData(data, 'startDate');
	const endValue = this.getValueFromData(data, 'endDate');
	const result = !!startValue && !!endValue;
	utils.defer(callback, result);
};
/**
 * Add filters to a query
 */
daterange.prototype.addFilterToQuery = function (filter) {
	var query = {};
	const startPath = `${this.path}.startDate`;
	const endPath = `${this.path}.endDate`;
	if (filter.mode === 'between') {
		if (filter.after && filter.before) {
			filter.after = moment(filter.after);
			filter.before = moment(filter.before);
			if (filter.after.isValid() && filter.before.isValid()) {
				query[startPath] = {
					$gte: filter.after.startOf('day').toDate(),
				};
				query[endPath] = {
					$lte: filter.before.endOf('day').toDate(),
				};
				// query[this.path] = {
				// 	$lte: filter.after.startOf('day').toDate(),
				// 	$gte: filter.before.endOf('day').toDate(),
				// };
			}
		}
	} else if (filter.value) {
		var day = {
			moment: moment(filter.value),
		};
		day.start = day.moment.startOf('day').toDate();
		day.end = moment(filter.value).endOf('day').toDate();
		if (day.moment.isValid()) {
			query[this.path] = {};
			if (filter.mode === 'after') {
				query[startPath] = { $gt: day.end };
			} else if (filter.mode === 'before') {
				query[endPath] = { $lt: day.start };
			} else {
				query[startPath] = {
					$gte: day.start,
				};
				query[endPath] = {
					$lte: day.end,
				};
				// query[this.path] = { $gte: day.start, $lte: day.end };
			}
		}
	}
	if (filter.inverted) {
		query[this.path] = { $not: query[this.path] };
	}
	// console.log('> ', query);
	return query;
};

/**
 * Formats the field value
 */
daterange.prototype.format = function (item, format) {
	const datFormat = (format && typeof format === 'string') || this.formatString || 'YYYY-MM-DD';
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
daterange.prototype.moment = function (item, subPath) {
	var m = moment(item.get(this.path)[subPath]);
	if (this.isUTC) m.utc();
	return m;
};

/**
 * Parses input with the correct moment version (normal or utc) and uses
 * either the provided input format or the default for the field
 */
daterange.prototype.parse = function (value, format, strict) {
	var m = this.isUTC ? moment.utc : moment;
	// TODO Check should maybe be if (typeof value === 'string')
	// use the parseFormatString. Ever relevant?
	if (typeof value === 'number' || value instanceof Date) {
		return m(value);
	} else {
		return m(value, format || this.parseFormatString, strict);
	}
};

/**
 * Asynchronously confirms that the provided date is valid
 */
daterange.prototype.validateInput = function (data, callback) {
	const startValue = this.getValueFromData(data, 'startDate');
	const endValue = this.getValueFromData(data, 'endDate');
	var result = true;
	if (startValue) {
		result = moment(startValue).isValid();
		// console.log(startValue, moment(startValue), result);
	}
	if (endValue) {
		result = moment(endValue).isValid();
		// console.log(endValue, result);
	}
	utils.defer(callback, result);
};

/**
 *
 * Retrives the date as a 'Javascript Date'.
 *
 * Note: If the JS date retrieved is UTC and has a time other than midnight,
 * it has likely become corrupted. In this instance, the below code will
 * attempt to add the server offset to it to fix the date.
 */
daterange.prototype.getData = function (item) {
		var value = item.get(this.path);
		if (value && value.startDate && value.endDate) {
		var startMomentDate = this.isUTC ? moment.utc(value.startDate) : moment(value.startDate);
		var endMomentDate = this.isUTC ? moment.utc(value.endDate) : moment(value.endDate);
		var dates = {
			startDate: startMomentDate.toDate(),
			endDate: endMomentDate.toDate(),
		};
		if (this.isUTC) {
			if (startMomentDate.format('HH:mm:ss:SSS') !== '00:00:00:000') {
				// Time is NOT midnight. So, let's try and add the server timezone offset
				// to convert it (back?) to the original intended time. Since we don't know
				// if the time was recorded during daylight savings time or not, allow +/-
				// 1 hour leeway.

				var adjustedMomentDate = moment.utc(startMomentDate);

				// Add the server the time so that it is within +/- 1 hour of midnight.
				adjustedMomentDate.add(this.timezoneUtcOffsetMinutes, 'minutes');

				// Add 1 hour to the time so then we know any valid date/time would be between
				// 00:00 and 02:00 on the correct day
				adjustedMomentDate.add(1, 'hours'); // So
				var timeAsNumber = Number(adjustedMomentDate.format('HHmmssSSS'));
				if (timeAsNumber >= 0 && timeAsNumber <= 20000000) {
					// Time is close enough to midnight so extract the date with a zeroed (ie. midnight) time value
					dates = {
						...dates,
						startDate: adjustedMomentDate.startOf('day').toDate(),
					};
				} else {
					// Seems that that adding the server time offset didn't produce a time
					// that is close enough to midnight. Therefore, let's use the date/time
					// as-is
					dates = {
						...dates,
						startDate: startMomentDate.toDate(),
					};
				}
			}
			if (endMomentDate.format('HH:mm:ss:SSS') !== '00:00:00:000') {
				// Time is NOT midnight. So, let's try and add the server timezone offset
				// to convert it (back?) to the original intended time. Since we don't know
				// if the time was recorded during daylight savings time or not, allow +/-
				// 1 hour leeway.

				var adjustedMomentDate = moment.utc(endMomentDate);

				// Add the server the time so that it is within +/- 1 hour of midnight.
				adjustedMomentDate.add(this.timezoneUtcOffsetMinutes, 'minutes');

				// Add 1 hour to the time so then we know any valid date/time would be between
				// 00:00 and 02:00 on the correct day
				adjustedMomentDate.add(1, 'hours'); // So
				var timeAsNumber = Number(adjustedMomentDate.format('HHmmssSSS'));
				if (timeAsNumber >= 0 && timeAsNumber <= 20000000) {
					// Time is close enough to midnight so extract the date with a zeroed (ie. midnight) time value
					dates = {
						...dates,
						endDate: adjustedMomentDate.endOf('day').toDate(),
					};
				} else {
					// Seems that that adding the server time offset didn't produce a time
					// that is close enough to midnight. Therefore, let's use the date/time
					// as-is
					dates = {
						...dates,
						endDate: endMomentDate.toDate(),
					};
				}
			}
		}
		return {
			startDate: startMomentDate.toDate(),
			endDate: endMomentDate.toDate(),
		};
	}
	return {};
};

daterange.prototype.getValueFromData = function(data, subPath) {
	const path = `${this.path}.${subPath}`;
	return data[path] ? data[path] : null;
};

/**
 * Checks that a valid date has been provided in a data object
 * An empty value clears the stored value and is considered valid
 *
 * Deprecated
 */
daterange.prototype.inputIsValid = function (data, required, item) {
	var startValue = this.getValueFromData(data, 'startDate');
	var endValue = this.getValueFromData(data, 'endDate');
	if (!startValue && !endValue) return false;
	startValue = moment(startValue, this.parseFormatString);
	endValue = moment(endValue, this.parseFormatString);
	// if (!(this.path in data) && item && item.get(this.path)) return true;
	// var startValue = moment(data[this.path].startDate, this.parseFormatString);
	// var endValue = moment(data[this.path].endDate, this.parseFormatString);
	if (required && (!startValue.isValid() || !endValue.isValid())) {
		return false;
	} else if (startValue && !startValue.isValid()) {
		return false;
	} else if (endValue && !endValue.isValid()) {
		return false;
	} else if (startValue.isAfter(endValue)) {
		return false;
	} else {
		return true;
	}
};

/**
 * Updates the value for this field in the item from a data object
 */
daterange.prototype.updateItem = function (item, data, callback) {
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
				startDate: startDate.startOf('day').toDate(),
			}
		}
		if (endDate.isValid()) {
			// && (!item.get(this.path) || !newValue.isSame(item.get(this.path)))) {
				// item.set(this.path, newValue.toDate());
			newValue = {
				...newValue,
				endDate: endDate.endOf('day').toDate(),
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
module.exports = daterange;
