import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  chipRoot: {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(1.25),
    paddingRight: theme.spacing(1.25),
    alignItems: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));
