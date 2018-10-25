/*
** The global Account Setting, displays a popover modal to modify the password
** Terry Chan @ 11/10/2018
*/

import React from 'react';
import assign from 'object-assign';
import _ from 'lodash';
import { Fields } from 'FieldTypes';
import xhr from 'xhr';
import AlertMessages from '../../shared/AlertMessages';
import { Button, Form, Modal } from '../../elemental';

const schema = 'User';

var Setting = React.createClass({
	displayName: 'Setting',
	propTypes: {
		isOpen: React.PropTypes.bool.isRequired,
		err: React.PropTypes.object,
		onCancel: React.PropTypes.func,
		onUpdate: React.PropTypes.func,
		user: React.PropTypes.object,
		User: React.PropTypes.object, // eslint-disable-line react/sort-prop-types
	},
	getDefaultProps () {
		const lists = Keystone.lists || {};
		// window.console.warn('Setting-getDefaultProps: ', lists);
		return {
			err: null,
			isOpen: false,
			list: lists && lists[schema],
		};
	},
	getInitialState () {
		// Set the field values to their default values when first rendering the
		// form. (If they have a default value, that is)
		return {
			values: {},
			alerts: {},
			loading: false,
		};
	},
	displayMsg (msg) {
		this.setState({
			alerts: msg,
		});
	},
	closeModal() {
		this.setState(this.getInitialState());
		this.props.onCancel();
	},
	submitForm (event) {
		event.preventDefault();
		const createForm = event.target;
		const formData = new FormData(createForm);
		this.setState({ loading: true });
		const { list } = this.props;

		xhr({
			url: `${Keystone.adminPath}/api/${list.path}/updateMyProfile?ts=${Math.random()}`,
			method: 'post',
			responseType: 'json',
			body: formData,
			headers: assign({}, Keystone.csrf.header),
		}, (err, resp, body) => {
			console.log(err, resp, body);
			if (err || body && body.error) {
				this.displayMsg({
					error: body.error ? body : err,
				});
				this.setState({ loading: false });
			} else if (resp.statusCode === 200) {
				this.displayMsg({
					success: {
						success: 'Your profile have been changed successfully. You are able to get the latest profile in the next login.',
					},
				});
				const self = this;
				setTimeout(() => {
					self.closeModal();
				}, 1500);
			}
			
		});
	},
	// Handle input change events
	handleChange (event) {
		var values = assign({}, this.state.values);
		values[event.path] = event.value;
		this.setState({
			values: values,
		});
	},
	getFieldProps (field) {
		var props = assign({}, field);
		props.value = this.state.values[field.path] || '';
		props.values = this.state.values;
		props.onChange = this.handleChange;
		props.mode = 'create';
		props.key = field.path;
		return props;
	},
	renderForm () {
		const { user, onCancel, list } = this.props;
		const { loading } = this.state;
		// window.console.warn('Fields: ', Fields['password']);
		const fieldToBe = ['password'];
		const form = fieldToBe.reduce((f, current) => {
			const field = list.fields[current];
			const fieldPorps = this.getFieldProps(field);
			f = _.concat([], f, [
				React.createElement(Fields[field.type], fieldPorps),
			]);
			return f;
		}, []);
		return (
			<Form layout="horizontal" onSubmit={this.submitForm}>
				<Modal.Header
					text="Change My Account Setting"
					showCloseButton
				/>
				<Modal.Body>
					{(this.state.alerts) ? <AlertMessages alerts={this.state.alerts} /> : null}
					{ form }
				</Modal.Body>
				<Modal.Footer>
					<Button
						color="success"
						type="submit"
						data-button-type="submit"
						disabled={loading}
					>
						{!loading ? 'Update My Account' : 'Updating...'}
					</Button>
					<Button
						variant="link"
						color="cancel"
						data-button-type="cancel"
						onClick={this.closeModal}
					>
						Cancel
					</Button>
				</Modal.Footer>
			</Form>
		);
	},
	render () {
		return (
			<Modal.Dialog
				isOpen={this.props.isOpen}
				onClose={this.closeModal}
				backdropClosesModal
			>
				{this.renderForm()}
			</Modal.Dialog>
		);
	},
});

module.exports = Setting;
