import { makeStyles } from "@material-ui/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import {

} from '@material-ui/core/colors';

export default makeStyles(theme => ({
  logotype: {
    color: "white",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontWeight: 500,
    fontSize: 18,
    whiteSpace: "nowrap",
    textAlign: 'left',
    textTransform: "uppercase",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  localizationIconImage: {
    marginRight: theme.spacing(1), 
    maxWidth: 30,
  },
  globalLoaderShow: {
    display: 'block',
  },
  globalLoaderHide: {
    display: 'none',
  },
  appBar: {
    width: "100vw",
    backgroundColor: theme.palette.primary.main,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  grow: {
    flexGrow: 1,
  },
  search: {
    position: "relative",
    borderRadius: 25,
    paddingLeft: theme.spacing(2.5),
    width: 36,
    backgroundColor: fade(theme.palette.common.black, 0),
    transition: theme.transitions.create(["background-color", "width"]),
    "&:hover": {
      cursor: "pointer",
      backgroundColor: fade(theme.palette.common.black, 0.08),
    },
  },
  searchFocused: {
    backgroundColor: fade(theme.palette.common.black, 0.08),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 250,
    },
  },
  // searchIcon: {
  //   width: 36,
  //   right: 0,
  //   height: "100%",
  //   position: "absolute",
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   transition: theme.transitions.create("right"),
  //   "&:hover": {
  //     cursor: "pointer",
  //   },
  // },
  // searchIconOpened: {
  //   right: theme.spacing(1.25),
  // },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    height: 36,
    padding: 0,
    paddingRight: 36 + theme.spacing(1.25),
    width: "100%",
  },
  // messageContent: {
  //   display: "flex",
  //   flexDirection: "column",
  // },
  headerMenu: {
    marginTop: theme.spacing(7),
  },
  headerMenuList: {
    display: "flex",
    flexDirection: "column",
  },
  headerMenuItem: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  headerMenuButton: {
    marginLeft: theme.spacing(3),
    padding: theme.spacing(0.5),
    // opacity: 0.5,
    // '&:hover': {
    //   opacity: 0.7,
    // },
  },
  headerMenuButtonCollapse: {
    marginRight: theme.spacing(3),
  },
  headerIcon: {
    fontSize: 28,
    color: "rgba(255, 255, 255, 0.35)",
  },
  headerIconCollapse: {
    color: "white",
  },
  profileMenu: {
    minWidth: 265,
  },
  profileMenuUser: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    outline: 'none',
  },
  profileMenuItem: {
    color: theme.palette.text.hint,
  },
  logoLink: {
    '&:active, &:hover, &visited': {
      textDecoration: 'none',
      outline: 'none',
    },
  },
  logotypeImage: {
    maxWidth: 100,
    maxHeight: 55,
    // marginLeft: theme.spacing(0.5),
  },
  profileMenuIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.text.hint,
  },
  profileEmailText: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  roleCardContainer: {
    marginLeft: -6,
    marginRight: -6,
    maxWidth: 360,
  },
  delegatedUserIcon: {
    marginLeft: theme.spacing(0.5),
  },
  userProfileIcon: {
    fontSize: 50,
  },
  userLanguageContainer: {
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
  userLanguageDropIcon: {
    color: 'white',
  },
  userProfileContainer: {
    flexWrap: 'nowrap',
    marginBottom: theme.spacing(1),
    '& > div:first-child': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& > div': {
        border: `1px solid ${theme.palette.text.hint}`,
        backgroundColor: 'white',
        textAlign: 'center',
        padding: theme.spacing(1),
        marginRight: theme.spacing(2),
        width: 73,
        borderRadius: '50%',
      },
    },
  },
  roleCardItem: {
    fontWeight: 500,
    margin: theme.spacing(0.5),
  },
  profileMenuLink: {
    fontSize: 16,
    textAlign: 'center',
    textDecoration: 'none',
    '&:hover': {
      cursor: 'pointer',
    }
  },
  signoutIcon: {
    marginRight: theme.spacing(2),
  },
  messageNotification: {
    height: "auto",
    display: "flex",
    alignItems: "center",
    "&:hover, &:focus": {
      backgroundColor: theme.palette.background.light,
    },
  },
  messageNotificationSide: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginRight: theme.spacing(2),
  },
  messageNotificationBodySide: {
    alignItems: "flex-start",
    marginRight: 0,
  },
  sendMessageButton: {
    margin: theme.spacing(4),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textTransform: "none",
  },
  sendButtonIcon: {
    marginLeft: theme.spacing(2),
  },
}));
