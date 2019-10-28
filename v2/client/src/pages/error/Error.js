import React from "react";
import { Grid, Paper, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// configurations
import {
  name,
  endpoint,
  logo,
  main,
} from './../../config/constants.json';

// locales
import i18n from './../../i18n';

const ErrorPage = props => {
  const classes = useStyles();
  const {
    innerPage,
  } = props
  return (
    <Grid container className={classes.container}>
      {
        !innerPage && <div className={classes.logotype}>
          <img src={`${endpoint}${logo}`} alt={name} />
        </div>
      }
      <Paper classes={{ root: classes.paperRoot }}>
        <Typography
          variant="h1"
          className={classnames(classes.textRow, classes.errorCode)}
        >
          {i18n.t('common.error404')}
        </Typography>
        <Typography variant="h5" color="primary" className={classes.textRow}>
          {i18n.t('message.error404')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={main}
          size="large"
          className={classes.backButton}
        >
          {i18n.t('message.goBackHome')}
        </Button>
      </Paper>
    </Grid>
  );
}


export default ErrorPage;