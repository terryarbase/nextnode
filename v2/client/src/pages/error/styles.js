import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    left: 0,
  },
  logotype: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(12),
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  logotypeText: {
    fontWeight: 500,
    color: "white",
    textTransform: "uppercase",
    marginLeft: theme.spacing(2),
  },
  // logotypeIcon: {
  //   marginRight: theme.spacing(2),
  // },
  paperRoot: {
    display: "flex",
    backgroundColor: theme.palette.primary.main,
    flexDirection: "column",
    alignItems: "center",
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
  },
  textRow: {
    color: 'white',
    marginBottom: theme.spacing(5),
    textAlign: "center",
  },
  errorCode: {
    fontSize: 50,
    marginTop: theme.spacing(5),
    fontWeight: 600,
  },
  safetyText: {
    fontWeight: 300,
    color: theme.palette.text.hint,
  },
  backButton: {
    backgroundColor: theme.palette.secondary.main,
    textTransform: "none",
    fontSize: 22,
  },
}));
