/**
 * A item in the primary navigation. If it has a "to" prop it'll render a
 * react-router "Link", if it has a "href" prop it'll render a simple "a" tag
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import SubMenuNav from './SubMenuNav';

const AdminMenuNavItem = React.createClass({
	displayName: 'AdminMenuNavItem',
	propTypes: {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
		href: PropTypes.string,
		label: PropTypes.string,
		title: PropTypes.string,
		to: PropTypes.string,
		onClick: PropTypes.func,
	},
	getInitialState () {
		return {
			isHover: false,
		};
	},
	onMouseOver () {
		const { active } = this.props;
		this.setState({
			isHover: active ? false : true,
		});
	},
	onMouseLeave () {
		this.setState({
			isHover: false,
		});
	},
	renderSectionLink () {
		const { children, href, label, title, to, active, onClick } = this.props;
		const className = "admin-menu-item-link";
		return (
			to ? (
				<Link
					className={className}
					data-section-label={label}
					key={title}
					tabIndex="-1"
					title={title}
					to={to}
					// Block clicks on active link
					onClick={(evt) => { 
						// if (active) evt.preventDefault(); 
						if (onClick) onClick();
					}}
				>
					{children}
				</Link>
			) : (
				<a
					className={className}
					data-section-label={label}
					href={href}
					key={title}
					tabIndex="-1"
					title={title}
					onClick={() => {
						if (onClick) onClick();
					}}
				>
					{children}
				</a>
			)	
		);
	},
	renderSubMenu (hover) {
		const { currentListKey, lists } = this.props;
		return (
			<SubMenuNav
				currentListKey={currentListKey}
				lists={lists}
				parentActive={this.props.active}
				isHover={hover}
			></SubMenuNav>
		)
	},
	render () {
		const { active } = this.props;
		const { isHover } = this.state;
		var classNames = ['admin-menu-item'];
		if (active) classNames = [...classNames, 'active'];
		else if (isHover) classNames = [...classNames, 'hover'];
		
		return (
			<li
				className={classNames.join(' ')}
				onMouseOver={this.onMouseOver}
				onMouseLeave={this.onMouseLeave}
			>
				{this.renderSectionLink()}
				{this.renderSubMenu(isHover)}
			</li>
		);
	},
});

module.exports = AdminMenuNavItem;
