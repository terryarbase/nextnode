import { SketchPicker } from 'react-color';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import Field from '../Field';
import React from 'react';
// import {
// 	Button,
// } from '@material-ui/core';
import {
	Button,
	FormInput,
	InlineGroup as Group,
	InlineGroupSection as Section,
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
		onChange: PropTypesfunc,
		path: PropTypesstring,
		value: PropTypesstring,
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
		const className = `${css(classes.swatch)} e2e-type-color__swatch`;

		return (this.props.value) ? (
			<span
				className={className}
				style={{ color: this.props.value }}
				dangerouslySetInnerHTML={{ __html: coloredSwatch }}
			/>
		) : (
			<span
				className={className}
				dangerouslySetInnerHTML={{ __html: transparentSwatch }}
			/>
		);
	},
	renderField () {
		const { displayColorPicker } = this.state;

		return (
			<div className="e2e-type-color__wrapper" style={{ position: 'relative' }}>
				<Group>
					<Section grow>
						<FormInput
							autoComplete="off"
							name={this.getInputName(this.props.path)}
							onChange={this.valueChanged}
							ref="field"
							value={this.props.value}
						/>
					</Section>
					<Section>
						<Button onClick={this.handleClick} cssStyles={classes.button} data-e2e-type-color__button>
							{this.renderSwatch()}
						</Button>
					</Section>
				</Group>
				{displayColorPicker && (
					<div>
						<div
							className={css(classes.blockout)}
							data-e2e-type-color__blockout
							onClick={this.handleClose}
						/>
						<div className={css(classes.popover)} onClick={e => e.stopPropagation()} data-e2e-type-color__popover>
							<SketchPicker
								color={this.props.value}
								onChangeComplete={this.handlePickerChange}
								onClose={this.handleClose}
							/>
						</div>
					</div>
				)}
			</div>
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

module.exports = ColorField;
