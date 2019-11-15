import { SketchPicker } from 'react-color';
import PropTypes from 'prop-types';
// import { css } from 'glamor';
import Field from '../Field';
import React from 'react';
import {
	Button,
	Grid,
	Dialog,
} from '@material-ui/core';
import {
	// Button,
	FormInput,
	// InlineGroup as Group,
	// InlineGroupSection as Section,
} from '../../elemental';
import transparentSwatch from './transparent-swatch';
import coloredSwatch from './colored-swatch';
import theme from '../../theme';

const ColorField = Field.create({
	displayName: 'ColorField',
	statics: {
		type: 'Color',
	},
	propTypes: {
		onChange: PropTypes.func,
		path: PropTypes.string,
		value: PropTypes.string,
	},

	getInitialState () {
		return {
			displayColorPicker: false,
		};
	},
	updateValue (value) {
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},
	handleInputChange (event) {
		var newValue = event.target.value;
		if (/^([0-9A-F]{3}){1,2}$/.test(newValue)) {
			newValue = '#' + newValue;
		}
		if (newValue === this.props.value) return;

		this.updateValue(newValue);
	},
	handleClick () {
		this.setState({ displayColorPicker: !this.state.displayColorPicker });
	},
	handleClose () {
		this.setState({ displayColorPicker: false });
	},
	handlePickerChange (color) {
		var newValue = color.hex;

		if (newValue === this.props.value) return;

		this.updateValue(newValue);
	},
	renderSwatch () {
		return (this.props.value) ? (
			<span
				style={{ color: this.props.value }}
				dangerouslySetInnerHTML={{ __html: coloredSwatch }}
			/>
		) : (
			<span
				dangerouslySetInnerHTML={{ __html: transparentSwatch }}
			/>
		);
	},
	renderField () {
		const { displayColorPicker } = this.state;

		return (
			<React.Fragment>
				<Grid
					container
					direction="row"
					justify="flex-start"
			  		alignItems="center"
			  		spacing={3}
				>
					<Grid item>
						<FormInput
							size="full"
							errorMessage={this.props.errorMessage}
							autoComplete="off"
							label={this.props.path}
							name={this.getInputName(this.props.path)}
							onChange={this.valueChanged}
							value={this.props.value}
						/>
					</Grid>
					<Grid item xs>
						<Button onClick={this.handleClick}>
							{this.renderSwatch()}
						</Button>
					</Grid>
				</Grid>
				<Dialog open={displayColorPicker} onClose={this.handleClose}>
					<SketchPicker
						color={this.props.value}
						onChangeComplete={this.handlePickerChange}
						onClose={this.handleClose}
					/>
				</Dialog>
			</React.Fragment>
		);
	},
});

/* eslint quote-props: ["error", "as-needed"] */
const classes = {
	button: {
		background: 'white',
		padding: 4,
		width: theme.component.height,

		':hover': {
			background: 'white',
		},
	},
	blockout: {
		bottom: 0,
		left: 0,
		position: 'fixed',
		right: 0,
		top: 0,
		zIndex: 1,
	},
	popover: {
		marginTop: 10,
		position: 'absolute',
		left: 0,
		zIndex: 500,
	},
	swatch: {
		borderRadius: 1,
		boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
		display: 'block',
		' svg': {
			display: 'block',
		},
	},
};

export default ColorField;
