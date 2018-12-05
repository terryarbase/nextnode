import React, { PropTypes } from 'react';
import { translate } from "react-i18next";
import {
	GlyphButton,
	InlineGroup as Group,
	InlineGroupSection as Section,
	ResponsiveText,
} from '../../../elemental';
import theme from '../../../../theme';

import ListColumnsForm from './ListColumnsForm';
import ListDownloadForm from './ListDownloadForm';
import ListHeaderSearch from './ListHeaderSearch';
import LocalizationSelector from '../../../components/Localization';

import ListFiltersAdd from './Filtering/ListFiltersAdd';

function ButtonDivider ({ style, ...props }) {
	props.style = {
		borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
		paddingLeft: '0.75em',
		...style,
	};

	return <div {...props} />;
};

function CreateButton ({ listName, onClick, t, list, ...props }) {
	const newListName = t(`form:table_${list.key}`);
	return (
		<GlyphButton
			block
			color="success"
			data-e2e-list-create-button="header"
			glyph="plus"
			onClick={onClick}
			position="left"
			title={t('createButton', { listName: newListName })}
			{...props}
		>
			<ResponsiveText
				visibleSM={t('createButton', { listName: newListName })}
				visibleMD={t('createButton', { listName: newListName })}
				visibleLG={t('createButton', { listName: newListName })}
			/>
		</GlyphButton>
	);
};

function ListHeaderToolbar ({
	// common
	dispatch,
	list,

	// expand
	expandIsActive,
	expandOnClick,

	// list
	createIsAvailable,
	createListName,
	createOnClick,

	// search
	searchHandleChange,
	searchHandleClear,
	searchHandleKeyup,
	searchValue,

	// filters
	filtersActive,
	filtersAvailable,

	// columns
	columnsAvailable,
	columnsActive,

	nodownload,
	nofilter,
	noscale,
	
	t,

	isLocale,
	currentLang,
	defaultLang,
	currentUILang,

	...props
}) {
	return (
		<Group block cssStyles={classes.wrapper}>
			{
				!nofilter ? 
				<Section grow cssStyles={classes.search}>
					<ListHeaderSearch
						handleChange={searchHandleChange}
						handleClear={searchHandleClear}
						handleKeyup={searchHandleKeyup}
						value={searchValue}
						t={t}
						list={list}
					/>
				</Section> : null

			}
			<Section grow cssStyles={classes.buttons}>
				<Group block>
					{
						!nofilter ? 
						<Section cssStyles={classes.filter}>
							<ListFiltersAdd
								dispatch={dispatch}
								currentUILang={currentUILang}
								activeFilters={filtersActive}
								availableFilters={filtersAvailable}
								t={t}
								list={list}
							/>
						</Section> : null
					}
					<Section cssStyles={classes.columns}>
						<ListColumnsForm
							availableColumns={columnsAvailable}
							activeColumns={columnsActive}
							dispatch={dispatch}
							t={t}
							list={list}
						/>
					</Section>
					{
						!nodownload ? 
						<Section cssStyles={classes.download}>
							<ListDownloadForm
								currentLang={isLocale ? currentLang : null}
								activeColumns={columnsActive}
								dispatch={dispatch}
								list={list}
								t={t}
							/>
						</Section> : null
					}
					{
						isLocale ?
						<Section grow cssStyles={classes.filter}>
							<div className="localization_List-section">
								<LocalizationSelector
									dispatch={dispatch}
									language={currentLang}
									defaultLang={defaultLang} />
							</div>
						</Section> : null
					}
					{
						!noscale ? 
						<Section cssStyles={classes.expand}>
							<ButtonDivider>
								<GlyphButton
									active={expandIsActive}
									glyph="mirror"
									onClick={expandOnClick}
									title="Expand table width"
								/>
							</ButtonDivider>
						</Section> : null
					}
					{createIsAvailable && <Section cssStyles={classes.create}>
						<ButtonDivider>
							<CreateButton
								listName={createListName}
								onClick={createOnClick}
								t={t}
								list={list}
							/>
						</ButtonDivider>
					</Section>}
				</Group>
			</Section>
		</Group>
	);
};

ListHeaderToolbar.propTypes = {
	columnsActive: PropTypes.array,
	columnsAvailable: PropTypes.array,
	createIsAvailable: PropTypes.bool,
	createListName: PropTypes.string,
	createOnClick: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
	expandIsActive: PropTypes.bool,
	expandOnClick: PropTypes.func.isRequired,
	filtersActive: PropTypes.array,
	filtersAvailable: PropTypes.array,
	list: PropTypes.object,
	isLocale: PropTypes.bool,
	currentLang: PropTypes.string,
	currentUILang: PropTypes.string,
	defaultLang: PropTypes.string,
	searchHandleChange: PropTypes.func.isRequired,
	searchHandleClear: PropTypes.func.isRequired,
	searchHandleKeyup: PropTypes.func.isRequired,
	searchValue: PropTypes.string,
};

const tabletGrowStyles = {
	[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
		flexGrow: 1,
	},
};

const classes = {
	// main wrapper
	wrapper: {
		[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
			flexWrap: 'wrap',
		},
	},

	// button wrapper
	buttons: {
		[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
			paddingLeft: 0,
		},
	},

	// cols
	expand: {
		[`@media (max-width: ${theme.breakpoint.desktopMax})`]: {
			display: 'none',
		},
	},
	filter: {
		[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
			paddingLeft: 0,
			flexGrow: 1,
		},
	},
	columns: tabletGrowStyles,
	create: tabletGrowStyles,
	download: tabletGrowStyles,
	search: {
		[`@media (max-width: ${theme.breakpoint.tabletPortraitMax})`]: {
			marginBottom: '0.75em',
			minWidth: '100%',
		},
	},
};

export default translate(['headerToolBar', 'form'])(ListHeaderToolbar);
// module.exports = ListHeaderToolbar;
