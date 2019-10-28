import React from 'react';
// , { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from '@material-ui/core';

import {
  useTheme,
} from '@material-ui/core/styles';

// locale
import i18n from '../../../i18n';

// hooks
// import {
//   useToggle,
// } from '../../../hook/list';
// const MessageContext = React.createContext();

const MessageBox = props => {
  const {
    actionSheet={},
    children,
    onCancel,
    isOpen,
    onOK,
    title,
  } = props;
  const actions = {
    cancel: true,
    confirm: true,
    ...actionSheet,
  };
  // const [open, setOpen] = useToggle(isOpen);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    cancel,
    confirm,
  } = actions;

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    if (onOK) {
      onOK();
    }
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      {
        (cancel || confirm) && <DialogActions>
          {
            cancel && <Button onClick={handleClose} color="primary">
              {i18n.t('list.cancel') || 'Cancel'}
            </Button> 
          }
          {
            confirm && <Button onClick={handleConfirm} color="primary" variant="contained">
              {i18n.t('list.confirm') || 'Confirm'}
            </Button> 
          }
        </DialogActions>
      }
    </Dialog>
  );
}

MessageBox.propTypes = {
  actionSheet: PropTypes.object,
  onOK: PropTypes.func,
  onCancel: PropTypes.func,
};

export default MessageBox;
