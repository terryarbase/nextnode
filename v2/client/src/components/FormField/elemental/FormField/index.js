// import { css } from 'glamor';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
	Grid,
} from '@material-ui/core';

import Note from './../../shared/Note';

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    borderBottom: '1px solid #efeded',
    marginBottom: theme.spacing(1),
  },
  label: {
  	fontSize: 15,
  },
  content: {
  	overflow: 'auto',

  },
}));

const FormField = ({ note, label, children }) => {
	const classes = useStyles();
	return (
		<Grid
			className={classes.root}
		  	container
		  	direction="row"
		  	justify="flex-start"
		  	alignItems="center"
		  	spacing={3}
		>
			{
				!!label && <Grid item xs={2} className={classes.label}>
					{label}
				</Grid>
			}
			<Grid
				item
				xs
				className={classes.content}
			>
				{
					!!note ? <React.Fragment>
						{children} 
						<Note note={note} />
					</React.Fragment> : 
					children
				}
			</Grid>
		</Grid>
	);
}

// class FormField extends Component {
// 	constructor () {
// 		super();
// 		this.formFieldId = generateId();
// 	}
// 	getChildContext () {
// 		return {
// 			formFieldId: this.formFieldId,
// 		};
// 	}
// 	render () {
// 		const { formLayout = 'basic', labelWidth } = this.context;
// 		const {
// 			cssStyles,
// 			children,
// 			className,
// 			cropLabel,
// 			htmlFor,
// 			label,
// 			offsetAbsentLabel,
// 			...props
// 		} = this.props;

// 		props.className = css(
// 			classes.FormField,
// 			classes['FormField--form-layout-' + formLayout],
// 			offsetAbsentLabel ? classes['FormField--offset-absent-label'] : null,
// 			cssStyles
// 		);
// 		if (className) {
// 			props.className += (' ' + className);
// 		}
// 		if (offsetAbsentLabel && labelWidth) {
// 			props.style = {
// 				paddingLeft: labelWidth,
// 				...props.style,
// 			};
// 		}

// 		// elements
// 		const componentLabel = label ? (
// 			<FormLabel htmlFor={htmlFor} cropText={cropLabel}>
// 				{label}
// 			</FormLabel>
// 		) : null;

// 		return (
// 			<div {...props} htmlFor={htmlFor}>
// 				{componentLabel}
// 				{children}
// 			</div>
// 		);
// 	}
// };

// const stylesShape = {
// 	_definition: PropTypes.object,
// 	_name: PropTypes.string,
// };

// FormField.contextTypes = {
// 	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
// 	labelWidth: PropTypes.oneOfType([
// 		PropTypes.number,
// 		PropTypes.string,
// 	]),
// };
// FormField.childContextTypes = {
// 	formFieldId: PropTypes.string,
// };
FormField.propTypes = {
	children: PropTypes.node,
	// cropLabel: PropTypes.bool,
	// cssStyles: PropTypes.oneOfType([
	// 	PropTypes.arrayOf(PropTypes.shape(stylesShape)),
	// 	PropTypes.shape(stylesShape),
	// ]),
	// htmlFor: PropTypes.string,
	label: PropTypes.string,
	// offsetAbsentLabel: PropTypes.bool,
};

export default FormField;
