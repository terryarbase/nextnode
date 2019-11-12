import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    margin: 10,
    opacity: 0.5,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));
