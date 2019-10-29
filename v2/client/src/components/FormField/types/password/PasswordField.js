// import PropTypes from 'prop-types';
import React from 'react';
import Field from '../Field';
import {
	Button,
	FormInput,
	InlineGroup as Group,
	InlineGroupSection as Section,
} from '../../elemental';

// locales
import i18n from '../../../../i18n';

export default Field.create({

	displayName: 'PasswordField',
	statics: {
		type: 'Password',
	},

	getInitialState () {
		return {
			passwordIsSet: this.props.value ? true : false,
			showChangeUI: this.props.mode === 'create' ? true : false,
			password: '',
			confirm: '',
		};
	},

	valueChanged (which, event) {
		var newState = {};
		newState[which] = event.target.value;
		this.setState(newState);
	},

	showChangeUI () {
		this.setState({
			showChangeUI: true,
		}, () => this.focus());
	},

	onCancel () {
		this.setState({
			showChangeUI: false,
		}, () => this.focus());
	},

	renderValue () {
		return <FormInput noedit>{this.props.value ? i18n.t('list.passwordSet') : ''}</FormInput>;
	},

	renderField () {
		return this.state.showChangeUI ? this.renderFields() : this.renderChangeButton();
	},

	renderFields () {
		return (
			<Group block>
				<Section grow>
					<FormInput
						autoComplete="off"
						name={this.getInputName(this.props.path)}
						onChange={this.valueChanged.bind(this, 'password')}
						placeholder={i18n.t('list.newPassword')}
						ref="focusTarget"
						type="password"
						id={0}
						value={this.state.password}
					/>
				</Section>
				<Section grow>
					<FormInput
						autoComplete="off"
						name={this.getInputName(this.props.paths.confirm)}
						onChange={this.valueChanged.bind(this, 'confirm')}
						placeholder={i18n.t('list.confirmPwd')} value={this.state.confirm}
						type="password"
						id={1}
					/>
				</Section>
				{this.state.passwordIsSet ? (
					<Section>
						<Button onClick={this.onCancel}>{i18n.t('list.cancel')}</Button>
					</Section>
				) : null}
			</Group>
		);
	},

	renderChangeButton () {
		var label = this.state.passwordIsSet
			? i18n.t('list.changePwd')
			: i18n.t('list.setPassword');

		return (
			<Button ref="focusTarget" onClick={this.showChangeUI}>{label}</Button>
		);
	},

});
