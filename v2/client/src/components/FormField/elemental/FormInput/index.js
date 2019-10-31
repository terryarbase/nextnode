import React from 'react';
import PropTypes from 'prop-types';
// import { css } from 'glamor';
import {
	TextField,
	InputBase,
} from '@material-ui/core';
import {
	makeStyles,
} from '@material-ui/core/styles';

// styles
import {
	useInputStyles,
} from './../../../ContentListTable/TableToolbar/Filter/ListFilter/styles';

import i18n from './../../../../i18n';

// import classes from './styles';
// import concatClassnames from '../../../../utils/v1/concatClassnames';
import InputNoedit from './noedit';

const useStyles = makeStyles(theme => ({
  large: {
    width: '75%',
  },
  medium: {
    width: '60%',
  },
  default: {
    width: '40%',
  },
  full: {
  	width: '97%',
  }
}));

// NOTE must NOT be functional component to allow `refs`

const FormInput = props => {
	const classes = useInputStyles();
	const rootClasses = useStyles();
	if (props.noedit) {
		return (
			<InputNoedit {...props} />
		);
	}
	const {
		multiline,
		disabled,
		value,
		fullWidth=false,
		onChange,
		required,
		// autoFocus,
		path,
		noedit,
		rows=2,
		label,
		inputProps,
		placeholder,
		inline,
		variant,
		type='text',
	} = props;

	let options = {
		InputProps:{
			classes,
			disableUnderline: true,
			...inputProps,
		},
		type,
		className: rootClasses[props.size],
		value: value || '',
		placeholder: placeholder || i18n.t('list.placeholder', { field: label || '' }),
		// autoFocus={currentTarget && currentTarget === path}
		required,
		rows,
		disabled: noedit,
		fullWidth: !!fullWidth,
		multiline: !!multiline,
		onChange,
	};

	if (variant) {
		options = {
			...options,
			variant,
		};
	}

	if (inline) {
		return (
			<InputBase { ...options } />
		);
	}

  	return (
  		<TextField
  			{ ...options }
  		/>
  	);
}

// class FormInput extends Component {
// 	blur () {
// 		this.target.blur();
// 	}
// 	focus () {
// 		this.target.focus();
// 	}
// 	render () {
// 		const {
// 			cssStyles,
// 			// className,
// 			disabled,
// 			id,
// 			multiline,
// 			noedit,
// 			size,
// 			...props
// 		} = this.props;

// 		// NOTE return a different component for `noedit`
// 		if (noedit) return <InputNoedit {...this.props} />;

// 		const { formFieldId } = this.context;

// 		// , formLayout } = this.context;

// 		props.id = id || formFieldId;
// 		// props.className = css(
// 		// 	classes.FormInput,
// 		// 	classes['FormInput__size--' + size],
// 		// 	disabled ? classes['FormInput--disabled'] : null,
// 		// 	formLayout ? classes['FormInput--form-layout-' + formLayout] : null,
// 		// 	...concatClassnames(cssStyles)
// 		// );
// 		// if (className) {
// 		// 	props.className += (' ' + className);
// 		// }

// 		const setRef = (n) => (this.target = n);
// 		// const Tag = multiline ? 'textarea' : 'input';
// 		// console.log(props.id, props.value);
// 		return (
// 			<TextField
// 				multiline={!!multiline}
// 				ref={setRef}
// 				disabled={props.disabled}
// 				{...props}
// 				value={props.value || ''}
// 			/>
// 		);
// 	}
// };

// const stylesShape = {
// 	_definition: PropTypes.object,
// 	_name: PropTypes.string,
// };

FormInput.propTypes = {
	// cssStyles: PropTypes.oneOfType([
	// 	PropTypes.arrayOf(PropTypes.shape(stylesShape)),
	// 	PropTypes.shape(stylesShape),
	// ]),
	multiline: PropTypes.bool,
	fullWidth: PropTypes.bool,
	// size: PropTypes.oneOf(['default', 'small', 'large']),
	type: PropTypes.string,
};
FormInput.defaultProps = {
	size: 'default',
	type: 'text',
};
FormInput.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	formFieldId: PropTypes.string,
};

export default FormInput;
