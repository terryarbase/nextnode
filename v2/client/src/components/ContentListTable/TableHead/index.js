import React from 'react';
// , { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
} from '@material-ui/core';

// locales
import i18n from "./../../../i18n";

// utils
import {
  translateListField,
} from "./../../../utils/multilingual";

const TableHeader = props => {
  // const [selectAllChecked, setSelectAll] = useState(false);
  const {
    classes,
    onSelectAllClick,
    // mangeMode,
    selectable,
    // order,
    // orderBy,
    currentList: {
      sort: {
        paths=[],
      },
    },
    numSelected,
    rowCount,
    onRequestSort,
    columns,
    listName,
    // tableLabel,
  } = props;
  const createSortHandler = (property, direction) => event => {
    onRequestSort(event, property, direction);
  };
  const onSelectAll = ({ target: { checked } }) => {
    // setSelectAll(checked);
    onSelectAllClick(checked);
  }
  // useMemo(() => {
  //   if (!numSelected) {
  //     setSelectAll(false);
  //   }
  // }, [ numSelected ]);
  return (
    <TableHead>
      <TableRow>
        {
          !!selectable && <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected > 0}
              disabled={!selectable}
              onChange={onSelectAll}
              inputProps={{ 'aria-label': i18n.t('form.selectAll') }}
            />
          </TableCell>
        }
        <TableCell size="medium" />
        {
          columns.map(({
            path: colPath,
            id,
            label
          }) => {
            // only concern on the first sorting
            const activeSort = paths[0];
            // const activeSort = _.find(paths, ({ path }) => path === colPath);
            const order = !!_.get(activeSort, 'invert') ? 'desc' : 'asc';

            return (
              <TableCell
                key={colPath}
                align={'center'}
                padding={'default'}
                sortDirection={order}
                className={classes.tableHeadCell}
              >
                <TableSortLabel
                  active={_.get(activeSort, 'path') === colPath}
                  direction={order}
                  onClick={createSortHandler(colPath, order)}
                >
                  {translateListField(listName, colPath) || label}
                  {!!activeSort ? (
                    <span className={classes.visuallyHidden}>
                      {order === 'desc' ? i18n.t('form.descending') : i18n.t('form.ascending')}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            );
          })
        }
      </TableRow>
    </TableHead>
  );
}

TableHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  selectable: PropTypes.bool.isRequired,
  // mangeMode: PropTypes.bool.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  // order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  // orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default TableHeader;
