import React from 'react';
// , { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
} from '@material-ui/core';
import {
  // Delete as DeleteIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Search as SearchIcon,
} from '@material-ui/icons';

// configurations
import {
  listPrefix,
} from "./../../../config/constants.json";

// components
import NextFieldColumns from './../../FormField/types/columns';

// styles
// import useStyles from "./styles";

// locales
import i18n from "./../../../i18n";

// utils
// import {
//   translateListName,
// } from "./../../../utils/multilingual";

const TableCeller = props => {
  const {
    item,
    columns,
    // listName,
    selectable,
    // onChange,
    currentList,
  } = props;

  const isRestricted = (field, { delegated }) => field && !!(field.restrictDelegated) && delegated;
  
  const currentLang = i18n.locale;
  return (
    <React.Fragment>
      {
        columns.map((col, i) => {
          const { type, path, field } = col;
          const ColumnType = NextFieldColumns[type] || NextFieldColumns.unrecognised;
          // use original data value instead of realtime value
          const value = item.fields[path];
          let currentValue = value;
          let newItem = { ...item };
          const restrictDelegated = isRestricted(field, item);
          // is multilingual field
          const isMultilingual = field && field.multilingual;
          // special for multilingual
          if (isMultilingual) {
            // get the default language if the value of the current lang is undefined
            currentValue = _.get(currentValue, currentLang) || _.get(currentValue, i18n.defaultLocale);
            newItem = {
              ...item,
              fields: {
                ...item.fields,
                [path]: currentValue,
              },
            };
          }
          return (
            <ColumnType
              key={path}
              list={currentList}
              col={col}
              data={newItem}
              adminPath={listPrefix}
              currentLang={currentLang}
              noedit={!selectable || restrictDelegated}
              currentValue={currentValue}
              // linkTo={linkTo}
              // onChange={v => {
              //   let newValue = v;
              //   if (isMultilingual) {
              //     newValue = {
              //       ...value,
              //       [currentLang]: v,
              //     };
              //   }

              //   onChange({
              //     key: item.id,
              //     path: path,
              //     value: newValue,
              //   });
              // }}
            />
          );
        })
      }
    </React.Fragment>
  );
}

const TableRower = ({
  items,
  columns,
  selectable,
  setSelected,
  mangeMode,
  listName,
  // deletable,
  tableLabel,
  currentList,
  selectedItems,
  history,
  classes,
}) => {

  const updateSelection = ({ target: { checked } }, id) => {
    // setSelected
    let newSelectedItems = [ ...selectedItems ];
    if (checked) {
      newSelectedItems = _.union(newSelectedItems, [ id ]);
    } else {
      newSelectedItems = _.pull(newSelectedItems, id);
    }
    setSelected(newSelectedItems);
  }

  const onClickEdit = id => {
    history.push(`${listPrefix}/${listName}${id}`);
  }

  const {
    noedit,
    // nodelete,
  } = currentList;

  return (
    <React.Fragment>
      {
        items.map(item => {
          const {
            id,
            delegated,
          } = item;
          const isItemSelected = _.includes(selectedItems, id);
          return (
            <TableRow
              hover
              key={id}
              role="checkbox"
              className={classes.tableRowCell}
              aria-checked={isItemSelected}
              tabIndex={-1}
              selected={isItemSelected}
            >
              {
                !!selectable && <TableCell align="center" padding="checkbox">
                  {
                    !delegated ? <Checkbox
                      checked={isItemSelected}
                      onChange={e => updateSelection(e, id)}
                      disabled={!selectable}
                      inputProps={{ 'aria-labelledby': id }}
                    /> : <BlockIcon />
                  }
                </TableCell>
              }
              <TableCell>
                <IconButton
                  disabled={mangeMode}
                  aria-label={noedit ? i18n.t('list.edit') : i18n.t('list.view')}
                  onClick={() => onClickEdit(id)}
                >
                  {
                    !noedit ? <EditIcon /> : <SearchIcon />
                  }
                </IconButton>
              </TableCell>
              <TableCeller
                item={item}
                selectable={!noedit && !mangeMode}
                listName={listName}
                columns={columns}
                currentList={currentList}
              />
            </TableRow>
          );
        })
      }
    </React.Fragment>
  );
};

TableRower.propTypes = {
  columns: PropTypes.array.isRequired,
  tableLabel: PropTypes.string.isRequired,
  currentList: PropTypes.object.isRequired,
  listName: PropTypes.string,
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  selectable: PropTypes.bool.isRequired,
  mangeMode: PropTypes.bool.isRequired,
  // deletable: PropTypes.bool.isRequired,
  setSelected: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
};

export default TableRower;
