import { makeStyles } from "@material-ui/styles";
// import blueGrey from '@material-ui/core/colors/blueGrey';

const styles = makeStyles(theme => ({
  root: {
    verticalAlign: 'middle',
    display: 'flex',
    marginTop: theme.spacing(1),
    // background: '#fbf3b6',
    // borderRadius: '4px',
    // padding: '5px 5px 5px 8px',
    color: '#8a8787',
    fontSize: '14px',
   },
   icon: {
   	marginRight: theme.spacing(1),
   }
}));

export default styles;
