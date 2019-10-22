import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  DialogContent,
  // ListItemIcon,
  DialogActions,
  Dialog,
  Button,
  Checkbox,
  // ListSubheader,
  ListItemSecondaryAction,
} from '@material-ui/core';

import {
  // Check as CheckIcon,
} from '@material-ui/icons';

// styles
import useStyles from "./styles";

// locales
import i18n from "./../../../../i18n";

// utils
import {
  // translateListHeading,
  translateListField,
} from "./../../../../utils/multilingual";

const ColumnSelectionItem = props => {
  const {
    item: {
      type,
    },
    item,
    onChange,
    listName,
    updateFieldRef,
    checked,
  } = props;

  // if (type === 'heading') {
  //   return (
  //     <ListSubheader>
  //       {
  //         translateListHeading(listName, item.content)
  //       }
  //     </ListSubheader>
  //   );
  // } else 
  if (type === 'field') {
    const ref = item[updateFieldRef];
    return (
      <ListItem button divider selected={checked} dense>
        <ListItemText 
          id={ref}
          primary={translateListField(listName, ref, item.title)}
        />
        <ListItemSecondaryAction>
          <Checkbox
            edge="end"
            onChange={e => onChange(e, ref)}
            checked={checked}
            inputProps={{ 'aria-labelledby': ref }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  return null;
}

const ColumnSelection = props => {
  const [values, setValues] = useState(props.items);
  const classes = useStyles();
  const {
    tableLabel='',
    listName,
    open,
    onClose,
    items,
    options,
    updateFieldRef,
  } = props;

  useMemo(() => {
    setValues(items);
  }, [ items ]);

  // update when click the options 
  const updateItems = ({ target: { checked } }, id) => {
    const oldValues = [ ...values ];
    let newValues = [ ...oldValues ];
    // remove the selection anyway
    _.remove(newValues, v => v[updateFieldRef] === id);
    if (checked) {
      // find the target item to be shown from the options list
      const newItem = _.find(options, o => o[updateFieldRef] === id);
      if (newItem) {
        newValues = [
          ...newValues,
          newItem,
        ];
      }
    }

    // agianst no field selected, clone the previous selection
    if (!newValues.length) {
      newValues = [ ...oldValues ];
    }
    setValues(newValues);
  }

  const handleCancel = () => {
    setValues(items);
    onClose();
  };

  const handleOk = () => {
    onClose(values);
  };

  const displayLang = i18n.t('filter.column');

  const displayingColumns = _.filter(options, o => o.type === 'field');
  return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        aria-labelledby="confirmation-dialog-title"
        open={open}
      >
        <DialogTitle id="confirmation-dialog-title">
          {tableLabel} - {displayLang} ({values.length})
        </DialogTitle>
        <DialogContent dividers>
          <List component="nav" aria-label={displayLang}>
            {
              displayingColumns.map((o, i) => {
                const checked = !!_.find(values, s =>s[updateFieldRef] === o[updateFieldRef]);
                return (
                  <ColumnSelectionItem
                    item={o}
                    key={i}
                    listName={listName}
                    onChange={updateItems}
                    checked={checked}
                    updateFieldRef={updateFieldRef}
                  />
                );
              })
            }
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            {i18n.t('filter.cancel')}
          </Button>
          <Button onClick={handleOk} color="primary" className={classes.submitBtn}>
            {i18n.t('filter.apply')}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

ColumnSelection.propTypes = {
  updateFieldRef: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  tableLabel: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  listName: PropTypes.string.isRequired,
};

export default ColumnSelection;
