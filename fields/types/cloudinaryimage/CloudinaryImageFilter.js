import React from 'react';
import _ from 'lodash';

import { SegmentedControl } from '../../../admin/client/App/elemental';

const OPTIONS = [
	{ label: 'Is Set', value: true },
	{ label: 'Is NOT Set', value: false },
];

function getDefaultValue () {
	return {
		exists: true,
	};
}

var CloudinaryImageFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			exists: React.PropTypes.oneOf(OPTIONS.map(i => i.value)),
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
		const { filter, t } = this.props;
		const options = _.map(OPTIONS, option => (
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
				options={options}
				value={filter.exists}
			/>
		);
	},
});

module.exports = CloudinaryImageFilter;
