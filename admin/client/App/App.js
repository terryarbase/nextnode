/**
 * The App component is the component that is rendered around all views, and
 * contains common things like navigation, footer, etc.
 */

import React from 'react';
import { Container } from './elemental';
import { Link } from 'react-router';
import { css } from 'glamor';

import MobileNavigation from './components/Navigation/Mobile';
import AdminMenuNav from './components/Navigation/AdminMenu/AdminMenuNav';
import PrimaryNavigation from './components/Navigation/Primary';
import SecondaryNavigation from './components/Navigation/Secondary';
import Footer from './components/Footer';

const classes = {
	wrapper: {
		display: 'flex',
		flexDirection: 'row',
		minHeight: '100vh',
	},
	body: {
		flexGrow: 1,
	},
};

const App = (props) => {
	// console.log(props);
	const listsByPath = require('../utils/lists').listsByPath;
	let children = props.children;
	// Determine show the nav, excluding dashboard
	const { params: { listId } } = props;
	var isShowNav = !!listId;
	// If we're on either a list or an item view
	let currentList, currentSection;
	if (props.params.listId) {
		currentList = listsByPath[props.params.listId];
		// If we're on a list path that doesn't exist (e.g. /keystone/gibberishasfw34afsd) this will
		// be undefined
		if (!currentList) {
			children = (
				<Container>
					<p>List not found!</p>
					<Link to={`${Keystone.adminPath}`}>
						Go back home
					</Link>
				</Container>
			);
		} else {
			// Get the current section we're in for the navigation
			currentSection = Keystone.nav.by.list[currentList.key];
		}
	}
	// console.log('Keystone: ', Keystone);
	// Default current section key to dashboard
	const currentSectionKey = (currentSection && currentSection.key) || 'dashboard';
	const { style: { nav } } = Keystone;
	return (
		<div className={css(classes.wrapper)}>
			{isShowNav ?
			<div className="admin-menu-wrap">
				<AdminMenuNav
					currentSectionKey={currentSectionKey}
					currentListKey={props.params.listId}
					brand={Keystone.brand}
					sections={Keystone.nav.sections}
					signoutUrl={Keystone.signoutUrl}
					User={Keystone.User}
					user={Keystone.user}
					style={nav}
					showNav={isShowNav}
				/>
			</div> : null}
			<div className="content-wrap">
				<header>
					<MobileNavigation
						brand={Keystone.brand}
						currentListKey={props.params.listId}
						currentSectionKey={currentSectionKey}
						sections={Keystone.nav.sections}
						signoutUrl={Keystone.signoutUrl}
						User={Keystone.User}
						user={Keystone.user}
						style={nav}
					/>
					<PrimaryNavigation
						currentSectionKey={currentSectionKey}
						brand={Keystone.brand}
						sections={Keystone.nav.sections}
						signoutUrl={Keystone.signoutUrl}
						User={Keystone.User}
						user={Keystone.user}
						style={nav}
						showNav={isShowNav}
					/>
					{/* If a section is open currently, show the secondary nav */}
					{/* {(currentSection) ? (
						<SecondaryNavigation
							currentListKey={props.params.listId}
							lists={currentSection.lists}
							itemId={props.params.itemId}
						/>
					) : null} */}
					{/* <div className="block"></div> */}
				</header>
				<main className={css(classes.body)}>
					{/* {children} */}
					{React.Children.map(children, child => {
						return React.cloneElement(child, {
							user: Keystone.user,
						});
					})}
				</main>
				<Footer
					appversion={Keystone.appversion}
					backUrl={Keystone.backUrl}
					brand={Keystone.brand}
					User={Keystone.User}
					user={Keystone.user}
					version={Keystone.version}
				/>
			</div>
		</div>
	);
};

module.exports = App;
