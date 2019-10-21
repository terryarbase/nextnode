import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Tooltip,
  IconButton,
} from '@material-ui/core';
import {
  ViewColumn as ViewColumnIcon,
} from '@material-ui/icons';

// styles
// import useStyles from "./styles";
// components
import ColumnSelection from "./ColumnSelection";

// locales
import i18n from "./../../../../i18n";

// utils
import {
  replaceQueryParams,
} from "./../../../../utils/v1/queryParams";

const ColumnTool = props => {
  const [open, setOpen] = useState(false);

  const onClose = c => {
    if (c) {
      const columns = _.map(c, v => v.path).join(',');
      replaceQueryParams({
        columns,
      }, props.history);
    }
    setOpen(false);
  }
  const onOpen = () => setOpen(true);

  const {
    tableLabel='',
    currentList: {
      columns,
      expandedDefaultColumns,
    },
  } = props;
  const label = i18n.t('filter.column', { name: tableLabel });
  console.log(expandedDefaultColumns);
  // const columnsToBeShown = _.

  return (
    <React.Fragment>
      <Tooltip title={label}>
        <IconButton
          aria-label={label}
          onClick={onOpen}
        >
          <ViewColumnIcon />
        </IconButton>
      </Tooltip>
      <ColumnSelection
        {...props}
        onClose={onClose}
        open={open}
        items={expandedDefaultColumns}
        options={columns}
        updateFieldRef="path"
      />
    </React.Fragment>
  );
};

ColumnTool.propTypes = {
  tableLabel: PropTypes.string,
  currentList: PropTypes.object.isRequired,
};

export default ColumnTool;
