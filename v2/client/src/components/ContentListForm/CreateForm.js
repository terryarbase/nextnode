import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  AppBar,
  IconButton,
  Slide,
  Typography,
  Toolbar,
  Button,
} from '@material-ui/core';
import {
  Close as CloseIcon,
} from '@material-ui/icons';

// styles
import useStyles from './styles';

// locales
import i18n from './../../i18n';

// components
import FormElemental from './FormElement';

const Transition = forwardRef((props, ref) => (<Slide direction="up" ref={ref} {...props} />));

const CreateForm = props => {
  const {
    open,
    handleClose,
    title,
  } = props;
  const classes = useStyles();

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            {i18n.t('list.create')}
          </Button>
        </Toolbar>
      </AppBar>
    </Dialog>
  );
}

CreateForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default CreateForm;
