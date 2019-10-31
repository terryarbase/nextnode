import { makeStyles } from "@material-ui/styles";
import blueGrey from '@material-ui/core/colors/blueGrey';

export default makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
  },
  fabButton: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  tableTitle: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    textTransform: 'uppercase',
    color: 'black',
    fontSize: 25,
    textAlign: 'left',
    [theme.breakpoints.down("md")]: {
      textAlign: 'center',
      paddingLeft: 0,
    },
    '& > span': {
      paddingRight: theme.spacing(3),
    },
  },
  table: {
    minWidth: 750,
  },
  paginationCell: {
    color: blueGrey[500],
  },
  tableHeadCell: {
    fontSize: 13,
    fontWeight: 'bolder',
    textTransform: 'uppercase',
  },
  tableRowCell: {
    '& > td': {
      fontSize: 13,
    },
  },
  noResultCell: {
    color: blueGrey[600],
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));
