/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import _ from 'lodash';
// import { css, StyleSheet } from 'aphrodite/no-important';
import React from 'react';
import Field from '../Field';

// import _cloneDeep from 'lodash/cloneDeep';
import {
  Button,
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
import i18n from '../../../../i18n';

// components
import FormElemental from './../../../ContentListForm/FormElement';

let i = 0;
const generateId = () => {
	return i++;
};

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
		value=[],
		path,
		fields,
		onChange,
	} = props;
	const addItem = () => {
		onChange({
			path,
			value: [
				...value,
				{
					id: generateId(),
					_isNew: true,
				},
			],
		});
	};
	const removeItem = index => {
		const newValue = value.slice(0, index).concat(value.slice(index + 1));
		onChange({ path, value: newValue });
	};
	const handleFieldChanged = index => ({ path: subPath, value: current }) => {
		const head = value.slice(0, index);
		const item = {
			...value[index],
			[subPath]: current,
		};
		
		const tail = value.slice(index + 1);
		const newValue = [...head, item, ...tail];
		onChange({ path, value: newValue });
	};
	const items = value.map((v, index) => {
		const { id, _isNew } = v;
		const name = !_isNew && _.get(path, `${index}.id`);
		const onRemove = e => removeItem(index);
		
		return (
			<FormField key={id}>
				<Grid
					container
					direction="row"
					justify="flex-start"
			  		alignItems="center"
			  		spacing={3}
				>
					<Grid item xs={10}>
						{
							name && <input type="hidden" name={name} value={id} />
						}
						<FormElemental
							{...props}
							onChange={handleFieldChanged(index)}
				        	form={v}
				        	fields={fields}
				        	inline
				        />
					</Grid>
					<Grid item xs={2}>
						<Button variant="contained" color="secondary" onClick={onRemove}>
							{i18n.t('list.remove')}
						</Button>
					</Grid>
				</Grid>
			</FormField>
		);
	});

	return (
		<Grid
			container
			direction="column"
			justify="flex-start"
	  		alignItems="flex-start"
	  		spacing={3}
		>
			<Grid item xs container justify="flex-start">
				<Button variant="contained" color="primary" onClick={addItem}>
					{i18n.t('list.add')}
				</Button>
			</Grid>
			{
				!!items.length && <Grid item container>
					{items}
				</Grid>
			}
			{
				value.length >= 4 && <Grid item xs justify="flex-end">
					<Button variant="contained" color="primary" onClick={addItem}>
						{i18n.t('list.add')}
					</Button>
				</Grid>
			}
		</Grid>
	);
	// return (
	// 	<FormElemental
 //            {...props}
 //        onChange={handleFieldChange(index)}
 //        form={formValues}
 //        requiredFields={initialFields}
 //      />
	// );
}

export default Field.create({
	displayName: 'ListField',
	statics: {
		type: 'List',
	},
	propTypes: {
		fields: PropTypes.object.isRequired,
		label: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		value: PropTypes.array,
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
