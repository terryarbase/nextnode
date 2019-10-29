import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// lcoales
import i18n from './../../i18n';

// FieldTypes
import Fields from './../FormField/types/fields';

// components
import InvalidFieldType from './../FormField/shared/InvalidFieldType';
import FormHeading from './../FormField/shared/FormHeading';

// configs
import {
  main,
  endpoint,
  apiVersionV2,
} from './../../config/constants.json';

// utils
import {
  translateListField,
  translateListHeading,
  translateListNote,
} from './../../utils/multilingual';

// context
import {
  useUserState,
} from '../../store/user/context'

const getFormFieldProps = options => {
  const {
    currentList: {
      isCore,
      key,
    },
    field,
    field: {
      path,
      note,
    },
    currentLang,
    currentList,
    cloudinary,
    onChange,
    values,
    mode,
  } = options;

  const url = `${endpoint}${apiVersionV2}`;

  return {
    value: currentList.getFieldValue({
      field,
      values,
    }),
    restrictDelegated: field.restrictDelegated,
    values,
    currentLang,
    label: translateListField(key, path),
    note: !!note && translateListNote(key, path),
    adminPath: main,
    key: `${path}-${currentLang}`,
    url,
    cloudinary,
    uploadUrl: url,
    onChange,
    mode,
    isCore,
    listKey: key,
  };
}

const getFormHeadingProps = ({
  values,
  index,
  content,
  currentList: {
    key,
  },
}) => {
  return {
    options: {
      values,
    },
    key: `h-${index}`,
    content: translateListHeading(key, content),
  };
}

const FormElemental = props => {
  // state
  // const [statelessUI, setStatelessUI] = useState({});
  // const statelessUIRef = useRef();
  const {
    info={},
  } = useUserState();
  const currentLang = i18n.locale;

  // const updateStateLessUI = (el, path) => {
  //   const newStateLessUI = { ...statelessUI };
  //   newStateLessUI = {
  //     ...newStateLessUI,
  //     [path]: {
  //       ...newStateLessUI[path],
  //       [currentLang]: el,
  //     }
  //   };
  //   // update the stateless ui
  //   setStatelessUI(newStateLessUI);
  // }
  // helper checker
  // const isStateless = ({
  //   stateless,
  //   cloneable,
  //   multilingual,
  // }) => (stateless || cloneable) && multilingual;

  // const isMultilingalStateLess = ({
  //   path
  // }) => _.get(statelessUI, `${path}.${currentLang}`);
  const {
    requiredFields=[],
    currentList: {
      fields,
      uiElements,
      nameField,
      nameFieldIsFormHeader,
    },
    currentList,
    onChange,
    mode='edit',
    form,
  } = props;

  let elements = [];
  // callee specifies the field to be shown
  if (requiredFields.length) {
    elements = _.filter(uiElements, ({ field }) => _.indexOf(fields, field) !== -1);
  } else {
    elements = [ ...uiElements ];
  }

  // create a corresponding field element
  let prevHeader = '__default';
  // basic props
  const elementProps = {
    currentList,
    values: form,
    currentLang,
    mode,
    cloudinary: _.get(info, 'cloudinary'),
  };
  // create all of elements from uiElements
  elements = _.reduce(elements, (el, { field, type, content }, index) => {
    if (
      nameField
      && field === nameField.path
      && nameFieldIsFormHeader
    ) {
      return el;
    // heading type
    } else if (type === 'heading') {
      prevHeader = content;
      const heading = React.createElement(FormHeading, getFormHeadingProps({
        ...elementProps,
        content,
        index,
      }));
      // push to the sub section for the heading
      el[prevHeader] = [ heading ];
    // field type 
    } else if (type === 'field') {
      const f = fields[field];
      const fieldProps = this.getFormFieldProps({
        ...elementProps,
        field: f,
        onChange,
      });

      let element = null;
      const {
        path,
        type,
        cloneable,
      } = f;
      if (typeof type !== 'function') {
        // push to the current heading or default heading
        element = React.createElement(InvalidFieldType, {
          type,
          path,
          key: path,
        });
      } else {
        element = React.createElement(f, fieldProps);
        // if (isStateless(f) && isMultilingalStateLess(f)) {
        //   const {
        //     cloneable,
        //     path,
        //   } = f;
        //   const current = _.get(statelessUI, `${path}.${currentLang}`);
        //   if (current) {
        //     // clone the target stateless element
        //     if (cloneable) {
        //       element = React.cloneElement(
        //         current,
        //         fieldProps,
        //       );
        //     } else {
        //       // use the current stateless ui element
        //       element = current || element;
        //     }
        //   }

        //   updateStateLessUI();

        // }
      }
      el = {
        ...el,
        [prevHeader]: [
          ...el[prevHeader],
          element,
        ],
      };
    }

    return el;

  }, { __default: [] });

  return elements;
};

FormElemental.propTypes = {
  currentList: PropTypes.object.isRequired,
  requiredFields: PropTypes.array,
  mode: PropTypes.string,
  form: PropTypes.object,
};

export default {
  FormElemental,
  getFormFieldProps,
  getFormHeadingProps,
};
