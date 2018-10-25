/**
 * A item in the primary navigation. If it has a "to" prop it'll render a
 * react-router "Link", if it has a "href" prop it'll render a simple "a" tag
 */

import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';

const PrimaryNavItem = React.createClass({
	displayName: 'PrimaryNavItem',
	propTypes: {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
		href: PropTypes.string,
		label: PropTypes.string,
		title: PropTypes.string,
		to: PropTypes.string,
		onClick: PropTypes.function,
	},
	getInitialState () {
		const { style } = this.props;
		var normalColor = '#1385e5';
		var hoverColor = '#ffffff';
		if (style) {
			if (style.fontColor) {
				normalColor = style.fontColor;
			}
			if (style.fontHover) {
				hoverColor = style.fontHover;
			}
		}
		return {
			normalColor,
			hoverColor,
			currentColor: normalColor,
		};
	},
	onMouseOver() {
		const { active } = this.props;
		this.setState({
			currentColor: active ? this.state.normalColor : this.state.hoverColor,
		});
	},
	onMouseOut() {
		this.setState({
			currentColor: this.state.normalColor,
		});
	},
	render () {
		const { children, className, href, label, title, to, active, onClick } = this.props;
		const itemClassName = classnames('primary-navbar__item', className);
		const { currentColor: color } = this.state;
		const Button = to ? (
			<Link
				className="primary-navbar__link"
				key={title}
				tabIndex="-1"
				title={title}
				to={to}
				onMouseOver={this.onMouseOver}
				onMouseOut={this.onMouseOut}
				style={{
					color,
				}}
				// Block clicks on active link
				onClick={(evt) => { 
					if (active) evt.preventDefault(); 
					if (onClick) onClick();
				}}
			>
				{children}
			</Link>
		) : (
			<a
				className="primary-navbar__link"
				href={href}
				key={title}
				style={{
					color,
				}}
				onMouseOver={this.onMouseOver}
				onMouseOut={this.onMouseOut}
				tabIndex="-1"
				title={title}
				onClick={() => {
					if (onClick) onClick();
				}}
			>
				{children}
			</a>
		);
		return (
			<li
				className={itemClassName}
				data-section-label={label}
			>
				{Button}
			</li>
		);
	},
});

// const PrimaryNavItem = ({ children, className, href, label, title, to, active, style }) => {
// 	const itemClassName = classnames('primary-navbar__item', className);
// 	var normalColor = '#1385e5';
// 	var hoverColor = '#ffffff';
// 	if (style) {
// 		if (style.fontColor) {
// 			normalColor = style.fontColor;
// 		}
// 		if (style.fontHover) {
// 			hoverColor = style.fontHover;
// 		}
// 	}
// 	const Button = to ? (
// 		<Link
// 			className="primary-navbar__link"
// 			key={title}
// 			tabIndex="-1"
// 			title={title}
// 			to={to}
// 			onMouseOver={`this.style.color='${hoverColor}'`}
// 			onMouseOout={`this.style.color='${normalColor}'`}
// 			// Block clicks on active link
// 			onClick={(evt) => { if (active) evt.preventDefault(); }}
// 		>
// 			{children}
// 		</Link>
// 	) : (
// 		<a
// 			className="primary-navbar__link"
// 			href={href}
// 			key={title}
// 			onMouseOver={`this.style.color='${hoverColor}'`}
// 			onMouseOout={`this.style.color='${normalColor}'`}
// 			tabIndex="-1"
// 			title={title}
// 		>
// 			{children}
// 		</a>
// 	);

// 	return (
// 		<li
// 			className={itemClassName}
// 			data-section-label={label}
// 		>
// 			{Button}
// 		</li>
// 	);
// };

// PrimaryNavItem.displayName = 'PrimaryNavItem';
// PrimaryNavItem.propTypes = {
// 	children: PropTypes.node.isRequired,
// 	className: PropTypes.string,
// 	href: PropTypes.string,
// 	label: PropTypes.string,
// 	title: PropTypes.string,
// 	to: PropTypes.string,
// };

module.exports = PrimaryNavItem;
