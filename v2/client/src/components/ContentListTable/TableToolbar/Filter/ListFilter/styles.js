import { fade, makeStyles } from '@material-ui/core/styles';
import {
  blueGrey,
  grey,
} from '@material-ui/core/colors';

const useInputStyles = makeStyles(theme => ({
  root: {
    border: '1px solid #e2e2e1',
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#fcfcfb',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: '#fff',
    },
    '&$focused': {
      backgroundColor: '#fff',
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
  focused: {},
}));

const useListStyles = makeStyles(theme => ({
  dialogContainer: {
    minWidth: '370px',
    minHeight: '500px',
  },
  dialogContent: {
    textAlign: 'center',
  },
  listContainer: {
    textAlign: 'left',
  },
  dialogTitle: {
    padding: 0,
  },
  dialogTitleHeader: {
    backgroundColor: blueGrey[700],
  },
  dialogTitleHeaderSub: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
  },
  noFilter: {
    color: grey[500],
  },
  filterListHeader: {
  	marginTop: theme.spacing(2),
  	marginBottom: theme.spacing(1),
  	color: blueGrey[700],
  	fontSize: 17,
  },
}));

export {
	useInputStyles,
	useListStyles,
};
