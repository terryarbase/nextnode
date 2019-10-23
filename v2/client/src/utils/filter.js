import moment from 'moment';
import _ from 'lodash';

// utils
import {
  translateListField,
} from './multilingual';

// locales
import i18n from './../i18n';

const DATE_FORMAT = 'MMM D YYYY';
const DATETIME_FORMAT = 'MMM D YYYY h:mm:ss';

const FilterLabeler = (listKey, field, value) => {
  const label = translateListField([
      listKey,
      field.path,
  ]);

  switch (field.type) {
    // BOOLEAN
    case 'boolean': {
      return value.value
        ? label
        : `${i18n.t('filter.not')} ${label}`;
    }

    // DATE
    case 'date': {
      return `${label} ${resolveDateFormat(value, DATE_FORMAT)}`;
    }

    // DATE ARRAY
    case 'datearray': {
      const presence = value.presence === 'some' ? i18n.t('filter.some') : i18n.t('filter.no');

      return `${presence} ${label} ${resolveDateFormat(value, DATETIME_FORMAT, i18n.t('filter.are'))}`;
    }

    // DATETIME
    case 'datetime': {
      return `${label} ${resolveDateFormat(value, DATETIME_FORMAT)}`;
    }

    // GEOPOINT
    // TODO distance needs a qualifier, currently defaults to "km"?
    case 'geopoint': {
      const mode = value.distance.mode === 'max' ? i18n.t('filter.isWithIn') : i18n.t('filter.isAtLeast');
      const distance = `${value.distance.value}km`;
      const conjunction = value.distance.mode === 'max' ? i18n.t('filter.of') : _.toLower(i18n.t('filter.from'));
      const latlong = `${value.lat}, ${value.lon}`;

      return `${label} ${mode} ${distance} ${conjunction} ${latlong}`;
    }

    // LOCATION
    case 'location': {
      const joiner = value.inverted ? _.lowerFirst(i18n.t('filter.doesNotMatch')) : i18n.t('filter.matches');

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
      return `${label} ${resolveNumberFormat(value)}`;
    }

    // NUMBER ARRAY
    case 'numberarray': {
      const presence = value.presence === 'some' ? i18n.t('filter.some') : i18n.t('filter.no');

      return `${presence} ${label} ${resolveNumberFormat(value, i18n.t('filter.are'))}`;
    }

    // PASSWORD
    case 'password': {
      return value.exists
        ? `${label} ${_.toLower(i18n.t('filter.isSet'))}`
        : `${label} ${_.toLower(i18n.t('filter.isNotSet'))}`;
    }

    // RELATIONSHIP
    // TODO populate relationship, currently rendering an ID
    case 'relationship': {
      let joiner = value.inverted ? i18n.t('filter.isNot') : i18n.t('filter.is');
      let formattedValue = (value.value.length > 1)
        ? value.value.join(`, ${i18n.t('filter.or')} `)
        : value.value[0];

      return `${label} ${joiner} ${formattedValue}`;
    }

    // SELECT
    case 'select': {
      const newValue = getValueFromObjectValue(field, value);
      // console.log(newValue);
      let joiner = newValue.inverted ? i18n.t('filter.isNot') : i18n.t('filter.is');
      let formattedValue = (newValue.value.length > 1)
        ? newValue.value.join(`, ${i18n.t('filter.or')} `)
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
        mode = value.inverted ? i18n.t('filter.doesNotBeginWith') : i18n.t('filter.beginsWith');
      } else if (value.mode === 'endsWith') {
        mode = value.inverted ? i18n.t('filter.doesNotEndWith') : i18n.t('filter.endsWith');
      } else if (value.mode === 'exactly') {
        mode = value.inverted ? i18n.t('filter.isNotExactly') : i18n.t('filter.is');
      } else if (value.mode === 'contains') {
        mode = value.inverted ? i18n.t('filter.doesNotContains') : i18n.t('filter.contains');
      }

      return `${label} ${mode} "${value.value}"`;
    }

    // TEXTARRAY
    case 'textarray': {
      const presence = value.presence === 'some' ? i18n.t('filter.some') : i18n.t('filter.no');
      let mode = '';
      if (value.mode === 'beginsWith') {
        mode = value.inverted ? i18n.t('filter.doNotBeginWith')  : i18n.t('filter.beginsWith');
      } else if (value.mode === 'endsWith') {
        mode = value.inverted ? i18n.t('filter.doNotEndWith') : i18n.t('filter.endsWith');
      } else if (value.mode === 'exactly') {
        mode = value.inverted ? i18n.t('filter.areNotExactly') : i18n.t('filter.are');
      } else if (value.mode === 'contains') {
        mode = value.inverted ? i18n.t('filter.doNotContains') : i18n.t('filter.contains');
      }

      return `${presence} ${label} ${mode} "${value.value}"`;
    }

    // CATCHALL
    default: {
      return `${label} "${value.value}"`;
    }
  }
};

const getValueFromObjectValue = (field, value) => {
  const { ops, assign } = field;
  const currentUILang = i18n.locale;
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

const resolveNumberFormat = (value, conjunction) => {
  conjunction = !conjunction ? i18n.t('filter.is') : conjunction;
  let mode = '';
  if (value.mode === 'equals') mode = conjunction;
  else if (value.mode === 'gt') mode = `${conjunction} ${i18n.t('filter.gt')}`;
  else if (value.mode === 'lt') mode = `${conjunction} ${i18n.t('filter.lt')}`;

  const formattedValue = value.mode === 'between'
    ? `${i18n.t('filter.is')} ${i18n.t('filter.between')} ${value.value.min} ${i18n.t('filter.and')} ${value.value.max}`
    : value.value;

  return `${mode} ${formattedValue}`;
}

const resolveDateFormat = (value, format, conjunction) => {
  conjunction = !conjunction ? i18n.t('filter.is') : conjunction;
  const joiner = value.inverted ? `${i18n.t('filter.isNot')}` : conjunction;
  const mode = value.mode === 'on' ? '' : value.mode;
  const formattedValue = value.mode === 'between'
    ? `${moment(value.after).format(format)} ${i18n.t('filter.and')} ${moment(value.before).format(format)}`
    : moment(value.value).format(format);

  return `${joiner} ${mode} ${formattedValue}`;
}

export default FilterLabeler;
