import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  reactLocalStorage,
} from 'reactjs-localstorage';
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
  storageName,
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
    calendarLang,
  } = options;

  const url = `${endpoint}${apiVersionV2}`;
  const value = currentList.getFieldValue({
    field,
    values,
    currentLang,
  });
  let fieldProps = {
    ...field,
    ...currentList.bindAttachment({ values, value }),
    currentList,
    value,
    requestHeader,
    restrictDelegated: field.restrictDelegated,
    values,
    currentLang,
    calendarLang,
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
  const filters = currentList.getRelatedFilter(field, field.filters, currentLang, values);
  if (filters) {
    fieldProps = {
      ...fieldProps,
      filters,
    };
  }

  return fieldProps;
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
  const {
    info={},
  } = useUserState();
  const currentLang = i18n.locale;

  let {
    // Required Fields
    elements=[],
    fields,
  } = props;
  const {
    currentList,
    inline,
    currentList: {
      fields: listFields,
    },
    onChange,
    mode='edit',
    form,
  } = props;

  if (!inline) {
    fields = listFields;
  } else {
    elements = _.values(fields);
  }

  const defaultSectionName = '__default__';
  // create a corresponding field element
  let prevHeader = defaultSectionName;
  // basic props
  const elementProps = {
    // currentTarget,
    calendarLang: reactLocalStorage.get(storageName.calendarLang),
    requestHeader: requestHeader({ isAuth: true }),
    currentList,
    // lists: listsByPath,
    values: form,
    currentLang,
    mode,
    cloudinary: _.get(info, 'nextnode.cloudinary'),
  };

  // console.log(elements, fields);
  // create all of elements from uiElements
  const fieldDoms = _.reduce(elements, (accum, element, index) => {
    const { field, type, content } = element;
    if (type === 'heading') {
      prevHeader = content;
      const heading = React.createElement(FormHeading, getFormHeadingProps({
        ...elementProps,
        content,
        index,
      }));
      // push to the sub section for the heading
      accum[prevHeader] = [ heading ];
    // field type 
    } else {
      const f = fields[field] || element;
      const {
        path,
        type: fieldType,
      } = f;
      const key = `${prevHeader}-${path}`;
      const Component = Fields[fieldType];
      let ele = null;
      if (typeof Component !== 'function') {
        // push to the current heading or default heading
        ele = (
          <InvalidFieldType
            {
              ...{
                type: fieldType,
                path,
                key,
              }
            }
          />
        )
      } else {
        const fieldProps = getFormFieldProps({
          ...elementProps,
          field: f,
          onChange,
        });
        ele = (<Component { ...fieldProps } key={key} />);
      }
      accum = {
        ...accum,
        [prevHeader]: [
          ...accum[prevHeader],
          ele,
        ],
      };
    }

    return accum;

  }, { [defaultSectionName]: [] });

  const sections = _.keys(fieldDoms);
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

  const containerProps = {
    container: true,
    direction: "row",
    justify: "space-between",
    alignItems: "center",
    spacing: 3,
  };

  if (inline) {
      return (
        <Grid {...containerProps} item xs={12}>
          {
            _.keys(fieldDoms).map(section => (
              <div style={{ width: '100%' }} key={_.camelCase(section)}>
                {fieldDoms[section]}
              </div>
            ))
          }
        </Grid>
      );
    }

  return (
    <Grid {...containerProps}>
      <Grid item xs={10}>
        {
          _.keys(fieldDoms).map(section => {
            // cut-off spacing
            const sectionName = _.camelCase(section);
            const isExpanded = _.includes(expanded, section);
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
                      {fieldDoms[section]}
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
  elements: PropTypes.array,
  mode: PropTypes.string,
  form: PropTypes.object,
};

export default FormElemental;
