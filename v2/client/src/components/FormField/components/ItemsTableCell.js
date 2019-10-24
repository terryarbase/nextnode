import React from 'react';
// import classnames from 'classnames';
import {
  TableCell,
} from '@material-ui/core';

function ItemsTableCell ({ className, ...props }) {
	return <TableCell align="left" {...props} />;
};

export default ItemsTableCell;
