import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Table,
  TableBody,
  Paper,
  Grid,
  TablePagination,
  Badge,
  Divider,
  Typography,
  TableRow,
  TableCell,
} from '@material-ui/core';

// configurations
import {
  table,
} from "./../../config/constants.json";

// components
import TableToolbar from './TableToolbar';
import TableHeader from './TableHead';
import TableRower from './TableRow';
// import NextFieldColumns from './../FormField/types/columns';

// styles
import useStyles from "./styles";

// locales
import i18n from "./../../i18n";

// utils
import {
  translateListName,
} from "./../../utils/multilingual";
import {
  replaceQueryParams,
} from "./../../utils/v1/queryParams";

const ContentListTable = props => {
  // const [realInfo, setRealInfo] = useState(null);
  const [selected, setSelected] = useState([]);
  // get the first sorting field
  // const [orderBy, setOrderBy] = useState(
  //   _.get(props, 'currentList.sort.paths[0].path')
  // );

  const classes = useStyles();

  const {
    info,
    currentList,
    history,
    loading,
  } = props;

  const {
    results=[],
    count=0,
  } = info;

  const {
    // size, // size per page
    paging,
  } = table;

  console.log(currentList);

  const handleRequestSort = (event, property, direction) => {
    let sort = property;
    if (direction === 'asc') {
      // invert the direction
      sort = `-${property}`;
    }
    // console.log(direction, sort);
    replaceQueryParams({
      sort,
    }, history);
    // setOrderBy(property);
  };

  const handleSelectAllClick = checked => {
    if (checked) {
      // delegated record would not be selected
      const newSelecteds = _.chain(results)
                        .filter(({ delegated }) => !delegated)
                        .map(({ id }) => id)
                        .value();
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleChangePage = (e, page) => replaceQueryParams({
    page,
  }, history);

  const handleChangeRowsPerPage = ({ target: { value } }) => replaceQueryParams({
    page: 0,
    limit: value,
  }, history);

  // const onRealEdit = ({
  //   path,
  //   key,
  //   value,
  // }) => {
  //   const current = realInfo || {};
  //   const info = {
  //     ...current,
  //     [path]: {
  //       ...current[path],
  //       [key]: value,
  //     }
  //   };

  //   setRealInfo(info);
  // }

  // const onClearRealEdit = () => setRealInfo(null);

  const tableLabel = translateListName(currentList.key);

  const {
    noedit,
    nodelete,
    key: listName,
    page,
    limit,
    expandedDefaultColumns: columns,
  } = currentList;

  const mangeMode = !!selected.length;
  // invoke what can be selected and remove
  const selectable = !noedit && !nodelete;

  const limitPerPage = _.includes(paging, limit) ? limit : paging[0];

  let currentPage = Number(page);
  currentPage = currentPage < 0 ? 0 : currentPage;

  /*
  **
  ** =========
  */
  const pageTitle = useMemo(() => (
    <Typography variant="h1" className={classes.tableTitle}>
        <Badge badgeContent={count} color="primary">
          {tableLabel}
        </Badge>
      </Typography>
  ), [ tableLabel, count ]);
  const pagination = useMemo(() => (
    <TablePagination
        rowsPerPageOptions={paging}
        component="div"
        count={count}
        className={classes.paginationCell}
        rowsPerPage={limitPerPage}
        page={currentPage}
        labelDisplayedRows={info => i18n.t('paging.info', info)}
        backIconButtonProps={{
          'aria-label': i18n.t('paging.previous'),
        }}
        nextIconButtonProps={{
          'aria-label': i18n.t('paging.next'),
        }}
        onChangePage={handleChangePage}
        labelRowsPerPage={i18n.t('paging.perPage', { name: tableLabel })}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
  ), [ currentPage, count, limitPerPage ]);

  let initialMessage = i18n.t('filter.loadingRecord', { name: tableLabel });
  if (!loading) {
    if (!results.length) {
      initialMessage = i18n.t('filter.noresult', { name: tableLabel });
    } else {
      initialMessage = null;
    }
  }
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {pageTitle}
        <TableToolbar
          {...props}
          numSelected={selected.length}
          currentList={currentList}
          searchable={currentList.nofilter}
          tableLabel={tableLabel}
          listName={listName}
          // realInfo={realInfo}
          // onRealEdit={onRealEdit}
          // onClearRealEdit={onClearRealEdit}
        />
        {
          !mangeMode && <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            {pagination}
          </Grid>
        }
        <Divider />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby={tableLabel}
            size="small"
            aria-label={tableLabel}
          >
            {
              !!results.length && <TableHeader
                classes={classes}
                numSelected={selected.length}
                selectable={selectable}
                mangeMode={mangeMode}
                // order={order}
                // orderBy={orderBy}
                currentList={currentList}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={count}
                columns={columns}
                listName={listName}
              />
            }
            <TableBody>
              {
                !!initialMessage ? 
                <TableRow>
                  <TableCell align="center" colSpan={columns.length + 1} className={classes.noResultCell}>
                    {initialMessage}
                  </TableCell>
                </TableRow> : 
                <TableRower
                  {...props}
                  mangeMode={mangeMode}
                  items={results}
                  listName={listName}
                  selectable={selectable}
                  classes={classes}
                  columns={columns}
                  currentList={currentList}
                  setSelected={setSelected}
                  tableLabel={tableLabel}
                  selectedItems={selected}
                />
              }
            </TableBody>
          </Table>
        </div>
        {
          !mangeMode && <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            {pagination}
          </Grid>
        }
      </Paper>
    </div>
  );
};

ContentListTable.propTypes = {
  location: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  currentList: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};


export default ContentListTable;
