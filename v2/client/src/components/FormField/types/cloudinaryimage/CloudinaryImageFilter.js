import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

import _ from 'lodash';

import { SegmentedControl } from '../../elemental';

const OPTIONS = [
	{ label: 'Is Set', value: true },
	{ label: 'Is NOT Set', value: false },
];

function getDefaultValue () {
	return {
		exists: true,
	};
}

var CloudinaryImageFilter = createClass({
	propTypes: {
		filter: PropTypes.shape({
			exists: PropTypes.oneOf(OPTIONS.map(i => i.value)),
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

export default CloudinaryImageFilter;
