import Field from '../Field';
import React, { PropTypes } from 'react';
import {
	FormInput,
	Grid,
} from '../../../admin/client/App/elemental';

const NAME_SHAPE = {
	first: PropTypes.string,
	last: PropTypes.string,
};

module.exports = Field.create({
	displayName: 'NameField',
	statics: {
		type: 'Name',
		getDefaultValue: () => {
			return {
				// first: '',
				// last: '',
			};
		},
	},
	propTypes: {
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		paths: PropTypes.shape(NAME_SHAPE).isRequired,
		value: PropTypes.oneOfType([
			PropTypes.shape(NAME_SHAPE),
			PropTypes.string,
		]),
	},

	valueChanged: function (which, event) {
		const { value = {}, path, onChange } = this.props;
		onChange({
			path,
			value: {
				...value,
				[which]: event.target.value,
			},
		});
	},
	changeFirst: function (event) {
		return this.valueChanged('first', event);
	},
	changeLast: function (event) {
		return this.valueChanged('last', event);
	},
	renderValue () {
		const inputStyle = { width: '100%' };
		const { value = {} } = this.props;

		return (
			<Grid.Row small="one-half" gutter={10}>
				<Grid.Col>
					<FormInput noedit style={inputStyle}>
						{value.first}
					</FormInput>
				</Grid.Col>
				<Grid.Col>
					<FormInput noedit style={inputStyle}>
						{value.last}
					</FormInput>
				</Grid.Col>
			</Grid.Row>
		);
	},
	renderField () {
		// name={this.getInputName(paths.first)}
		// name={this.getInputName(paths.last)}
		const { value = {}, path, paths, autoFocus, t } = this.props;
		return (
			<Grid.Row small="one-half" gutter={10}>
				<Grid.Col>
					<FormInput
						autoFocus={autoFocus}
						autoComplete="off"
						name={this.getInputName(path)}
						onChange={this.changeFirst}
						placeholder={t('firstName')}
						value={value.first || ''}
					/>
				</Grid.Col>
				<Grid.Col>
					<FormInput
						autoComplete="off"
						onChange={this.changeLast}
						placeholder={t("lastName")}
						value={value.last || ''}
					/>
				</Grid.Col>
			</Grid.Row>
		);
	},
});
