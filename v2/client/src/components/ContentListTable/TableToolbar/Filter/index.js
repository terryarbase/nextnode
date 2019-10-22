import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  IconButton,
} from '@material-ui/core';
import {
  FilterList as FilterListIcon,
} from '@material-ui/icons';

// styles
// import useStyles from "./styles";

// locales
import i18n from "./../../../../i18n";

const FilterTool = props => {
  const [open, setOpen] = useState(false);
  const onClose = c => {
    
    setOpen(false);
  }
  const onOpen = () => setOpen(true);
  const {
    currentList:{
      filters=[],
    },
    tableLabel='',
  } = props;
  const filterLabel = i18n.t('filter.label', { name: tableLabel });
  return (
    <React.Fragment>
      <Tooltip title={filterLabel}>
        <IconButton aria-label={filterLabel}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};

FilterTool.propTypes = {
  tableLabel: PropTypes.string,
  currentList: PropTypes.object,
};

export default FilterTool;
