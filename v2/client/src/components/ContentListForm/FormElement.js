import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Grid,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
  listPrefix,
  apiVersionV2,
} from './../../config/constants.json';

// utils
import {
  translateListField,
  translateListHeading,
  translateListNote,
} from './../../utils/multilingual';
import {
  requestHeader,
} from './../../utils/request';

// styles
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from './styles';

// context
import {
  useUserState,
} from '../../store/user/context';

const FieldComponent = props => {
  // return (

  // );
}

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
    // currentTarget,
    mode,
    requestHeader,
  } = options;

  const url = `${endpoint}${apiVersionV2}`;
  return {
    ...field,
    value: currentList.getFieldValue({
      field,
      values,
      currentLang,
    }),
    requestHeader,
    restrictDelegated: field.restrictDelegated,
    values,
    currentLang,
    label: translateListField(key, path) || '',
    note: !!note ? translateListNote(key, path) : '',
    adminPath: main,
    listPath: listPrefix,
    uploadPath: `${url}session`,
    // key: path,
    url,
    cloudinary,
    uploadUrl: url,
    onChange,
    mode,
    isCore,
    // currentTarget,
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
  // const [currentTarget, onFocus] = useState(null);

  const statelessUIRef = useRef({});
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
  // // helper checker
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


  // const handleChange = target => {
  //   onFocus(target.path);
  //   // callback the regular onChange event
  //   onChange(target);
  // }


  let elements = [];
  // callee specifies the field to be shown
  if (requiredFields.length) {
    elements = _.filter(uiElements, ({ field }) => _.indexOf(requiredFields, field) !== -1);
  } else {
    elements = [ ...uiElements ];
  }

  const defaultSectionName = '__default__';
  // create a corresponding field element
  let prevHeader = defaultSectionName;
  // basic props
  const elementProps = {
    // currentTarget,
    requestHeader: requestHeader({ isAuth: true }),
    currentList,
    values: form,
    currentLang,
    mode,
    cloudinary: _.get(info, 'cloudinary'),
  };
  elements = elements.slice(0, 21);
  
  // create all of elements from uiElements
  elements = _.reduce(elements, (el, { field, type, content }, index) => {
    // if (
    //   nameField
    //   && field === nameField.path
    //   && nameFieldIsFormHeader
    // ) {
    //   return el;
    // // heading type
    // } else 
    if (type === 'heading') {
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
      let element = null;
      const {
        path,
        type,
        // cloneable,
      } = f;
      const key = `${prevHeader}-${path}`;
      const fieldProps = getFormFieldProps({
        ...elementProps,
        field: f,
        onChange,
      });
      const Component = Fields[type];
      if (typeof Component !== 'function') {
        // push to the current heading or default heading
        element = (
          <InvalidFieldType
            {
              ...{
                type,
                path,
                key,
              }
            }
          />
        )
      } else {
        element = (
          <Component { ...fieldProps } key={key} />
        ); 
        // if (!statelessUIRef.current[path]) {
        // // console.log(type, fieldProps);
        //   element = React.createElement(Fields[type], { ...fieldProps });
        // } else {
        //   element = React.cloneElement(
        //     statelessUIRef.current[path],
        //     {
        //       ...fieldProps,
        //     },
        //   );
        // }
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
      statelessUIRef.current = {
        ...statelessUIRef.current,
        [path]: element,
      };
    }

    return el;

  }, { [defaultSectionName]: [] });

  const sections = _.keys(elements);
  // only have _default_ as the elements section key
  const noSection = sections.length === 1;
  // initialize by all of element sections (key-of-array)
  const [expanded, setExpanded] = useState(sections);
  const onExpanded = panel => (event, newExpanded) => {
    // if only default section, no expanding feature is allowed
    if (!noSection) {
      let currentExpanded = [ ...expanded ];
      if (!newExpanded) {
        currentExpanded = _.filter(currentExpanded, c => c !== panel);
      } else {
        currentExpanded = [ ...currentExpanded, panel ];
      }
      setExpanded(currentExpanded);
    }
  };

  return (
    <Grid container
      direction="row"
      justify="space-between"
      alignItems="center" 
      spacing={3}
    >
      <Grid item xs={10}>
        {
          _.keys(elements).map(section => {
            const isExpanded = _.includes(expanded, section);
            // cut-off spacing
            const sectionName = _.camelCase(section);
            return (
              <div key={sectionName}>
                <ExpansionPanel
                  square
                  expanded={isExpanded}
                  onChange={onExpanded(section)}
                >
                  <ExpansionPanelSummary
                    expandIcon={!noSection && <ExpandMoreIcon />}
                    aria-controls={`panel1d-${sectionName}-content`}
                    id={`panel1d-${sectionName}-header`}
                  >
                    <Typography color="primary">
                      {
                        section === '__default__' ? i18n.t(`list.${section}`) : section
                      }
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid
                      container
                      direction="row"
                      justify="flex-start"
                    >
                      {elements[section]}
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
            );
          })
        }
      </Grid>
      <Grid item xs>
        
      </Grid>
    </Grid>
  );
};

FormElemental.propTypes = {
  currentList: PropTypes.object.isRequired,
  requiredFields: PropTypes.array,
  mode: PropTypes.string,
  form: PropTypes.object,
};

export default FormElemental;
