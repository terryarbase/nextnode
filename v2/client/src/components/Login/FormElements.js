import React, { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import {
  Visibility,
  VisibilityOff,
  Email,
} from '@material-ui/icons';

import i18n from './../../i18n';

// styles
import useStyles from "./styles";

function LoginFormElements({
  setEmail,
  setPassword,
  email,
  password,
  userLoading,
}) {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = e => e.preventDefault();

  return (
    <>
      <TextField
        id="email"
        variant="filled"
        type="text"
        label={i18n.t('login.email')}
        autoComplete="email"
        value={email}
        readOnly={userLoading}
        name="email"
        onChange={e => setEmail(e.target.value)}
        fullWidth
        className={classes.textField}
        InputLabelProps={{
          classes: {
            root: classes.label,
          },
        }}
        InputProps={{          
          endAdornment: (
            <InputAdornment position="end">
              <Email className={classes.endIcon} />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        id="password"
        variant="filled"
        email="password"
        readOnly={userLoading}
        type={showPassword ? 'text' : 'password'}
        label={i18n.t('login.password')}
        value={password}
        autoComplete="password"
        className={classes.textField}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        InputLabelProps={{
          classes: {
            root: classes.label,
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                aria-label={i18n.t('login.toggle')}
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {
                  showPassword ? 
                  <VisibilityOff className={classes.endIcon} /> : 
                  <Visibility className={classes.endIcon} />
                }
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
}

export default LoginFormElements;
