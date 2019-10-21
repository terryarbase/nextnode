import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  label: {
    // color: 'black',
    '&$focused': {
      // color: 'white',
    },
  },
  outlinedInput: {
    backgroundColor: 'white',
    color: 'white',
    borderRadius: 0,
    "&:hover": {
      backgroundColor: 'white',
      borderColor: 'transparent',
    },
    "&$focused": {
      backgroundColor: 'white',
      borderColor: 'transparent',
    }
  },
  textField: {
    backgroundColor: 'white',
  },
  outlinedUnderline: {
    borderColor: `red !important`,
  },
  endIcon: {
    color: '#666',
  },
}));
