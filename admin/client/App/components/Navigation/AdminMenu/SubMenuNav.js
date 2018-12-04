/**
 * The secondary navigation links to inidvidual lists of a section
 */

import React from 'react';
import { connect } from 'react-redux';
import { translate } from "react-i18next";
import { Container } from '../../../elemental';

import {
	setActiveList,
} from '../../../screens/List/actions/active';
import SubMenuNavItem from './SubMenuNavitem';

var SubMenuNav = React.createClass({
	displayName: 'SubMenuNav',
	propTypes: {
		currentListKey: React.PropTypes.string,
		lists: React.PropTypes.array.isRequired,
	},
	getInitialState () {
		return {
			isActive: false,
		}
	},
	setState() {
		this.setState({
			isActive: this.props.currentListKey && this.props.currentListKey === list.path,
		});
	},
	whenClick (e, isActive) {
		// If it's the currently active navigation item and we're not on the item view,
		// clear the query params on click
		if (isActive && !this.props.itemId) {
			e.preventDefault();
			this.props.dispatch(
				setActiveList(this.props.currentList, this.props.currentListKey)
			);
		}
	},
	// Render the navigation
	renderNavigation (lists) {
		const navigation = Object.keys(lists).map(key => {
			const list = lists[key];
			// Get the link and the classname
			const href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;
			const isActive = this.props.currentListKey && this.props.currentListKey === list.path;
			const className = isActive ? 'active' : null;
			// console.log(this.props.t(`table_${list.key}`));
			return (
				<SubMenuNavItem
					active={isActive}
					key={list.path}
					path={list.path}
					className={className}
					href={href}
					onSelect={(e) => {
						this.whenClick(e, isActive)
					}}
				>
					{this.props.t(`table_${list.key}`) || list.label}
				</SubMenuNavItem>
			);
		});

		return (
			navigation
		);
	},
	render () {
		const { parentActive, isHover } = this.props;
		return (
			parentActive || isHover ? (
				<ul className="sub-menu-list">
					{this.renderNavigation(this.props.lists)}
				</ul>
			) : null
		);

		// const {parentActive} = this.props;
		// var classNames = ['sub-menu-list'];
		// if (!sectionActive) {
		// 	classNames = [...classNames, 'hover'];
		// }

		// return (
		// 	<ul className={classNames.join(' ')}>
		// 		{this.renderNavigation(this.props.lists)}
		// 	</ul>
		// );
	},
});

module.exports = translate('form')(connect((state) => {
	return {
		currentList: state.lists.currentList,
	};
})(SubMenuNav));
