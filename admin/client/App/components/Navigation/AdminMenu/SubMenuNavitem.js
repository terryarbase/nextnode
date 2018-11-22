/**
 * A navigation item of the secondary navigation
 */

import React from 'react';
import { Link } from 'react-router';

const SubMenuNavItem = React.createClass({
	displayName: 'SubMenuNavItem',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		href: React.PropTypes.string.isRequired,
		path: React.PropTypes.string,
		title: React.PropTypes.string,
    },
	render () {
		const {active} = this.props;
		var classNames = ['sub-menu-item'];
		if (active) {
			classNames = [...classNames, 'active'];
		}
		return (
			<li className={classNames.join(' ')} data-list-path={this.props.path}>
				<Link
					className="sub-menu-link"
					to={this.props.href}
					onClick={this.props.onSelect}
					title={this.props.title}
					tabIndex="-1"
				>
					{this.props.children}
				</Link>
			</li>
		);
	},
});

module.exports = SubMenuNavItem;
