import React, { useState } from 'react';
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
    // keyword,
  } = props;

  // useEffect(() => {
  //   console.log('>>>>>>', keyword);
  //   setKeyword(keyword);
  // }, [ keyword ]);

  const changeKeyword = ({ target: { value } }) => setKeyword(value);

  const searchIt = search => replaceQueryParams({
    search,
  }, history);

  const clearKeyword = () => {
    setKeyword('');
    // inputEl.current.value = '';
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

  // const keywordInput = useMemo(() => {
  //   return <InputBase
  //     className={classes.input}
  //     placeholder={placeholder}
  //     defaultValue={search}
  //     onKeyPress={onKeyPress}
  //     inputProps={{ 'aria-label': placeholder }}
  //   />
  // }, [ classes, placeholder, search ]);
  // console.log(inputEl.current);
  return (
    <Paper className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder={placeholder}
        value={search}
        onChange={changeKeyword}
        onKeyPress={onKeyPress}
        inputProps={{ 'aria-label': placeholder }}
      />
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