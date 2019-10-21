import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  dropDownButtonContainer: {
    '& > div': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '& > div:first-child': {
      marginRight: theme.spacing(1),
      '& > img': {
        width: 30, 
      },
    },
    '& > div:nth-child(2)': {
      fontSize: 15,
      color: 'white',
    },
  },
  dropDownButtonIcon: {
    color: 'white',
  },
  dropDownSelectionLabel: {
    padding: '10px 10px 0 10px',
    textAlign: 'center',
  },
}));
