import React from 'react';
import _ from 'lodash';
import {
	FormField,
	FormInput,
	Grid,
	SegmentedControl,
} from '../../../admin/client/App/elemental';

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

var TextFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			lat: React.PropTypes.number,
			lon: React.PropTypes.number,
			distance: React.PropTypes.shape({
				mode: React.PropTypes.string,
				value: React.PropTypes.number,
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
		const { filter, t } = this.props;
		const distanceModeVerb = filter.distance.mode === 'max' ? t('maximum') : t('minimum');
		const distanceOptions = _.map(DISTANCE_OPTIONS, option => (
			{
				...option,
				...{
					label: t(_.camelCase(option.value)),
				},
			}
		));
		return (
			<div>
				<Grid.Row xsmall="one-half" gutter={10}>
					<Grid.Col>
						<FormField label={t('latitude')} >
							<FormInput
								autoFocus
								onChange={this.changeLat}
								placeholder={t('latitude')}
								ref="latitude"
								required="true"
								step={0.01}
								type="number"
								value={filter.lat}
							/>
						</FormField>
					</Grid.Col>
					<Grid.Col>
						<FormField label={t('longitude')}>
							<FormInput
								onChange={this.changeLon}
								placeholder={t('longitude')}
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

module.exports = TextFilter;
