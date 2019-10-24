// ==============================
// Form Field
// ==============================

import theme from '../../theme';

export default {
	'FormField': {
		fontSize: '15px !important',
		marginBottom: '1.5em',
		position: 'relative',
	},

	// when inside a horizontal form

	'FormField--form-layout-horizontal': {
		[`@media (min-width: ${theme.breakpoint.tabletLandscapeMin})`]: {
			display: 'table',
			tableLayout: 'fixed',
			width: '100%',
		},
		// [`@media (min-width: ${theme.breakpoint.desktopMin})`]: {
		// 	display: 'inline-block',
		// 	width: '50%',
		// },

	},

	// 'FormField__inner': {
	// 	[`@media (min-width: ${theme.breakpoint.desktopMin})`]: {
	// 		display: 'table-cell'
	// 	},
	// },

	// inside horizontal form
	// typically for use with submit button inside
	'FormField--offset-absent-label': {
		paddingLeft: theme.form.label.width,
	},

	// when inside an inline form

	'FormField--form-layout-inline': {
		'display': 'inline-block',
		'paddingLeft': '0.25em',
		'paddingRight': '0.25em',
		'verticalAlign': 'middle',

		':first-child': { paddingLeft: 0 },
		':last-child': { paddingRight: 0 },
	},
};
