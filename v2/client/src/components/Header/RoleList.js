import React from "react";
import {
  Chip,
  Grid,
} from "@material-ui/core";
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import {
  Face as FaceIcon,
} from "@material-ui/icons";

// styles
import useStyles from "./styles";

// context
import {
  useUserState,
} from "../../store/user/context";

// utils
import {
  randomColorPicker,
} from "../../utils/misc";

// locales
import i18n from "../../i18n";

const randomTheme = color => createMuiTheme({
  palette: {
    primary: {
      main: color,
    },
  },
});

export default function RoleList(props) {
  const classes = useStyles();

  // global
  const {
    user: {
      role=[],
    },
  } = useUserState();
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      className={classes.roleCardContainer}
    >
      {
        role.map(r => (
          <Grid item key={r._id}>
            <ThemeProvider theme={randomTheme(randomColorPicker())}>
              <Chip
                color="primary"
                size="small"
                icon={<FaceIcon />}
                className={classes.roleCardItem}
                label={r.name || i18n.t('account.nonameRole')}
              />
            </ThemeProvider>
          </Grid>
        ))
      }
    </Grid>
  );
}
