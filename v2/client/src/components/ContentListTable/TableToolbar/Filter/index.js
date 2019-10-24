import React, { useState, useMemo } from 'react';
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

// context
import {
  useUserState,
} from "./../../../../store/user/context";

// components
import ListFiltersAdd from "./ListFilter/ListFiltersAdd";

import {
  replaceQueryParams,
  parametizeFilters,
} from "./../../../../utils/v1/queryParams";

const FilterTool = props => {
  const {
    currentList,
    currentList:{
      filters=[],
      columns,
    },
    tableLabel='',
  } = props;
  const [open, setOpen] = useState(false);
  const onClose = c => {
    setOpen(false);
  }
  const onOpen = () => setOpen(true);
  const onApply = (path, filter) => {
    // add the new filter value
    currentList.addFilter({
      path,
      ...filter,
    });
    replaceQueryParams({
      filters: currentList.filters,
    }, props.history);
  }
  const {
    info: {
      nextnode: {
        localization={},
      },
    }
  } = useUserState();
  const filterLabel = i18n.t('filter.label', { name: tableLabel });
  const listFiltersAdder = useMemo(() => (
    <ListFiltersAdd
      {...props}
      activeFilters={filters}
      columns={columns}
      onClose={onClose}
      isOpen={open}
      list={currentList}
      onApply={onApply}
      localization={localization}
    />
  ), [ open, currentList, filters, localization ]);

  return (
    <React.Fragment>
      <Tooltip title={filterLabel}>
        <IconButton
          aria-label={filterLabel}
          onClick={onOpen}
        >
          <FilterListIcon />
        </IconButton>
      </Tooltip>
      {listFiltersAdder}
    </React.Fragment>
  );
};

FilterTool.propTypes = {
  tableLabel: PropTypes.string,
  currentList: PropTypes.object,
};

export default FilterTool;
