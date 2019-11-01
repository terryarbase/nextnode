// import PropTypes from 'prop-types';
import Field from '../Field';
import React from 'react';
import {
	Grid,
} from '@material-ui/core';

import {
	FormInput,
	// Grid,
} from '../../elemental';

// locales
import i18n from '../../../../i18n';

export default Field.create({

	displayName: 'GeopointField',
	statics: {
		type: 'Geopoint',
	},

	focusTargetRef: 'lat',

	handleLat (event) {
		const { value = [], path, onChange } = this.props;
		const newVal = event.target.value;
		onChange({
			path,
			value: [value[0], newVal],
		});
	},

	handleLong (event) {
		const { value = [], path, onChange } = this.props;
		const newVal = event.target.value;
		onChange({
			path,
			value: [newVal, value[1]],
		});
	},

	renderValue () {
		const { value } = this.props;
		if (value && value[1] && value[0]) {
			return <FormInput noedit>{value[1]}, {value[0]}</FormInput>; // eslint-disable-line comma-spacing
		}
		return <FormInput noedit>(not set)</FormInput>;
	},

	renderField () {
		const { value = [], path } = this.props;
		return (
			<Grid
				container
				direction="row"
				justify="flex-start"
		  		alignItems="center"
		  		spacing={3}
			>
				<Grid item xs={3}>
					<FormInput
						autoComplete="off"
						size="full"
						name={this.getInputName(path + '[1]')}
						onChange={this.handleLat}
						placeholder={i18n.t('list.latitude')}
						value={value[1]}
					/>
				</Grid>
				<Grid item xs={3}>
					<FormInput
						autoComplete="off"
						name={this.getInputName(path + '[0]')}
						onChange={this.handleLong}
						size="full"
						placeholder={i18n.t('list.longitude')}
						value={value[0]}
					/>
				</Grid>
			</Grid>
		);
	},

});
