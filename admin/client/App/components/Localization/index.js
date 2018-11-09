import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

var LocalizationSelector = React.createClass({
	displayName: 'LocalizationSelector',
	propTypes: {
		language: React.PropTypes.string,
		localization: React.PropTypes.bool,
		onSelect: React.PropTypes.func,
	},
	getInitialState () {
		return {
			accountSettingIsVisible: false,
		};
	},
	renderLanguageSelection(language, localization) {
		return Object.keys(localization).map(key => 
			<MenuItem
				key={key}
				active={language === localization[key].value}
				eventKey={localization[key].value}>
				{localization[key].label}
			</MenuItem>
		);
	},
	renderLanguageSwitcher() {
		const { language } = this.props;
		const { localization } = Keystone;
		console.log(localization[language], localization, language);
		return (
			<DropdownButton
				bsStyle="default"
				key={language}
				title={localization[language] ? localization[language].label : ''}
				id="language-switcher"
			>
				{this.renderLanguageSelection(language, localization)}
			</DropdownButton>
		)
	},

	render () {
		const { className } = this.props;
		return (
			<div className={className}>
				{this.renderLanguageSwitcher()}
			</div>
		);
	},
});

module.exports = LocalizationSelector;
