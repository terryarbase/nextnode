import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
import _ from 'lodash';
import { findDOMNode } from 'react-dom';

import {
	FormField,
	FormInput,
	Grid,
	SegmentedControl,
} from '../../elemental';

// locales
import i18n from '../../../../i18n';

const INVERTED_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true },
];

function getDefaultValue () {
	return {
		inverted: INVERTED_OPTIONS[0].value,
		street: undefined,
		city: undefined,
		state: undefined,
		code: undefined,
		country: undefined,
	};
}

var TextFilter = createClass({
	propTypes: {
		filter: PropTypes.shape({
			inverted: PropTypes.boolean,
			street: PropTypes.string,
			city: PropTypes.string,
			state: PropTypes.string,
			code: PropTypes.string,
			country: PropTypes.string,
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
	updateFilter (key, val) {
		const update = {};
		update[key] = val;
		this.props.onChange(Object.assign(this.props.filter, update));
	},
	toggleInverted (value) {
		this.updateFilter('inverted', value);
		findDOMNode(this.refs.focusTarget).focus();
	},
	updateValue (e) {
		this.updateFilter(e.target.name, e.target.value);
	},
	render () {
		const { filter } = this.props;
		const invertedOptions = _.map(INVERTED_OPTIONS, option => (
			{
				...option,
				label: i18n.t(`filter.${_.camelCase(option.label)}`),
			}
		));
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
					<FormInput
						autoFocus
						name="street"
						onChange={this.updateValue}
						placeholder={i18n.t('filter.address')}
						ref="focusTarget"
						value={filter.street}
					/>
				</FormField>
				<Grid.Row gutter={10}>
					<Grid.Col xsmall="two-thirds">
						<FormInput
							name="city"
							onChange={this.updateValue}
							placeholder={i18n.t('filter.city')}
							style={{ marginBottom: '1em' }}
							value={filter.city}
						/>
					</Grid.Col>
					<Grid.Col xsmall="one-third">
						<FormInput
							name="state"
							onChange={this.updateValue}
							placeholder={i18n.t('filter.state')}
							style={{ marginBottom: '1em' }}
							value={filter.state}
						/>
					</Grid.Col>
					<Grid.Col xsmall="one-third" style={{ marginBottom: 0 }}>
						<FormInput
							name="code"
							onChange={this.updateValue}
							placeholder={i18n.t('filter.postCode')}
							value={filter.code}
						/>
					</Grid.Col>
					<Grid.Col xsmall="two-thirds" style={{ marginBottom: 0 }}>
						<FormInput
							name="country"
							onChange={this.updateValue}
							placeholder={i18n.t('filter.country')}
							value={filter.country}
						/>
					</Grid.Col>
				</Grid.Row>
			</div>
		);
	},
});

export default TextFilter;
