import React from 'react';
import Field from '../Field';
import { GlyphButton, FormInput, Button } from '../../../admin/client/App/elemental';

module.exports = Field.create({
	displayName: 'URLField',
	statics: {
		type: 'Url',
	},
	openValue () {
		var href = this.props.value;
		if (!href) return;
		if (!/^(mailto\:)|(\w+\:\/\/)/.test(href)) {
			href = 'http://' + href;
		}
		window.open(href);
	},
	renderLink () {
		if (!this.props.value) return null;
		const { downable } = this.props;
		if (downable) {
			return this.renderDownloadButton();
		}
		return (
			<GlyphButton
				className="keystone-relational-button"
				glyph="link"
				onClick={this.openValue}
				title={'Open ' + this.props.value + ' in a new tab'}
				variant="link"
			/>
		);
	},
	renderField () {
		const { downable } = this.props;
		if (downable) {
			return this.renderDownloadButton();
		}
		return (
			<FormInput
				autoComplete="off"
				name={this.getInputName(this.props.path)}
				onChange={this.valueChanged}
				ref="focusTarget"
				type="url"
				value={this.props.value}
			/>
		);
	},
	wrapField () {
		return (
			<div style={{ position: 'relative' }}>
				{this.renderField()}
				{this.renderLink()}
			</div>
		);
	},
	renderDownloadButton() {
		const {
			label, 
			value,
			t,
		} = this.props;
		return (
			<Button variant="link" onClick={value && this.openValue}>
				{t('downloadItem', { name: label })}
			</Button>
		);
	},
	renderValue () {
		const { value, label, downable } = this.props;
		if (downable) {
			return this.renderDownloadButton();
		}
		return (
			<FormInput noedit onClick={value && this.openValue}>
				{value}
			</FormInput>
		);
	},
});
