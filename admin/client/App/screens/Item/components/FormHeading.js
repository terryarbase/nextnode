import React from 'react';
import _ from 'lodash';
import evalDependsOn from '../../../../../../fields/utils/evalDependsOn';

module.exports = React.createClass({
	displayName: 'FormHeading',
	propTypes: {
		options: React.PropTypes.object,
	},
	render () {
		if (!evalDependsOn(this.props.options.dependsOn, this.props.options.values)) {
			return null;
		}
		var { content } = this.props;
		/*
		** Special for meta header
		** hard-checking is accepted in here only has one meta special case 
		** Terry Chan
		** 04/12/2018
		*/
		if (_.toLower(content) === 'meta') {
			content = this.props.t('meta');
		}
		return <h3 className="form-heading">{content}</h3>;
	},
});
