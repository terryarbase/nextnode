// import PropTypes from 'prop-types';
import React from 'react';
import Field from '../Field';
import {
	Grid,
	InputAdornment,
	IconButton,
	Button,
} from '@material-ui/core';
import {
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import {
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
			passwordShow: false,
			confirmShow: false,
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
	setConfirmShow() {
		const {
			confirmShow,
		} = this.state;
		this.setState({
			confirmShow: !confirmShow,
		})
	},
	setPasswordShow() {
		const {
			passwordShow,
		} = this.state;
		this.setState({
			passwordShow: !passwordShow,
		})
	},

	handleMouseDownPassword (e) {
		e.preventDefault();
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
		const {
			passwordShow,
			confirmShow,
		} = this.state;
		return (
			<Grid
				container
				direction="row"
				justify="flex-start"
		  		alignItems="center"
		  		spacing={3}
			>
				<Grid item xs>
					<FormInput
						autoComplete="off"
						name={this.getInputName(this.props.path)}
						onChange={this.valueChanged.bind(this, 'password')}
						placeholder={i18n.t('list.newPassword')}
						type={passwordShow ? 'text' : 'password'}
						size="full"
						value={this.state.password}
						inputProps={{
				          endAdornment: (
				            <InputAdornment position="end">
				              <IconButton
				                edge="end"
				                aria-label={i18n.t('login.toggle')}
				                onClick={this.setPasswordShow}
				                onMouseDown={this.handleMouseDownPassword}
				              >
				                {
				                  passwordShow ? 
				                  <VisibilityOff /> : 
				                  <Visibility />
				                }
				              </IconButton>
				            </InputAdornment>
				          ),
				        }}
					/>
				</Grid>
				<Grid item xs>
					<FormInput
						autoComplete="off"
						name={this.getInputName(this.props.paths.confirm)}
						onChange={this.valueChanged.bind(this, 'confirm')}
						placeholder={i18n.t('list.confirmPwd')} value={this.state.confirm}
						type={confirmShow ? 'text' : 'password'}
						size="full"
						inputProps={{
				          endAdornment: (
				            <InputAdornment position="end">
				              <IconButton
				                edge="end"
				                aria-label={i18n.t('login.toggle')}
				                onClick={this.setConfirmShow}
				                onMouseDown={this.handleMouseDownPassword}
				              >
				                {
				                  confirmShow ? 
				                  <VisibilityOff /> : 
				                  <Visibility />
				                }
				              </IconButton>
				            </InputAdornment>
				          ),
				        }}
					/>
				</Grid>
				{this.state.passwordIsSet ? (
					<Grid item xs>
						<Button variant="contained" color="primary" onClick={this.onCancel}>{i18n.t('list.cancel')}</Button>
					</Grid>
				) : null}
			</Grid>
		);
	},

	renderChangeButton () {
		var label = this.state.passwordIsSet
			? i18n.t('list.changePwd')
			: i18n.t('list.setPassword');

		return (
			<Button variant="contained" color="primary" onClick={this.showChangeUI}>{label}</Button>
		);
	},

});
