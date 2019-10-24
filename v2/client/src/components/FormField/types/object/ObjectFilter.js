/*
TODO: Not sure what this should look like yet,
      it's currently basically a copy of the Boolean filter
      so that the Admin UI builds successfully
*/

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
	{ label: 'Has Values', value: true },
	{ label: 'Is Empty', value: false },
];

function getDefaultValue () {
	return {
		value: true,
	};
}

var ObjectFilter = createClass({
	propTypes: {
		filter: PropTypes.shape({
			value: PropTypes.bool,
		}),
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
				label: i18n.t(`filter.${_.camelCase(option.label)}`),
			}
		));
		return <SegmentedControl equalWidthSegments options={valueOptions} value={this.props.filter.value} onChange={this.updateValue} />;
	},
});

export default ObjectFilter;
