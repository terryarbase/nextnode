import React from 'react';
import PropTypes from 'prop-types';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
import _ from 'lodash';
import {
	FormField,
	FormInput,
	Grid,
	SegmentedControl,
} from '../../elemental';

// locales
import i18n from '../../../../i18n';

const DISTANCE_OPTIONS = [
	{ label: 'Max distance (km)', value: 'max' },
	{ label: 'Min distance (km)', value: 'min' },
];

function getDefaultValue () {
	return {
		lat: undefined,
		lon: undefined,
		distance: {
			mode: DISTANCE_OPTIONS[0].value,
			value: undefined,
		},
	};
}

var TextFilter = createClass({
	propTypes: {
		filter: PropTypes.shape({
			lat: PropTypes.number,
			lon: PropTypes.number,
			distance: PropTypes.shape({
				mode: PropTypes.string,
				value: PropTypes.number,
			}),
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
	changeLat (evt) {
		this.updateFilter({ lat: evt.target.value });
	},
	changeLon (evt) {
		this.updateFilter({ lon: evt.target.value });
	},
	changeDistanceValue (evt) {
		this.updateFilter({
			distance: {
				mode: this.props.filter.distance.mode,
				value: evt.target.value,
			},
		});
	},
	changeDistanceMode (mode) {
		this.updateFilter({
			distance: {
				mode,
				value: this.props.filter.distance.value,
			},
		});
	},
	render () {
		const { filter } = this.props;
		const distanceModeVerb = filter.distance.mode === 'max' ? i18n.t('filter.maximum') : i18n.t('filter.minimum');
		const distanceOptions = _.map(DISTANCE_OPTIONS, option => (
			{
				...option,
				label: i18n.t(`filter.${_.camelCase(option.value)}`),
			}
		));
		return (
			<div>
				<Grid.Row xsmall="one-half" gutter={10}>
					<Grid.Col>
						<FormField label={i18n.t('filter.latitude')} >
							<FormInput
								autoFocus
								onChange={this.changeLat}
								placeholder={i18n.t('filter.latitude')}
								ref="latitude"
								required="true"
								step={0.01}
								type="number"
								value={filter.lat}
							/>
						</FormField>
					</Grid.Col>
					<Grid.Col>
						<FormField label={i18n.t('filter.longitude')}>
							<FormInput
								onChange={this.changeLon}
								placeholder={i18n.t('filter.longitude')}
								ref="longitude"
								required="true"
								step={0.01}
								type="number"
								value={filter.lon}
							/>
						</FormField>
					</Grid.Col>
				</Grid.Row>
				<FormField>
					<SegmentedControl
						equalWidthSegments
						onChange={this.changeDistanceMode}
						options={distanceOptions}
						value={this.props.filter.distance.mode}
					/>
				</FormField>
				<FormInput
					onChange={this.changeDistanceValue}
					placeholder={distanceModeVerb}
					ref="distance"
					type="number"
					value={filter.distance.value}
				/>
			</div>
		);
	},
});

export default TextFilter;
