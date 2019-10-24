import React, { useState, useMemo } from 'react';
// import PropTypes from 'prop-types';
// import { findDOMNode } from 'react-dom';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  // Divider,
  Button,
  ListItemSecondaryAction,
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import {
	KeyboardArrowLeft as KeyboardArrowLeftIcon,
	ChevronRight as ChevronRightIcon,
	Clear as ClearIcon,
} from '@material-ui/icons';
import _ from 'lodash';
// import Transition from 'react-addons-css-transition-group';
// import classnames from 'classnames';

// styles
import {
	useInputStyles,
	useListStyles,
} from './styles';

// components
import Filters from './../../../../FormField/types/filters';

// configurations
import {
	main,
	endpoint,
	apiVersionV2Session,
} from '../../../../../config/constants.json';

// utils
import {
	translateListField,
	translateListHeading,
} from '../../../../../utils/multilingual';
import {
	requestHeader,
} from '../../../../../utils/request';

// locale
import i18n from '../../../../../i18n';


const StyledInput = props => {
	const classes = useInputStyles();
  	return (
  		<TextField
  			InputProps={{
  				classes,
  				disableUnderline: true
  			}}
  			fullWidth
  			{...props}
  		/>
  	);
}

const FilterList = props => {
	const {
		searchString,
		activeFilters,
		list,
		classes,
		columns,
		selectField,
	} = props;

	// const activeFilterFields = activeFilters.map(obj => obj.field);
	const activeFilterPaths = activeFilters.map(obj => obj.path);
	const filteredFilters = columns.filter(col => (
		(col.field && col.field.hasFilterMethod) || col.type === 'heading'
	));
	const checkFilterKeyword = (k='', t='') => {
		const keyword = _.toLower(k).replace(/\s/g,'');
		const target = _.toLower(t).replace(/\s/g,'');
		return keyword && new RegExp(keyword).test(target);
	};
	let popoutList = [];
	filteredFilters.forEach((el, i) => {
		let label = '';
		// once input filtering keyword then skip this logic
		if (el.type === 'heading' && !searchString) {
			label = translateListHeading(list.key, el.content);

			popoutList = [
				...popoutList,
				<Typography className={classes.filterListHeader} variant="h5" key={`heading_${i}`}>
					{label}
				</Typography>
			];
		} else if (el.type === 'field') {
			const path = el.field.path;
			const filterIsActive = activeFilterPaths.length && 
				(activeFilterPaths.indexOf(path) > -1);
			label = translateListField(list.key, path, el.field.label);

			const isFiltered = checkFilterKeyword(searchString, label);
			if (isFiltered || !searchString) {
				popoutList = [
					...popoutList,
					<ListItem
						key={`field_${i}`}
						button
						divider
						selected={!!filterIsActive}
						dense
						onClick={() => { selectField(el.field); }}
					>
				        <ListItemText 
				          primary={label}
				        />
				        <ListItemSecondaryAction>
				          <ChevronRightIcon />
				        </ListItemSecondaryAction>
				    </ListItem>
				];
			}
		}
	});

	return (
		<List component="nav" className={classes.listContainer}>
			{
				!popoutList.length && !!searchString ? 
				(
					<Typography variant="h6" className={classes.noFilter}>
						{i18n.t('filter.noresult', { name: searchString })}
					</Typography>
				) : popoutList
			}
		</List>
	);
}

const ListFiltersAdd = props => {
	const classes = useListStyles();
	const {
		isOpen,
		list,
		localization=[],
		activeFilters,
		onApply,
	} = props;
	// const [filterComponent, setFilterComponent] = useState(null);
	const [searchString, setSearchString] = useState('');
	const [selectedField, setSelectedField] = useState(null);
	const [filterValue, setFilterValue] = useState({});

	const navigateBack = () => {
		setSearchString('');
		setFilterValue({});
		setSelectedField(null);
	};

	const closePopout = () => {
		props.onClose();
		navigateBack();
	};

	const applyFilter = () => {
		onApply(selectedField.path, filterValue);
		// this.props.dispatch(setFilter(this.state.selectedField.path, value, this.props.currentLang));
		closePopout();
		// props.onApply(selectedField.path, value);
	};

	const onFilterChange = value => setFilterValue(value);

	// set initial props, and props changed
	const FilterComponent = useMemo(() => {
		let filterComponent = null;
		let filterValue = null;

		if (selectedField) {
			const {
				type,
				path,
			} = selectedField;
			filterComponent = Filters[type];
			filterValue = activeFilters.filter(i => 
				i.path === path)[0];
		}
		if (!filterValue) {
			filterValue = filterComponent && 
				filterComponent.getDefaultValue ? 
				filterComponent.getDefaultValue() : {};
		}

		// if (!filterComponent) {
		// 	filterComponent = (<div>{i18n.t('filter.errorMessage')}</div>);
		// }
		// setFilterComponent(filterComponent);	
		setFilterValue(filterValue);
		return filterComponent;	
	}, [ selectedField, activeFilters ]);

	const DialogHeader = useMemo(() => (
		<DialogTitle id="confirmation-dialog-title" className={classes.dialogTitle}>
			<AppBar position="static" className={classes.dialogTitleHeader}>
				<Toolbar>
					{
						!!selectedField && <IconButton
							edge="start"
							color="inherit"
							onClick={navigateBack}
							aria-label={i18n.t('filter.back')}
						>
							<KeyboardArrowLeftIcon />
						</IconButton>
					}
					<Typography variant="h6" noWrap className={classes.dialogTitleHeaderSub}>
					{
						!!selectedField ? 
						translateListField(list.key, selectedField.path) : 
						i18n.t('filter.filterLabel')
					}
					</Typography>
					{
						!selectedField && <IconButton
							edge="end"
							color="inherit"
							onClick={closePopout}
							aria-label={i18n.t('filter.cancel')}
						>
							<ClearIcon />
						</IconButton>
					}
		      </Toolbar>
		    </AppBar>
	    </DialogTitle>
	), [ selectedField ]);
	const DialogFooter = useMemo(() => (
		selectedField && <DialogActions>
	      <Button onClick={closePopout} color="primary">
	        {i18n.t('filter.cancel')}
	      </Button>
	      <Button onClick={applyFilter} color="primary" variant="contained">
	        {i18n.t('filter.apply')}
	      </Button>
	    </DialogActions>
	), [ selectedField, filterValue ]);

	return (
		<Dialog
			maxWidth="lg"
			onClose={closePopout}
			aria-labelledby="confirmation-dialog-title"
			open={isOpen}
			className={classes.dialogContainer}
		>
		    {DialogHeader}
		    <DialogContent className={classes.dialogContent}>
				{
					!!selectedField ? 
					(
						FilterComponent ? <FilterComponent
							{...props}
							field={selectedField}
							filter={filterValue}
							localePacks={localization[i18n.locale]}
							list={list}
							onChange={onFilterChange}
							adminPath={main}
							url={`${endpoint}${apiVersionV2Session}`}
							requestHeader={requestHeader({ isAuth: true })}
						/> : (
							<div>{i18n.t('filter.errorMessage')}</div>
						)
					) : 
					<React.Fragment>
						<StyledInput
					        label={i18n.t('filter.filterLabel')}
					        placeholder={i18n.t('filter.placeholder')}
					        variant="filled"
					        defaultValue={searchString}
					        onChange={({ target: { value } }) => setSearchString(value)}
					    />
						<FilterList
							{...props}
							classes={classes}
							selectField={setSelectedField}
							searchString={searchString}
						/>
					</React.Fragment>

				}
			</DialogContent>
		    {DialogFooter}
		</Dialog>
	);
}

export default ListFiltersAdd;
// module.exports = ListFiltersAdd;
