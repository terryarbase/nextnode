import React, { forwardRef } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
// import {
//   reactLocalStorage,
// } from 'reactjs-localstorage';

import {
  Dialog,
  AppBar,
  IconButton,
  Slide,
  Typography,
  Toolbar,
  DialogContent,
  Button,
  // Grid,
} from '@material-ui/core';
import {
  Close as CloseIcon,
} from '@material-ui/icons';

// styles
import {
  // ExpansionPanel,
  // ExpansionPanelDetails,
  // ExpansionPanelSummary,
  useRootStyle,
} from './styles';

// hook
import {
  // useFormValues, 
  useSubmitForm,
} from './../../hook/list';

// configs
// import {
//   storageName,
// } from './../../config/constants.json';

// locales
import i18n from './../../i18n';

// components
import FormElemental from './FormElement';

const Transition = forwardRef(function(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateForm = props => {
  // state
  const [formValues, whenChanged, submitForm] = useSubmitForm(props.currentList);
  const {
    open,
    handleClose,
    title,
    currentList: {
      initialFields,
      uiElements,
    },
  } = props;
  const classes = useRootStyle();

  const elements = _.filter(uiElements, ({ field }) => _.indexOf(initialFields, field) !== -1);

  return (
    <Dialog
      fullScreen open={open}
      className={classes.root}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {i18n.t('list.createANew', { listName: title })}
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            {i18n.t('list.create')}
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.contentContainer}>
        <form onSubmit={submitForm}>
          <FormElemental
            {...props}
            mode='create'
            onChange={whenChanged}
            form={formValues}
            elements={elements}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

CreateForm.propTypes = {
  currentList: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default CreateForm;
