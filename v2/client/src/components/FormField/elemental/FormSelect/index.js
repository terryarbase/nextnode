// import { css } from 'glamor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
	FormControl,
	NativeSelect,
} from '@material-ui/core';

// import classes from './styles';

class FormSelect extends Component {
	render () {
		const { children, id, options, ...props } = this.props;
		const { formFieldId } = this.context;

		props.id = id || formFieldId;

		// Property Violation
		if (options && children) {
			console.error('Warning: FormSelect cannot render `children` and `options`. You must provide one or the other.');
		}

		if (!options) {
			return (
				<FormControl>
			        <NativeSelect
			          {...props}
			        >
			          	{children}
			        </NativeSelect>
				</FormControl>
			);
		}

		return (
			<FormControl>
		        <NativeSelect
		          {...props}
		        >
		          	{	
		          		options.map(opt => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))
		      		}
		        </NativeSelect>
		    </FormControl>
		);
	}
};

FormSelect.contextTypes = {
	formFieldId: PropTypes.string,
};
FormSelect.propTypes = {
	onChange: PropTypes.func.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.string,
		})
	),
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};

export default FormSelect;
