import React from 'react';
// , { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import {
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  DialogContentText,
} from '@material-ui/core';
import {
  // ViewColumn as ViewColumnIcon,
  Delete as DeleteIcon,
  // Save as SaveIcon,
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
import MessageBox from './../../Shared/MessageBox';

// hooks,
import {
  useToggle,
} from './../../../hook/list';

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
          <FilterTool {...props} tableLabel={tableLabel} />
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
    onRemove,
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
        <IconButton
          aria-label={langs.deleteSelected}
          onClick={onRemove}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}

const ContentListTableToolbar = props => {
  const [isAsk, openConfirmBox] = useToggle(false);
  const classes = useStyles();

  const {
    numSelected,
    currentList,
    tableLabel,
    onRemove,
  } = props;
  const onDelete = () => {
    openConfirmBox();
    onRemove();
  }
  const keyword = currentList.search;
  const deleteMessage = `${i18n.t('list.deleteAskMsg', { num: numSelected })}, ${i18n.t('list.cannotUndo')}`;
  return (
    <React.Fragment>
        <MessageBox
          {...props}
          isOpen={isAsk}
          title={i18n.t('list.deleteAskTitle')}
          onCancel={openConfirmBox}
          onOK={onDelete}
        >
        <DialogContentText>
          {deleteMessage}
        </DialogContentText>
       </MessageBox>
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
            onRemove={openConfirmBox}
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
    </React.Fragment>
  );
};

ContentListTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  tableLabel: PropTypes.string,
  onRemove: PropTypes.func,
  currentList: PropTypes.object,
};

export default ContentListTableToolbar;
