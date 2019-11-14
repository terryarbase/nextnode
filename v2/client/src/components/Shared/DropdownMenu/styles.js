import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  popper: {
    zIndex: 999,
  },
  inlineDropper: {
    // width: 200,
    // color: theme.palette.text.primary,
    padding: '11px 10px',
    fontSize: '13px',
    width: 200,
  },
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
