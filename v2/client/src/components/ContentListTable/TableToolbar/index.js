import React from 'react';
// , { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import {
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import {
  // ViewColumn as ViewColumnIcon,
  Delete as DeleteIcon,
  // FilterList as FilterListIcon,
} from '@material-ui/icons';

// styles
import useStyles from "./styles";

// locales
import i18n from "./../../../i18n";

// components
import FilterTool from "./Filter";
import ColumnTool from "./Column";
import SearchBar from "./Search";

const NormalToolbar = props => {
  // const classes = useStyles();
  const {
    tableLabel,
    keyword,
    searchable,
  } = props;
  return (
    <React.Fragment>
      {
        !!searchable && <React.Fragment>
          <SearchBar {...props} keyword={keyword} tableLabel={tableLabel} />
          <FilterTool tableLabel={tableLabel} />
        </React.Fragment>
      }
      <ColumnTool {...props} tableLabel={tableLabel} />
    </React.Fragment>
  );
}

const SelectionToolbar = props => {
  const classes = useStyles();
  const {
    tableLabel,
    numSelected,
  } = props;
  
  const langs = {
    selected: i18n.t('list.selected'),
    deleteSelected: i18n.t('list.deleteSelected', { name: tableLabel }),
  };
  return (
    <React.Fragment>
      <Typography key="selected" className={classes.title} color="inherit" variant="subtitle1">
          {numSelected} {langs.selected}
      </Typography>
      <Tooltip title={langs.deleteSelected}>
        <IconButton aria-label={langs.deleteSelected}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}

const ContentListTableToolbar = props => {
  const classes = useStyles();
  const {
    numSelected,
    currentList,
    tableLabel,
  } = props;

  const keyword = currentList.search;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {
        !!numSelected ? 
        <SelectionToolbar
          {...props}
          tableLabel={tableLabel}
          numSelected={numSelected}
        /> : 
        <NormalToolbar
          {...props}
          tableLabel={tableLabel}
          keyword={keyword}
          searchable={!currentList.noSeacrh}
        />
      }
    </Toolbar>
  );
};

ContentListTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  tableLabel: PropTypes.string,
  currentList: PropTypes.object,
};

export default ContentListTableToolbar;
