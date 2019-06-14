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
			init: true,
			selectedIndex: -1,
			menuState: "top",
			menuTopInBody: 0,
			lastScrollTop: 0,
			adminMenuStyle: {
				position: "relative",
				top: 0,
			},
		};
	},
	// Handle resizing, hide this navigation on mobile (i.e. < 768px) screens
	componentDidMount () {
		this.doUpdate = true;
		this.menuChanged = false;
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
		window.addEventListener('scroll', this.handleScroll);
	},
	componentWillUnmount () {
		window.removeEventListener('resize', this.handleResize);
	},
	componentDidUpdate () {
		if (this.doUpdate) {
			this.updateMenuPosition();
		}
	},
	handleResize () {
		let state = {
			navIsVisible: window.innerWidth >= 768,
		};

		if (this.menu) {
			const menu = this.menu;
			const menuHeight = menu.offsetHeight;
			const scrollTop = document.documentElement.scrollTop || window.pageYOffset;
			const windowHeight = window.innerHeight;

			if (windowHeight > menuHeight) {
				state = {
					...state,
					action: "resize change 'top' state",
					menuState: "top",
					menuTopInBody: scrollTop,
					adminMenuStyle: {
						position: "fixed",
						top: 0,
					},
				}
			}
		}

		this.setState(state);
	},
	handleScroll () {
		if (this.menuChanged) return;

		const menu = this.menu;
		const menuTop = menu.offsetTop;
		const menuHeight = menu.offsetHeight;
		const menuBottom = menuTop + menuHeight;
		const windowHeight = window.innerHeight;
		const scrollTop = document.documentElement.scrollTop || window.pageYOffset;
		const scrollBottom = scrollTop + windowHeight;
		const lastScrollTop = this.state.lastScrollTop;
		const lastScrollBottom = lastScrollTop + windowHeight;
		const isScrollDown = (scrollTop > lastScrollTop);
		const bodyHeight = window.document.body.offsetHeight;

		// console.log('>>> debug', {
		// 	menuTop,
		// 	menuHeight,
		// 	menuBottom,
		// 	windowHeight,
		// 	scrollTop,
		// 	scrollBottom,
		// 	lastScrollTop,
		// 	lastScrollBottom,
		// 	isScrollDown,
		// 	bodyHeight,
		// })

		let state = {
			lastScrollTop: scrollTop <= 0 ? 0 : scrollTop,
		}

		if (this.state.init) {
			const menuMaxTop = bodyHeight - menuHeight;
			if (scrollTop <= menuMaxTop) {
				state = {
					...state,
					action: "refresh init 'top' state",
					init: false,
					menuState: "top",
					menuTopInBody: scrollTop,
					adminMenuStyle: {
						position: "fixed",
						top: 0,
					},
				}
			} else {
				state = {
					...state,
					action: "refresh init 'bottom' state",
					init: false,
					menuState: "bottom",
					menuTopInBody: menuMaxTop,
					adminMenuStyle: {
						position: "fixed",
						bottom: 0,
					},
				}
			}
			this.setState(state);
			return;
		}

		if (menuHeight >= windowHeight && bodyHeight <= menuHeight) {
			state = {
				menuState: "top",
				adminMenuStyle: {
					position: "relative",
					top: 0,
				},
			}
			this.setState(state);
			return;
		};

		if (isScrollDown) {
			/* scroll down */
			// handle 'top' state
			if (this.state.menuState === "top") {
				if (menuHeight <= windowHeight) {
					// keep 'top' state
					state = {
						...state,
						action: "[down] keep 'top' state",
						menuState: "top",
						adminMenuStyle: {
							position: "fixed",
							top: 0,
						}
					}
				} else {
					// change 'middle' state
					state = {
						...state,
						action: "[down] change 'middle' state",
						menuState: "middle",
						adminMenuStyle: {
							position: "absolute",
							top: this.state.menuTopInBody,
						}
					}
				}
			}

			// handle 'middle' state
			if (this.state.menuState === "middle") {
				if (scrollBottom >= menuBottom) {
					// scroll until menu bottom, change 'bottom' state
					state = {
						...state,
						action: "[down] change 'bottom' state",
						menuTopInBody: scrollBottom - menuHeight,
						menuState: "bottom",
						adminMenuStyle: {
							position: "fixed",
							bottom: 0,
						}
					}
				}
			}

			// handle 'bottom' state
			if (this.state.menuState === "bottom") {
				// set menuTopInBody
				state = {
					...state,
					action: "[down] set menuTopInBody",
					menuTopInBody: scrollBottom - menuHeight,
				}
			}
		}

		if (!isScrollDown) {
			/* scroll up */
			// handle 'bottom' state
			if (this.state.menuState === "bottom") {
				// change 'middle' state
				const top = scrollBottom - menuHeight;
				state = {
					...state,
					action: "[up] change 'middle' state",
					menuState: "middle",
					adminMenuStyle: {
						position: "absolute",
						top: top < 0 ? 0 : top,
						// top: this.state.menuTopInBody,
					}
				}
			}

			// handle 'middle' state
			if (this.state.menuState === "middle") {
				// change 'top' state
				if (scrollTop <= menuTop) {
					state = {
						...state,
						action: "[up] change 'top' state",
						menuTopInBody: scrollTop,
						menuState: "top",
						adminMenuStyle: {
							position: "fixed",
							top: 0,
						}
					}
				}
			}

			// handle 'top' state
			if (this.state.menuState === "top") {
				// set menuTopInBody
				state = {
					...state,
					action: "[up] set menuTopInBody",
					menuTopInBody: scrollTop,
				}
			}
		}

		this.setState(state);
	},
	updateMenuPosition () {
		const menu = this.menu;
		const menuHeight = menu.offsetHeight;
		const windowHeight = window.innerHeight;
		const bodyHeight = window.document.body.offsetHeight;
		
		let state = {};

		if (menuHeight <= windowHeight || bodyHeight <= menuHeight) {
			state = {
				menuState: "top",
				adminMenuStyle: {
					position: "relative",
					top: 0,
				},
			}
		}
		
		this.doUpdate = false;
		this.menuChanged = false;
		this.setState(state);
	},
	changeMenu (idx) {
		this.doUpdate = true;
		this.menuChanged = true;
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
		// console.log('>>> state', this.state);
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
