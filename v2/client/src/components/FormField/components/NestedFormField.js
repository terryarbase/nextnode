import React from 'react';
import { FormField, FormLabel } from '../elemental';
import theme from '../theme';

function NestedFormField ({ children, className, label, ...props }) {
	return (
		<FormField {...props}>
			<FormLabel cssStyles={classes.label}>
				{label}
			</FormLabel>
			{children}
		</FormField>
	);
};
const classes = {
	label: {
		color: theme.color.gray40,
		fontSize: theme.font.size.small,

		[`@media (min-width: ${theme.breakpoint.tabletLandscapeMin})`]: {
			paddingLeft: '1em',
		},
	},
};

export default NestedFormField;