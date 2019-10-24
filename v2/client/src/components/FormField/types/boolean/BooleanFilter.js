import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import _ from 'lodash';
import { SegmentedControl } from '../../elemental';

// locales
import i18n from '../../../../i18n';

const VALUE_OPTIONS = [
	{ label: 'Is Checked', value: true },
	{ label: 'Is NOT Checked', value: false },
];

function getDefaultValue () {
	return {
		value: true,
	};
}

var BooleanFilter = createClass({
	propTypes: {
		filter: PropTypes.shape({
			value: PropTypes.bool,
		}),
	},
	statics: {
		getDefaultValue: getDefaultValue,
	},
	getDefaultProps () {
		return {
			filter: getDefaultValue(),
		};
	},
	updateValue (value) {
		this.props.onChange({ value });
	},
	render () {
		const valueOptions = _.map(VALUE_OPTIONS, option => (
			{
				...option,
				label: i18n.t(`filter.${_.camelCase(option.label)}`)
			}
		));
		return <SegmentedControl equalWidthSegments options={valueOptions} value={this.props.filter.value} onChange={this.updateValue} />;
	},
});

export default BooleanFilter;
