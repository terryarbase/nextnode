import { makeStyles } from "@material-ui/styles";
import grey from '@material-ui/core/colors/grey';

export default makeStyles(theme => ({
  link: {
    textDecoration: "none",
    "&:hover, &:focus": {
      backgroundColor: theme.palette.background.light,
    },
  },
  linkActive: {
    backgroundColor: theme.palette.background.light,
  },
  linkNested: {
    paddingLeft: 0,
    "&:hover, &:focus": {
      backgroundColor: "#FFFFFF",
    },
  },
  misMatchKeyword: {
    display: 'none',
  },
  linkIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary + "99",
    transition: theme.transitions.create("color"),
    width: 24,
    display: "flex",
    justifyContent: "center",
  },
  linkIconActive: {
    color: theme.palette.primary.main,
  },
  linkText: {
    padding: 0,
    color: grey[800],
    transition: theme.transitions.create(["opacity", "color"]),
    fontSize: 13,
  },
  linkTextActive: {
    color: grey[900],
    fontWeight: 'bolder',
  },
  linkTextHidden: {
    opacity: 0,
  },
  nestedList: {
    paddingLeft: theme.spacing(1) + 20,
  },
  sectionTitle: {
    marginLeft: theme.spacing(4.5),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    height: 1,
    backgroundColor: "#D8D8D880",
  },
}));