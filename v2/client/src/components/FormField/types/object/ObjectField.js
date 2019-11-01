/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import _ from 'lodash';
// import { css, StyleSheet } from 'aphrodite/no-important';
import React from 'react';
import Field from '../Field';

// import _cloneDeep from 'lodash/cloneDeep';
import {
  // Button,
  Grid,
} from '@material-ui/core';

// import Fields from './../fields';
// import { GlyphButton } from '../../elemental';

// import InvalidFieldType from '../../shared/InvalidFieldType';
import Domify from '../../shared/Domify';
import {
	FormField,
} from '../../elemental';

// locales
// import i18n from '../../../../i18n';

// components
import FormElemental from './../../../ContentListForm/FormElement';

// let i = 0;
// const generateId = () => {
// 	return i++;
// };

// const ItemDom = props => {
// 	const { name, id, path, onRemove, children } = props;
// 	return (
// 		<FormField>
// 			<Grid
// 				container
// 				direction="row"
// 				justify="flex-start"
// 		  		alignItems="center"
// 		  		spacing={3}
// 			>
// 				<Grid item xs={10}>
// 					{
// 						name && <input type="hidden" name={name} value={id} />
// 					}
// 					{
// 						Children.map(
// 							children, 
// 							child => cloneElement(child, props)
// 						)
// 					}
// 				</Grid>
// 				<Grid item xs={2}>
// 					<Button variant="contained" color="secondary" onClick={onRemove}>
// 						{i18n.t('list.remove')}
// 					</Button>
// 				</Grid>
// 			</Grid>
// 		</FormField>
// 	);
// };

const ListField = props => {
	const {
		value={},
		path,
		fields,
		onChange,
	} = props;

	const handleFieldChanged = ({ path: subPath, value: current }) => {
		const item = {
			...value,
			[subPath]: current,
		};
		onChange({ path, value: item });
	};
	const { id, _isNew } = value;
	const name = !_isNew && id;
		
	return (
		<FormField key={id}>
			<Grid
				container
				direction="row"
				justify="flex-start"
		  		alignItems="center"
		  		spacing={3}
			>
				<Grid item xs={11}>
					{
						name && <input type="hidden" name={name} value={id} />
					}
					<FormElemental
						{...props}
						onChange={handleFieldChanged}
			        	form={value}
			        	fields={fields}
			        	inline
			        />
				</Grid>
			</Grid>
		</FormField>
	);

	return (
		<Grid
			container
			direction="column"
			justify="flex-start"
	  		alignItems="flex-start"
	  		spacing={3}
		>
			{
				<Grid item container>
					{item}
				</Grid>
			}
		</Grid>
	);
}

export default Field.create({
	displayName: 'ObjectField',
	statics: {
		type: 'Object',
	},
	propTypes: {
		fields: PropTypes.object.isRequired,
		label: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		value: PropTypes.object,
	},
	renderUI () {
		const {
			value,
		} = this.props;
		const label = this.getRequired();
		return (
			<FormField label={label} note={this.props.note}>
				{
					this.shouldRenderField() ? 
					<ListField {...this.props} /> : 
					<Domify value={value} />
				}
			</FormField>
		);
	},
});
