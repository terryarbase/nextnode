import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash';
import {
  InputBase,
  Paper,
  Divider,
  IconButton,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Close as CloseIcon,
} from '@material-ui/icons';

// styles
import useStyles from './styles';

// locales
import i18n from "./../../../../i18n";

// utils
import {
  replaceQueryParams,
} from "./../../../../utils/v1/queryParams";

const TableSearch = props => {
  const [search, setKeyword] = useState(props.keyword || '');
  const classes = useStyles();
  const {
    tableLabel,
    history,
  } = props;

  const changeKeyword = ({ target: { value } }) => setKeyword(value);

  const searchIt = search => replaceQueryParams({
    search,
  }, history);

  const clearKeyword = () => {
    searchIt('');
  };

  const searchKeyword = () => {
    searchIt(search);
  };

  const onKeyPress = ({ key }) => {
    if (key === 'Enter') {
      searchKeyword();
    }
  }

  const placeholder = i18n.t('list.searchPlaceholder', { name: tableLabel });

  const keywordInput = useMemo(() => (
    <InputBase
      className={classes.input}
      placeholder={placeholder}
      defaultValue={search}
      onKeyPress={onKeyPress}
      onChange={changeKeyword}
      inputProps={{ 'aria-label': placeholder }}
    />
  ), [ search ]);

  return (
    <Paper className={classes.root}>
      { keywordInput }
      {
        !!search.length && <IconButton
          className={classes.iconButton}
          onClick={clearKeyword}
          aria-label={i18n.t('list.clearAll')}
        >
          <CloseIcon />
        </IconButton>
      }
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton
        className={classes.iconButton}
        onClick={searchKeyword}
        aria-label={i18n.t('list.search')}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

TableSearch.propTypes = {
  keyword: PropTypes.string,
  tableLabel: PropTypes.string,
  history: PropTypes.object.isRequired,
};

export default TableSearch;
