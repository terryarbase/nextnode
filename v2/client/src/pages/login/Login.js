import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Fade,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";

// styles
import useStyles from "./styles";

// context
import {
  useUserDispatch,
  useUserState,
  loginUser,
} from "../../store/user/context";
import {
  useListDispatch,
} from "../../store/list/context";

// configurations
import {
  name,
  endpoint,
  logo,
  company,
  copyright,
} from "./../../config/constants.json";

import i18n from './../../i18n';

// components
import FormElements from "./../../components/Login/FormElements";

function Login(props) {
  const classes = useStyles();

  // global
  const userDispatch = useUserDispatch();
  const listDispatch = useListDispatch();
  const {
    error,
    userLoading,
  } = useUserState();

  // local
  // const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("admin@4d.com.hk");
  const [password, setPassword] = useState("12345678");

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={`${endpoint}${logo}`} alt={name} className={classes.logotypeImage} />
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                {name}
              </Typography>
              <Typography variant="h2" className={classes.subGreeting}>
                {i18n.t('common.greeding')}
              </Typography>
              <Fade in={!!error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  {error}
                </Typography>
              </Fade>
              {
                userLoading ? <div className={classes.loginLoaderContainer}>
                  <Typography color="secondary" className={classes.loginLoaderMessage}>
                    {i18n.t('login.processing')}
                  </Typography>
                  <CircularProgress color="secondary" size={26} className={classes.loginLoader} />
                </div> : <React.Fragment>
                  <FormElements userLoading={userLoading} email={email} password={password} setPassword={setPassword} setEmail={setEmail} />
                    <div className={classes.formButtons}>
                      <Fade in={!!email.length && !!password.length}>
                        <Button
                          onClick={() =>
                            loginUser(
                              userDispatch,
                              listDispatch,
                              email,
                              password,
                              props.history,
                            )
                          }
                          variant="contained"
                          className={classes.loginButton}
                          size="large"
                          fullWidth
                        >
                          {i18n.t('login.label')}
                        </Button>
                      </Fade>
                    </div>
                </React.Fragment>
              }
            </React.Fragment>
        </div>
        <Typography color="textSecondary" className={classes.copyright}>
          © {copyright} {company} {i18n.t('footer.copyright')}
        </Typography>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
