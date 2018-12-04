/**
 * The primary (i.e. uppermost) navigation on desktop. Renders all sections and
 * the home-, website- and signout buttons.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { css } from 'glamor';
import { translate } from "react-i18next";
import { Link } from 'react-router';
import { Container } from '../../../elemental';
// Components
import AdminMenuNavItem from './AdminMenuNavItem';

var AdminMenuNav = React.createClass({
	displayName: 'AdminMenuNav',
	propTypes: {
		brand: React.PropTypes.string,
		currentSectionKey: React.PropTypes.string,
		sections: React.PropTypes.array.isRequired,
		signoutUrl: React.PropTypes.string,
	},
	getInitialState () {
		return {
			selectedIndex: -1,
			menuState: "top",
			lastScrollTop: 0,
			adminMenuStyle: {
				position: "absolute",
				top: 0,
			}
		};
	},
	// Handle resizing, hide this navigation on mobile (i.e. < 768px) screens
	componentDidMount () {
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
		window.addEventListener('scroll', this.handleScroll);
	},
	componentWillUnmount () {
		window.removeEventListener('resize', this.handleResize);
	},
	handleResize () {
		this.setState({
			navIsVisible: window.innerWidth >= 768,
		});
	},
	handleScroll () {
		const menu = this.menu;
		const menuTop = menu.offsetTop;
		const menuHeight = menu.offsetHeight;
		const menuBottom = menuTop + menuHeight;
		const windowHeight = window.innerHeight;
		const scrollTop = document.documentElement.scrollTop || window.pageYOffset;
		const scrollBottom = scrollTop + windowHeight;
		const isScrollDown = (scrollTop > this.state.lastScrollTop);
		const bodyHeight = window.document.body.offsetHeight;
		
		if (menuHeight <= windowHeight || bodyHeight <= menuHeight) return;
		// Handle menu scrolling
		if (isScrollDown) {
			// scroll down
			if (this.state.menuState === "top") {
				this.setState({
					menuState: "middle",
					adminMenuStyle: {
						position: "absolute",
						top: scrollTop,
					}
				});
			} else if (scrollBottom >= menuBottom) {
				this.setState({
					menuState: "bottom",
					adminMenuStyle: {
						position: "fixed",
						bottom: 0,
					}
				});
			}
		} else {
			// scroll up
			if (this.state.menuState === "bottom") {
				this.setState({
					menuState: "middle",
					adminMenuStyle: {
						position: "absolute",
						top: scrollBottom - menuHeight,
					}
				});
			} else if (scrollTop <= menuTop) {
				this.setState({
					menuState: "top",
					adminMenuStyle: {
						position: "fixed",
						top: 0,
					}
				});
			}
		}
		this.setState({
			lastScrollTop: scrollTop <= 0 ? 0 : scrollTop,
		});
	},
	changeMenu (idx) {
		this.setState({
			selectedIndex: idx,
		});
	},
	renderBrand () {
		// TODO: support navbarLogo from keystone config
		const { brand, currentSectionKey } = this.props;
		const className = currentSectionKey === 'dashboard' ? 'admin-menu-navbar__brand admin-menu-navbar__item--active' : 'admin-menu-navbar__brand';
		return (
			//<div className="admin-menu-navbar__logoContainer" onClick={this.changeMenu}>
			<div className="admin-menu-logo-container">
				<Link
					className="admin-menu-logo"
					title={'Dashboard - ' + brand}
					to={Keystone.adminPath}
				>
					<img src={Keystone.logo || logo} alt={`Dashboard - ${brand}`} />
				</Link>
			</div>
		);
	},
	// Render the navigation item <li>
	renderNavItem () {
		if (!this.props.sections || !this.props.sections.length) return null;

		return this.props.sections.map((section, index) => {
			// Get the link and the class name
			const to = !section.lists[0].external && `${Keystone.adminPath}/${section.lists[0].path}`;
			const href = section.lists[0].external && section.lists[0].path;
			const lists = section.lists;
			const isActive = this.props.currentSectionKey && this.props.currentSectionKey === section.key;
			// console.log(section, this.props);
			return (
				<AdminMenuNavItem
					active={isActive}
					key={section.key}
					label={section.label}
					to={to}
					href={href}
					style={this.props.style}
					currentListKey={this.props.currentListKey}
					lists={lists}
					onClick={() => {
						this.changeMenu(index)
					}}
				>
					{this.props.t(`section_${section.key}`) || section.label}
				</AdminMenuNavItem>
			);
		});
	},

	render () {
		if (!this.state.navIsVisible) return null;
		return (
			<div ref={(r) => this.menu = r} className="admin-menu" style={this.state.adminMenuStyle}>
				{this.renderBrand()}
				<nav className="admin-menu-navbar">
					<ul className="admin-menu-list">
						{this.props.showNav ? this.renderNavItem() : null}
					</ul>
				</nav>
			</div>
		);
	},
});

module.exports = translate('nav')(AdminMenuNav);
