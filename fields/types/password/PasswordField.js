import React from 'react';
import Field from '../Field';
import {
	Button,
	FormInput,
	InlineGroup as Group,
	InlineGroupSection as Section,
} from '../../../admin/client/App/elemental';

module.exports = Field.create({

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
		const { t } = this.props;
		return <FormInput noedit>{this.props.value ? t('passwordSet') : ''}</FormInput>;
	},

	renderField () {
		return this.state.showChangeUI ? this.renderFields() : this.renderChangeButton();
	},

	renderFields () {
		const { t } = this.props;
		return (
			<Group block>
				<Section grow>
					<FormInput
						autoComplete="off"
						name={this.getInputName(this.props.path)}
						onChange={this.valueChanged.bind(this, 'password')}
						placeholder={t('newPassword')}
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
						placeholder={t('confirmPwd')} value={this.state.confirm}
						type="password"
						id={1}
					/>
				</Section>
				{this.state.passwordIsSet ? (
					<Section>
						<Button onClick={this.onCancel}>{t('cancel')}</Button>
					</Section>
				) : null}
			</Group>
		);
	},

	renderChangeButton () {
		const { t } = this.props;
		var label = this.state.passwordIsSet
			? t('changePwd')
			: t('setPassword');

		return (
			<Button ref="focusTarget" onClick={this.showChangeUI}>{label}</Button>
		);
	},

});
