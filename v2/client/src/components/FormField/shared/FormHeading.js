import React from 'react';
import {
  Typography,
} from '@material-ui/core';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
import _ from 'lodash';
import evalDependsOn from '../utils/evalDependsOn';

// locales
import i18n from '../../../i18n';

export default createClass({
	displayName: 'FormHeading',
	propTypes: {
		options: React.PropTypes.object,
	},
	render () {
		if (!evalDependsOn(this.props.options.dependsOn, this.props.options.values)) {
			return null;
		}
		let { content } = this.props;
		/*
		** Special for meta header
		** hard-checking is accepted in here only has one meta special case 
		** Terry Chan
		** 04/12/2018
		*/
		if (_.toLower(content) === 'meta') {
			content = i18n.t('list.meta');
		}
		return <Typography variant="h1">{content}</Typography>;
	},
});
