import React from 'react';
import _ from 'lodash';
import { findDOMNode } from 'react-dom';

import {
	FormField,
	FormInput,
	FormSelect,
} from '../../../admin/client/App/elemental';

const MODE_OPTIONS = [
	{ label: 'Contains', value: 'contains' },
	{ label: 'Exactly', value: 'exactly' },
	{ label: 'Begins with', value: 'beginsWith' },
	{ label: 'Ends with', value: 'endsWith' },
];

const PRESENCE_OPTIONS = [
	{ label: 'At least one element', value: 'some' },
	{ label: 'No element', value: 'none' },
];

function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		presence: PRESENCE_OPTIONS[0].value,
		value: '',
	};
}

var TextArrayFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			mode: React.PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
			presence: React.PropTypes.oneOf(PRESENCE_OPTIONS.map(i => i.value)),
			value: React.PropTypes.string,
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
	selectPresence (e) {
		const presence = e.target.value;
		this.updateFilter({ presence });
		findDOMNode(this.refs.focusTarget).focus();
	},
	updateValue (e) {
		this.updateFilter({ value: e.target.value });
	},
	render () {
		const { filter, t, list } = this.props;
		const moreOptions = _.map(MODE_OPTIONS, option => (
			{
				...option,
				...{
					label: t(_.camelCase(option.value)),
				},
			}
		));
		const presenceOptions = _.map(PRESENCE_OPTIONS, option => (
			{
				...option,
				...{
					label: t(_.camelCase(option.value)),
				},
			}
		));
		const mode = moreOptions.filter(i => i.value === filter.mode)[0];
		const presence = presenceOptions.filter(i => i.value === filter.presence)[0];
		// const beingVerb = mode.value === 'exactly' ? ' is ' : ' ';
		const placeholder = t(`form:table_${list.key}`) + ' ' + mode.label + '...';
		// const placeholder = presence.label + beingVerb + mode.label.toLowerCase() + '...';

		return (
			<div>
				<FormField>
					<FormSelect
						onChange={this.selectPresence}
						options={presenceOptions}
						value={presence.value}
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

module.exports = TextArrayFilter;
