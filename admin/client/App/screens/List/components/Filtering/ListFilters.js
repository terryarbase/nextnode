import React, { PropTypes } from 'react';
import { translate } from "react-i18next";
import { Chip } from '../../../../elemental';
import Filter from './Filter';

import { clearAllFilters } from '../../actions';

const ListFilters = ({ currentUILang, dispatch, filters, t, list }) => {

	if (!filters.length) return <div />;

	const dispatchClearAllFilters = function () {
		dispatch(clearAllFilters());
	};
	// console.log(filters);
	// Generate the list of filter pills
	const currentFilters = filters.map((filter, i) => (
		<Filter
			key={'f' + i}
			filter={filter}
			t={t}
			currentUILang={currentUILang}
			list={list}
			// pack={localePacks}
			dispatch={dispatch}
		/>
	));

	// When more than 1, append the clear button
	if (currentFilters.length > 1) {
		currentFilters.push(
			<Chip
				key="listFilters__clear"
				label={t('clearAll')}
				onClick={dispatchClearAllFilters}
			/>
		);
	}

	const styles = {
		marginBottom: '1em',
		marginTop: '1em',
	};

	return (
		<div style={styles}>
			{currentFilters}
		</div>
	);
};

ListFilters.propTypes = {
	dispatch: PropTypes.func.isRequired,
	currentUILang: PropTypes.string,
	filters: PropTypes.array.isRequired,
};

module.exports = translate(['filter', 'form'])(ListFilters);
