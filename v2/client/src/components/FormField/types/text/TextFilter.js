import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
import { findDOMNode } from 'react-dom';

import {
	FormField,
	FormInput,
	FormSelect,
	SegmentedControl,
} from '../../elemental';

const INVERTED_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true },
];

const MODE_OPTIONS = [
	{ label: 'Contains', value: 'contains' },
	{ label: 'Exactly', value: 'exactly' },
	{ label: 'Begins with', value: 'beginsWith' },
	{ label: 'Ends with', value: 'endsWith' },
];

function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		inverted: INVERTED_OPTIONS[0].value,
		value: '',
	};
}

var TextFilter = createClass({
	propTypes: {
		filter: PropTypes.shape({
			mode: PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
			inverted: PropTypes.boolean,
			value: PropTypes.string,
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
	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	},
	selectMode (e) {
		const mode = e.target.value;
		this.updateFilter({ mode });
		findDOMNode(this.refs.focusTarget).focus();
	},
	toggleInverted (inverted) {
		this.updateFilter({ inverted });
		findDOMNode(this.refs.focusTarget).focus();
	},
	updateValue (e) {
		this.updateFilter({ value: e.target.value });
	},
	render () {
		const { filter, t, list } = this.props;
		const invertedOptions = _.map(INVERTED_OPTIONS, option => (
			{
				...option,
				label: t(_.camelCase(option.label))
			}
		));
		const moreOptions = _.map(MODE_OPTIONS, option => (
			{
				...option,
				label: t(_.camelCase(option.value)),
			}
		));
		const mode = moreOptions.filter(i => i.value === filter.mode)[0];
		// console.log(filter.mode, mode);
		const placeholder = t(`form:table_${list.key}`) + ' ' + mode.label + '...';
		return (
			<div>
				<FormField>
					<SegmentedControl
						equalWidthSegments
						onChange={this.toggleInverted}
						options={invertedOptions}
						value={filter.inverted}
					/>
				</FormField>
				<FormField>
					<FormSelect
						onChange={this.selectMode}
						options={moreOptions}
						value={mode.value}
					/>
				</FormField>
				<FormInput
					autoFocus
					onChange={this.updateValue}
					placeholder={placeholder}
					ref="focusTarget"
					value={this.props.filter.value}
				/>
			</div>
		);
	},
});

export default TextFilter;
