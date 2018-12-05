import moment from 'moment';
import _ from 'lodash';

import { getTranslatedLabel } from '../../../../../utils/locale';

const DATE_FORMAT = 'MMM D YYYY';
const DATETIME_FORMAT = 'MMM D YYYY h:mm:ss';

function getFilterLabel (list, t, currentUILang, { field, value }) {
	const label = getTranslatedLabel(t, {
		prefix: 'field',
		listKey: list.key,
		content: field.path,
		namespace: 'form',
		altContent: field.name,
	});

	switch (field.type) {
		// BOOLEAN
		case 'boolean': {
			return value.value
				? label
				: `${t('not')} ${label}`;
		}

		// DATE
		case 'date': {
			return `${label} ${resolveDateFormat(t, value, DATE_FORMAT)}`;
		}

		// DATE ARRAY
		case 'datearray': {
			const presence = value.presence === 'some' ? t('some') : t('no');

			return `${presence} ${label} ${resolveDateFormat(t, value, DATETIME_FORMAT, t('are'))}`;
		}

		// DATETIME
		case 'datetime': {
			return `${label} ${resolveDateFormat(t, value, DATETIME_FORMAT)}`;
		}

		// GEOPOINT
		// TODO distance needs a qualifier, currently defaults to "km"?
		case 'geopoint': {
			const mode = value.distance.mode === 'max' ? t('isWithIn') : t('isAtLeast');
			const distance = `${value.distance.value}km`;
			const conjunction = value.distance.mode === 'max' ? t('of') : _.toLower(t('from'));
			const latlong = `${value.lat}, ${value.lon}`;

			return `${label} ${mode} ${distance} ${conjunction} ${latlong}`;
		}

		// LOCATION
		case 'location': {
			const joiner = value.inverted ? _.lowerFirst(t('doesNotMatch')) : t('matches');

			// Remove undefined values before rendering the template literal
			const formattedValue = [
				value.street,
				value.city,
				value.state,
				value.code,
				value.country,
			].join(' ').trim();

			return `${label} ${joiner} "${formattedValue}"`;
		}

		// NUMBER & MONEY
		case 'number':
		case 'money': {
			return `${label} ${resolveNumberFormat(t, value)}`;
		}

		// NUMBER ARRAY
		case 'numberarray': {
			const presence = value.presence === 'some' ? t('some') : t('no');

			return `${presence} ${label} ${resolveNumberFormat(t, value, t('are'))}`;
		}

		// PASSWORD
		case 'password': {
			return value.exists
				? `${label} ${_.toLower(t('isSet'))}`
				: `${label} ${_.toLower(t('isNotSet'))}`;
		}

		// RELATIONSHIP
		// TODO populate relationship, currently rendering an ID
		case 'relationship': {
			let joiner = value.inverted ? t('isNot') : t('is');
			let formattedValue = (value.value.length > 1)
				? value.value.join(`, ${t('or')} `)
				: value.value[0];

			return `${label} ${joiner} ${formattedValue}`;
		}

		// SELECT
		case 'select': {
			const newValue = getValueFromObjectValue(field, value, currentUILang);
			// console.log(newValue);
			let joiner = newValue.inverted ? t('isNot') : t('is');
			let formattedValue = (newValue.value.length > 1)
				? newValue.value.join(`, ${t('or')} `)
				: newValue.value[0];

			return `${label} ${joiner} ${formattedValue}`;
		}

		// TEXT-LIKE
		case 'code':
		case 'color':
		case 'email':
		case 'html':
		case 'key':
		case 'markdown':
		case 'name':
		case 'text':
		case 'textarea':
		case 'url': {
			let mode = '';
			if (value.mode === 'beginsWith') {
				mode = value.inverted ? t('doesNotBeginWith') : t('beginsWith');
			} else if (value.mode === 'endsWith') {
				mode = value.inverted ? t('doesNotEndWith') : t('endsWith');
			} else if (value.mode === 'exactly') {
				mode = value.inverted ? t('isNotExactly') : t('is');
			} else if (value.mode === 'contains') {
				mode = value.inverted ? t('doesNotContains') : t('contains');
			}

			return `${label} ${mode} "${value.value}"`;
		}

		// TEXTARRAY
		case 'textarray': {
			const presence = value.presence === 'some' ? t('some') : t('no');
			let mode = '';
			if (value.mode === 'beginsWith') {
				mode = value.inverted ? t('doNotBeginWith')  : t('beginsWith');
			} else if (value.mode === 'endsWith') {
				mode = value.inverted ? t('doNotEndWith') : t('endsWith');
			} else if (value.mode === 'exactly') {
				mode = value.inverted ? t('areNotExactly') : t('are');
			} else if (value.mode === 'contains') {
				mode = value.inverted ? t('doNotContains') : t('contains');
			}

			return `${presence} ${label} ${mode} "${value.value}"`;
		}

		// CATCHALL
		default: {
			return `${label} "${value.value}"`;
		}
	}
};

const getValueFromObjectValue = (field, value, currentUILang) => {
	const { ops, assign } = field;
	// special for assigned delegated value and multilingual structure
	if (assign && currentUILang) {
		// label = label[currentUILang];
		if (value.value.length > 1) {
			value = {
				value: _.chain(value.value).map().reduce((a, v) => {
					return [ ...a, _.find(ops, o => o.value === v).label[currentUILang] ];
				}, []).value()
			};
		} else if (value.value.length) {
			value = {
				value: [ _.find(ops, o => o.value === value.value[0]).label[currentUILang] ],
			};
		}
	}
	return value;	
};

function resolveNumberFormat (t, value, conjunction) {
	conjunction = !conjunction ? t('is') : conjunction;
	let mode = '';
	if (value.mode === 'equals') mode = conjunction;
	else if (value.mode === 'gt') mode = `${conjunction} ${t('gt')}`;
	else if (value.mode === 'lt') mode = `${conjunction} ${t('lt')}`;

	const formattedValue = value.mode === 'between'
		? `${t('is')} ${t('between')} ${value.value.min} ${t('and')} ${value.value.max}`
		: value.value;

	return `${mode} ${formattedValue}`;
}

function resolveDateFormat (t, value, format, conjunction) {
	conjunction = !conjunction ? t('is') : conjunction;
	const joiner = value.inverted ? `${t('isNot')}` : conjunction;
	const mode = value.mode === 'on' ? '' : value.mode;
	const formattedValue = value.mode === 'between'
		? `${moment(value.after).format(format)} ${t('and')} ${moment(value.before).format(format)}`
		: moment(value.value).format(format);

	return `${joiner} ${mode} ${formattedValue}`;
}

module.exports = getFilterLabel;
