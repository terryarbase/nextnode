import React from 'react';
import _ from 'lodash';
import { SegmentedControl } from '../../../admin/client/App/elemental';

const VALUE_OPTIONS = [
	{ label: 'Is Checked', value: true },
	{ label: 'Is NOT Checked', value: false },
];

function getDefaultValue () {
	return {
		value: true,
	};
}

var BooleanFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			value: React.PropTypes.bool,
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
		const { t } = this.props;
		const valueOptions = _.map(VALUE_OPTIONS, option => (
			{
				...option,
				...{
					label: t(_.camelCase(option.label)),
				},
			}
		));
		return <SegmentedControl equalWidthSegments options={valueOptions} value={this.props.filter.value} onChange={this.updateValue} />;
	},
});

module.exports = BooleanFilter;
