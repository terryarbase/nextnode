import React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';
import {
	setCurrentLanguage,
} from '../../screens/List/actions';

var LocalizationSelector = React.createClass({
	displayName: 'LocalizationSelector',
	propTypes: {
		language: React.PropTypes.string,
		defaultLang: React.PropTypes.string,
		localization: React.PropTypes.bool,
	},
	getInitialState () {
		return {
			accountSettingIsVisible: false,
		};
	},
	onChangeLanguage (lang) {
		this.props.dispatch(setCurrentLanguage(lang));
	},
	renderLanguageSelection(defaultLang, language, localization) {
		return Object.keys(localization).map(key => 
			<MenuItem
				key={key}
				active={language === localization[key].value}
				eventKey={localization[key].value}>
				{
					localization[key].icon ? 
					<img
						src={`data:image/png;base64,${localization[key].icon}`}
						alt={localization[key].label}
					/> : null
				}
				<span>{localization[key].label}{defaultLang === localization[key].value ? ' (Default)' : ''}</span>
			</MenuItem>
		);
	},
	renderLanguageSwitcher() {
		const { defaultLang, language } = this.props;
		const { localization } = Keystone;
		// console.log(Keystone, localization, language);
		return (
			<Dropdown id="language-switcher" onSelect={this.onChangeLanguage}>
			    <Dropdown.Toggle>
			      	{
						localization[language].icon ? 
						<img
							src={`data:image/png;base64,${localization[language].icon}`}
							alt={localization[language].label}
						/> : null
					}
			      	{localization[language] ? localization[language].label : ''}
			    </Dropdown.Toggle>
			    <Dropdown.Menu>
			    	{this.renderLanguageSelection(defaultLang, language, localization)}
    			</Dropdown.Menu>
    		</Dropdown>
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
