import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
	Chip,
	Grid,
} from '@material-ui/core';

// componetns
import FilterItem from './FilterItem';

// styles
import useStyles from "./styles";

// locales
import i18n from './../../../../../i18n';

// utils
import {
  replaceQueryParams,
} from "./../../../../../utils/v1/queryParams";

const FilteringList = props => {
	const classes = useStyles();
	const {
		currentList,
		currentList: {
			filters=[],
		},
		history,
	} = props;
	const clearAll = () => replaceQueryParams({
		filters: [],
	}, history);
	const updateFilter = (value, remove) => {
		if (!remove) {
			currentList.updateFilter(value);
		} else {
			currentList.removeFilter(value);
		}
		// console.log(currentList.filters);
		replaceQueryParams({
	      filters: currentList.filters,
	    }, history);
	};
	// Generate the list of filter pills
	const currentFilters = useMemo(() => {
		let chips = filters.map((filter, i) => (
			<FilterItem
				{...props}
				key={i}
				onUpdate={updateFilter}
				filter={filter}
			/>
		));
		// When more than 1, append the clear button
		if (chips.length > 1) {
			chips = [
				...chips,
				<Chip
					key='removeall'
					label={i18n.t('filter.clearAll')}
        			onDelete={clearAll}
					color="secondary"
				/>
			];
		}
		return chips;
	}, [ filters ]);

	if (!filters.length) return null;

	return (
		<Grid 
			container
	        direction="row"
	        className={classes.chipRoot}
        >
			{currentFilters}
		</Grid>
	);
};

FilteringList.propTypes = {
	currentList: PropTypes.object.isRequired,
	// tableLabel: PropTypes.string.isRequired,
	// filters: PropTypes.array.isRequired,
};

export default FilteringList;
