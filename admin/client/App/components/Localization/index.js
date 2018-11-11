import React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';

var LocalizationSelector = React.createClass({
	displayName: 'LocalizationSelector',
	propTypes: {
		languag: React.PropTypes.string,
		localization: React.PropTypes.bool,
		defaultLang: React.PropTypes.string,
		onChangeLanguage: React.PropTypes.func,
	},
	getInitialState () {
		return {
			accountSettingIsVisible: false,
		};
	},
	renderLanguageSelection(defaultLanguage, language, localization) {
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
				<span>{localization[key].label}{defaultLanguage === localization[key].value ? ' (Default)' : ''}</span>
			</MenuItem>
		);
	},
	renderLanguageSwitcher() {
		const { language, defaultLanguage } = this.props;
		const { localization } = Keystone;
		// console.log(localization[language], localization, language);
		return (
			<Dropdown id="language-switcher" onSelect={this.props.onChangeLanguage}>
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
			    	{this.renderLanguageSelection(defaultLanguage, language, localization)}
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
