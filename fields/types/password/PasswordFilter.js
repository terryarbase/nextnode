import React from 'react';
import _ from 'lodash';

import { SegmentedControl } from '../../../admin/client/App/elemental';

const EXISTS_OPTIONS = [
	{ label: 'Is Set', value: true },
	{ label: 'Is NOT Set', value: false },
];

function getDefaultValue () {
	return {
		exists: true,
	};
}

var PasswordFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			exists: React.PropTypes.oneOf(EXISTS_OPTIONS.map(i => i.value)),
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
	toggleExists (value) {
		this.props.onChange({ exists: value });
	},
	render () {
		const { filter, t, list } = this.props;
		const existsOptions = _.map(EXISTS_OPTIONS, option => (
			{
				...option,
				...{
					label: t(_.camelCase(option.label)),
				},
			}
		));
		return (
			<SegmentedControl
				equalWidthSegments
				onChange={this.toggleExists}
				options={existsOptions}
				value={filter.exists}
			/>
		);
	},
});

module.exports = PasswordFilter;
