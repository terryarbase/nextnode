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
  Fab,
  // Grid,
} from '@material-ui/core';
import {
  Close as CloseIcon,
  Add as AddIcon,
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

// components
import LanguageSelection from './../../components/Shared/LanguageSelection';
import LanguageTab from './../../components/Shared/LanguageTab';
// context
// import {
//   useUserState,
// } from "./../../store/user/context";
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
  const [
    formValues,
    whenChanged,
    submitForm,
    currentLang,
    whenLanguageChanged,
  ] = useSubmitForm(props.currentList);
  // const formRef = createRef();
  const {
    open,
    handleClose,
    title,
    currentList: {
      initialFields,
      uiElements,
      multilingual,
    },
 
  } = props;
  // global
  // let {
  //   language,
  // } = useUserState();

  const classes = useRootStyle();

  const elements = _.filter(uiElements, ({ field }) => _.indexOf(initialFields, field) !== -1);

  const createText = i18n.t('list.create');
  return (
    <Dialog
      disableEscapeKeyDown
      disableBackdropClick
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
          <Fab
            variant="extended"
            color="secondary"
            onClick={submitForm}
            aria-label={createText}
          >
            <AddIcon />
            {createText}
          </Fab>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.contentContainer}>
        <form>
          {
            !!multilingual && <LanguageTab
              title={i18n.t('common.changeContentLanguageLabel')}
              language={currentLang}
              onChangeLanguage={whenLanguageChanged}
            />
          }
          <FormElemental
            {...props}
            mode='create'
            onChange={whenChanged}
            form={formValues}
            language={currentLang}
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
