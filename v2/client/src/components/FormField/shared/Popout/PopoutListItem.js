/**
 * Render a popout list item
 */

import React from 'react';
import PropTypes from 'prop-types';
import blacklist from 'blacklist';
import classnames from 'classnames';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';

var PopoutListItem = createClass({
	displayName: 'PopoutListItem',
	propTypes: {
		icon: PropTypes.string,
		iconHover: PropTypes.string,
		isSelected: PropTypes.bool,
		label: PropTypes.string.isRequired,
		onClick: PropTypes.func,
	},
	getInitialState () {
		return {
			hover: false,
		};
	},
	hover () {
		this.setState({ hover: true });
	},
	unhover () {
		this.setState({ hover: false });
	},
	// Render an icon
	renderIcon () {
		if (!this.props.icon) return null;
		const icon = this.state.hover && this.props.iconHover ? this.props.iconHover : this.props.icon;
		const iconClassname = classnames('PopoutList__item__icon octicon', ('octicon-' + icon));

		return <span className={iconClassname} />;
	},
	render () {
		const itemClassname = classnames('PopoutList__item', {
			'is-selected': this.props.isSelected,
		});
		const props = blacklist(this.props, 'className', 'icon', 'iconHover', 'isSelected', 'label');
		return (
			<button
				type="button"
				title={this.props.label}
				className={itemClassname}
				onFocus={this.hover}
				onBlur={this.unhover}
				onMouseOver={this.hover}
				onMouseOut={this.unhover}
				{...props}
			>
				{this.renderIcon()}
				<span className="PopoutList__item__label">
					{this.props.label}
				</span>
			</button>
		);
	},
});

export default PopoutListItem;
