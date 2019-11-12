import React from 'react';
import {
  Paper,
  InputBase,
  // Divider,
} from '@material-ui/core';
import {
  Search as SearchIcon,
} from '@material-ui/icons';

import useStyles from './styles';

const SearchBox = props => {
  const classes = useStyles();
  const {
    // label,
    placeholder='',
    onChange,
  } = props;

  const onKeySearch = ({ target: { value } }) => onChange(value);
  return (
    <Paper className={classes.root}>
      <SearchIcon className={classes.iconButton} />
      <InputBase
        className={classes.input}
        placeholder={placeholder}
        onChange={onKeySearch}
        inputProps={{ 'aria-label': placeholder }}
      />
    </Paper>
  );
}

export default SearchBox;
