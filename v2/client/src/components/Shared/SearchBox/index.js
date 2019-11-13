import React from 'react';
import {
  // Paper,
  // InputBase,
  FormControl,
  // InputLabel,
  Input,
  InputAdornment,

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
    <FormControl className={classes.root}>
      <Input
        className={classes.input}
        id="input-with-icon-adornment"
        onChange={onKeySearch}
        placeholder={placeholder}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
    </FormControl>
  );
}

export default SearchBox;
