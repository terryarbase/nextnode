import React from "react";

import {
  DialogContentText,
} from '@material-ui/core';

// components
import MessageBox from './../Shared/MessageBox';

// hooks
import {
  useErrorDidChange,
  // useToggle,
} from './../../hook/list';

// locales
import i18n from '../../i18n';

// context
// import {
//   useListState,
// } from '../../store/list/context';

const ListMessage = props => {

  const [show, error, closeError] = useErrorDidChange();
  return (
    <MessageBox
      {...props}
      isOpen={show}
      title={i18n.t('list.deleteAskTitle')}
      onCancel={closeError}
      actionSheet={{
        confirm: false,
      }}
    >
    <DialogContentText>
      {error}
    </DialogContentText>
   </MessageBox>
  );
}


export default ListMessage;
