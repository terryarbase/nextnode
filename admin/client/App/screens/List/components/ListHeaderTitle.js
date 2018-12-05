import { css } from 'glamor';
import React, { PropTypes } from 'react';
import { translate } from "react-i18next";

import theme from '../../../../theme';
import ListSort from './ListSort';

function ListHeaderTitle ({
	activeSort,
	availableColumns,
	handleSortSelect,
	title,
	t,
	list,
	...props
}) {
	return (
		<h2 className={css(classes.heading)} {...props}>
			{t(`table_${list.key}`)}
			<ListSort
				t={t}
				list={list}
				activeSort={activeSort}
				availableColumns={availableColumns}
				handleSortSelect={handleSortSelect}
			/>
		</h2>
	);
};

ListHeaderTitle.propTypes = {
	activeSort: PropTypes.object,
	availableColumns: PropTypes.arrayOf(PropTypes.object),
	handleSortSelect: PropTypes.func.isRequired,
	title: PropTypes.string,
};

const classes = {
	heading: {
		[`@media (max-width: ${theme.breakpoint.mobileMax})`]: {
			fontSize: '1.25em',
			fontWeight: 500,
		},
	},
};

module.exports = translate('form')(ListHeaderTitle);
