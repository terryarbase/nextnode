/**
 * The primary (i.e. uppermost) navigation on desktop. Renders all sections and
 * the home-, website- and signout buttons.
 */

import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { css } from 'glamor';
import { Link } from 'react-router';
import { translate } from "react-i18next";
import { Container } from '../../../elemental';
// Components
import PrimaryNavItem from './NavItem';
import AccountSetting from '../../Setting';

var PrimaryNavigation = React.createClass({
	displayName: 'PrimaryNavigation',
	propTypes: {
		brand: React.PropTypes.string,
		currentSectionKey: React.PropTypes.string,
		sections: React.PropTypes.array.isRequired,
		signoutUrl: React.PropTypes.string,
	},
	getInitialState () {
		return {
			accountSettingIsVisible: false,
		};
	},
	// Handle resizing, hide this navigation on mobile (i.e. < 768px) screens
	componentDidMount () {
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
	},
	componentWillUnmount () {
		window.removeEventListener('resize', this.handleResize);
	},
	handleResize () {
		this.setState({
			navIsVisible: window.innerWidth >= 768,
		});
	},
	/*
	** on show the popup account setting modal
	** Terry Chan @ 11/10/2018
	*/
	onPopoverSetting () {
		this.setState({
			accountSettingIsVisible: true,
		});
	},
	/*
	** on hide the popup account setting modal
	** Terry Chan @ 11/10/2018
	*/
	onPopoutSetting () {
		this.setState({
			accountSettingIsVisible: false,
		});
	},
	onLanguageSelect(lang) {
		const { i18n } = this.props;
		i18n.changeLanguage(lang);
	},
	// Render the sign out button
	renderSignout () {
		const { t } = this.props;
		if (!this.props.signoutUrl) return null;

		return (
			<PrimaryNavItem
				label="octicon-sign-out"
				href={this.props.signoutUrl}
				title={t('signOut')}
			>
				<span className="octicon octicon-sign-out" />
			</PrimaryNavItem>
		);
	},
	/*
	** Render the current user account setting button
	** Terry Chan@11/10/2018
	*/
	renderAccountSettingButton () {
		return (
			<PrimaryNavItem
				label="octicon-tools"
				title={''}
				onClick={this.onPopoverSetting}
			>
				<span className="octicon octicon-tools" />
			</PrimaryNavItem>
		);
	},
	renderUserBlock () {
		const { user, t } = this.props;
		return (
			<div className="primary-navbar__currentUser">
				<b>{/*Welcome:*/t('welcome')}</b> 
				<a href="#" onClick={this.onPopoverSetting}>{user.name}</a>
			</div>
		);
	},
	// Render the back button
	renderBackButton () {
		const { t } = this.props;
		if (!Keystone.backUrl) return null;

		return (
			<PrimaryNavItem
				label="octicon-device-desktop"
				href={Keystone.backUrl}
				title={t('frontPage') + this.props.brand}
			>
				<span className="octicon octicon-device-desktop" />
			</PrimaryNavItem>
		);
	},
	renderLanguageSwitcher() {
		const { t } = this.props;
		
		return (
			<DropdownButton
				bsStyle={"default"}
				title={t('language')}
				key={1}
				id={"language-switcher"}
				onSelect={this.onLanguageSelect}
			>
				<MenuItem eventKey="zhtw">繁</MenuItem>
				<MenuItem eventKey="zhcn">簡</MenuItem>
				<MenuItem eventKey="en">ENG</MenuItem>
			</DropdownButton>
		)
	},
	// Render the link to the webpage
	renderFrontLink () {
		return (
			<ul className="app-nav app-nav--primary app-nav--right">
				{this.renderLanguageSwitcher()}
				{this.renderBackButton()}
				{this.renderSignout()}
			</ul>
		);
	},
	renderBrand () {
		// TODO: support navbarLogo from keystone config

		const { brand, currentSectionKey } = this.props;
		const className = currentSectionKey === 'dashboard' ? 'primary-navbar__brand primary-navbar__item--active' : 'primary-navbar__brand';

		return (
			<div className="primary-navbar__logoContainer">
				<Link
					className="primary-navbar__logo"
					title={'Dashboard - ' + brand}
					to={Keystone.adminPath}
				>
					<img src={Keystone.logo} alt={`Dashboard - ${brand}`} />
				</Link>
			</div>
		);
	},
	// Render the navigation
	renderNavigation () {
		if (!this.props.sections || !this.props.sections.length) return null;

		return this.props.sections.map((section) => {
			// Get the link and the class name
			const to = !section.lists[0].external && `${Keystone.adminPath}/${section.lists[0].path}`;
			const href = section.lists[0].external && section.lists[0].path;
			const isActive = this.props.currentSectionKey && this.props.currentSectionKey === section.key;
			const className = isActive ? 'primary-navbar__item--active' : null;

			return (
				<PrimaryNavItem
					active={isActive}
					key={section.key}
					label={section.label}
					className={className}
					to={to}
					href={href}
					style={this.props.style}
				>
					{section.label}
				</PrimaryNavItem>
			);
		});
	},

	render () {
		if (!this.state.navIsVisible) return null;
		return (
			<div className="primary-header">
				<div className="primary-header-tools">
					<Container className="primary-header-container" clearFloatingChildren>
						{
							!this.props.showNav ? 
							this.renderBrand() : null
						}
						{this.renderFrontLink()}
						{this.renderUserBlock()}
					</Container>
				</div>
				{/* {
					this.props.showNav ? 
					<nav className="primary-navbar">
						<Container clearFloatingChildren>
							<ul className="app-nav app-nav--primary app-nav--left">
								{this.renderNavigation()}
							</ul>
						</Container>
					</nav> : null
				} */}
				<AccountSetting
					isOpen={this.state.accountSettingIsVisible}
					onCancel={this.onPopoutSetting}
					{ ...this.props }
				/>
			</div>
		);
	},
});

export default translate('nav')(PrimaryNavigation);
// module.exports = PrimaryNavigation;
