import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
	Chip,
} from '@material-ui/core/Chip';

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

const ListFilters = props => {
	const classes = useStyles();
	if (!filters.length) return null;

	const clearAll = () => replaceQueryParams({
		filters: [],
	}, props.history);

	const { filters } = props;
	// Generate the list of filter pills
	const currentFilters = useMemo(() => {
		let chips = filters.map((filter, i) => (
			<FilterItem
				{...props}
				key={`f${i}`}
				filter={filter}
			/>
		));
		// When more than 1, append the clear button
		if (currentFilters.length > 1) {
			chips = [
				...chips,
				<Chip
					label={i18n.t('filter.clearAll')}
        			onDelete={clearAll}
					color="secondary"
				/>
			];
		}
		return chips;
	}, [ filters ]);

	return (
		<div className={classes.chipRoot}>
			{currentFilters}
		</div>
	);
};

FilterChips.propTypes = {
	currentList: PropTypes.object.isRequired,
	filters: PropTypes.array.isRequired,
};

export default FilterChips;
