import _ from 'lodash';
import listToArray from 'list-to-array';
import qs from 'query-string';
import moment from 'moment';

// FieldTypes
import Fields from '../components/FormField/types/fields';

class List {
  constructor(list) {
    _.assign(this, list);
    this.options = list;

    this.isLocale = !!list.multilingual;

    // reset to the initial use
    this.defaultCriteria = {
      page: 0,
      limit: 10,
      // sort: this.expandSort(),
      search: '',
      filters: [],
      // expandedDefaultColumns,
      // defaultColumnPaths: _.map(this.expandedDefaultColumns, ({ path }) => path).join(','),
    };
    this.resetQueryField();
    // console.log(this);
  }

  /*
  ** Format the filters option for the field with self colun mapping for the self value
  ** e.g. :_id
  ** Terry Chan
  ** 11/06/2019
  */
  getRelatedFilter (field, initFilters={}, currentLang, values) {
    // let mapping = null;
    if (field.filters) {
      let { filters={} } = field;
      filters = {
        ...filters,
        ...initFilters,
      };
      let targetField = null;
      return _.chain(filters).reduce((accum, value, field) => {
        // while the filter value is mapping field being with colun
        if (/^:/i.test(value)) {
          targetField = value.replace(/^:/, '');
          return {
            ...accum,
            [field]: this.getFieldValue({
              field: this.fields[targetField],
              isLocale: this.isLocale,
              currentLang,
              values,
            }),
          };
        }
        return accum;
      }, filters).value();
    }
    return null;
  }
  /*
  ** Shared function for obtaining the value from changing or current values of state
  ** Support Multlingual
  ** Terry Chan
  ** 12/11/2018
  */
  getFieldValue ({ field, values, isLocale, currentLang }) {
    // console.log(field.path, values);
    let current = _.get(values, `${field.path}`);
    const shouldMultilingual = this.isLocale && _.get(field, 'multilingual');
    // prevent set multilingual from true to false
    if (shouldMultilingual) {
      if (typeof current !== 'string') {
        current = _.get(current, currentLang);
      } else if (current){
        current = {
          [currentLang]: current,
        };
      }
    }
    return current;
  };

  /*
  ** Grab the value once the value is being changed
  ** Terry Chan
  ** 29/10/2019
  */
  // special for handling attachment upload
  bindAttachment({ values, value }) {
    // console.log(value, attachment);
    if (typeof value === 'string') {
      const blobs = (value || '').split('upload:');
      // split upload:File-filetype-1001 into File-filetype-1001
      if (blobs.length >= 2) {
        // console.log(blobs, values);
        const blobFieldName = blobs[1];
        return {
          userSelectedFile: _.get(values, blobFieldName),
        }
      }
    }

    return {};
  }
  // unbind the attachment blob from current values
  rebindAttachment({ values, attachment }) {
    if (attachment) {
      _.forOwn(attachment, (blob, blobField) => {
        if (!blob) {
          _.unset(values, blobField);
        } else {
          _.set(values, blobField, blob);
        }
      });
    }
    return values;
  }
  getProperlyChangedValue ({ currentValue, path, value, currentLang, attachment={} }) {
    const fields = this.fields;
    let values = { ...currentValue };
    const shouldMultilingual = this.isLocale && _.get(fields, `${path}.multilingual`);
    // const attachmentBind = this.bindAttachment({ currentValue, value, attachment });
    if (shouldMultilingual) {
      values = {
        ...values,
        [path]: {
          ...values[path],
          [currentLang]: value, 
        },
      };
    } else {
      values = {
        ...values,
        [path]: value,
      };
    }
    return this.rebindAttachment({ attachment, values });
  };

  /*
  ** Get the default value for the list initialization (e.g. create form)
  ** Terry Chan
  ** 29/10/2019
  */
  getDefaultValue({ currentLang }) {
    let currentValue = {};
    _.forEach(this.fields, f => {
      const { type, path } = f;
      const FieldComponent = Fields[type];
      if (FieldComponent) {
        const value = FieldComponent.getDefaultValue(f);
        // use self member to grab the value to corresponding field and value
        currentValue = this.getProperlyChangedValue({
          currentValue,
          value,
          path,
          currentLang,
        });
      }
    });

    return currentValue;
  } 

  /*
  ** turn any missing multilingual format value to form data
  ** Terry Chan
  ** 12/11/2018
  */
  setFormData(field, formData, key, value) {
    const type = _.get(field, 'type');
    switch (type) {
      case 'datetime': 
        const {
          paths,
          dateFormat,
          timeFormat,
        } = field;
        const date = moment(value);
        formData.set(paths.date, date.format(dateFormat));
        formData.set(paths.time, date.format(timeFormat));
        break;
      // case 'name':
      //   const {
      //     paths,
      //   } = field;
      //   formData.set(paths.first, value.first);
      //   formData.set(paths.)
      //   formData.delete(key);
      //   break;
      default:
        formData.set(key, value);
    }
  }
  getFormData(formData, values) {
    const fields = this.fields;
    try {
      _.forOwn(values, (value, key) => {
        const shouldMultilingual = this.isLocale && _.get(fields, `${key}.multilingual`);
        const field = fields[key];
        const keys = _.keys(value);
        if (shouldMultilingual) {
          if (typeof value === 'object') {
            if (_.get(value, 'constructor') === File) {
              this.setFormData(field, formData, key, value);
            } else if (keys) {
              this.setFormData(field, formData, key, JSON.stringify(value));
            }
          }
        } else if (_.isArray(value)) {
          formData.delete(key);
          this.setFormData(field, formData, key, JSON.stringify(value));
        } else if (typeof value === 'object') {
          if (_.get(value, 'constructor') === File) {
            this.setFormData(field, formData, key, value);
          } else if (keys.length) {
            // delete orginal formdata attr
            formData.delete(key);

            // use object declarion instead
            _.forEach(keys, k => this.setFormData(field, formData, `${key}.${k}`, value[k]));
          }
        } else {
          this.setFormData(field, formData, key, value);
        }
      });
    } catch (err) {
      console.log('Error to parse formdata: ', err);
    }
  }

  /*
  ** Reset all of query related fields for this List
  ** Terry Chan
  ** 20/10/2019
  */
  resetQueryField() {
    this.columns = this.getColumns();
    this.sort = this.expandSort();
    this.expandedDefaultColumns = this.expandColumns(this.defaultColumns);
    this.defaultColumnPaths = _.map(this.expandedDefaultColumns, ({ path }) => path).join(',');
    _.assign(this, this.defaultCriteria);
  }

  /*
  ** Update the target search parameters among keyword, filtering, sorting, and page, as well as col
  ** Terry Chan
  ** 21/10/2019
  */
  updateQueryField(params) {
    const {
      columns,
      sort,
      search,
      filters,
      page,
      limit,
    } = params;
    // prevent encoded symbol
    let sortQuery = sort && decodeURIComponent(sort);
    let columnsQuery = columns && decodeURIComponent(columns);
    const expandedDefaultColumns = this.expandColumns(columnsQuery || this.defaultColumns);
    // is not given, then use the default value
    let newParams = {
      expandedDefaultColumns,
      defaultColumnPaths: _.map(this.expandedDefaultColumns, ({ path }) => path).join(','),
      sort: this.expandSort(sortQuery || this.defaultSort),
      filters: this.defaultCriteria.filters,
      page: !isNaN(page) ? +page : this.defaultCriteria.page,
      limit: !isNaN(limit) ? +limit : this.defaultCriteria.limit,
      search: search || this.defaultCriteria.search,
    };
    // console.log(this.defaultCriteria.filters);
    if (filters && filters.length) {
      // push to object and decode it
      try {
        let filtersQuery = JSON.parse(decodeURIComponent(filters));
        filtersQuery = _.isArray(filtersQuery) ? filtersQuery : [ filtersQuery ];
        newParams = {
          ...newParams,
          filters: _.chain(filtersQuery).reduce((v, filter) => {
            const f = _.find(this.columns, c => c.path === filter.path);
            // console.log(f);
            if (f) {
              v = [
                ...v,
                {
                  ...filter,
                  field: f.field,
                },
              ];
            }
            return v;
          }, []).uniqBy('path').value(),
        };
      } catch (err) {
        // TODO: dont push to the curretn filters
      }
    }
    _.assign(this, newParams);
  }

  /**
   * Get the sorting string for the URI
   *
   * @param  {Array} sort.paths The paths we want to sort
   *
   * @return {String}           All the sorting queries we want as a string
   */
  getSortString (sort) {
    // If we want to sort inverted, we prefix a "-" before the sort path
    return _.map(sort.paths, i => i.invert ? '-' + i.path : i.path).join(',');
  };

  /**
   * Make an array of filters an object keyed by the filtering path
   *
   * @param  {Array} filterArray The array of filters
   *
   * @return {Object}            The corrected filters, keyed by path
   */
  getFilters (filterArray) {
    // console.log(filterArray);
    return _.chain(filterArray).uniqBy('path').reduce((v, filter) => ({
      ...v,
      [filter.path]: _.omit(filter, ['field', 'path']),
    }), {}).value();
  };

  addFilter(filter) {
    const {
      filters,
    } = this;
    this.filters = _.unionBy([filter], filters, 'path');
  }

  removeFilter(filter) {
    const path = _.get(filter, 'field.path') || _.get(filter, 'path');
    _.remove(this.filters, f => f.path === path);
  }

  updateFilter(filter) {
    const {
      filters,
    } = this;
    const path = _.get(filter, 'field.path') || _.get(filter, 'path');
    let target = _.findIndex(filters, f => f.path === path);
    if (target !== -1) {
      this.filters[target] = {
        ...this.filters[target],
        ...filter,
      };
    }
  }

  /**
   * Get the columns of a list, structured by fields and headings
   *
   * @param  {Object} list The list we want the columns of
   *
   * @return {Array}       The columns
   */
  getColumns () {
    const self = this;
    return _.map(this.uiElements, col => {
      if (col.type === 'heading') {
        return { type: 'heading', content: col.content };
      } else {
        var field = self.fields[col.field];
        return field ? { type: 'field', field: field, title: field.label, path: field.path } : null;
      }
    });
  }

  expandColumns (input) {
    let nameIncluded = false;
    const inputs = listToArray(input);
    const cols = _.reduce(inputs, (c, i) => {
      const split = i.split('|');
      let path = split[0];
      let width = split[1];
      if (path === '__name__') {
        path = this.namePath;
      }
      // console.log(path, this.namePath);
      const field = this.fields[path];
      if (path === this.namePath) {
        nameIncluded = true;
      }
      if (!field) {
        // TODO: Support arbitary document paths
        if (!this.hidden) {
          if (path === this.namePath) {
            window.console.warn(`List ${this.key} did not specify any default columns or a name field`);
          } else {
            window.console.warn(`List ${this.key} specified an invalid default column: ${path}`);
          }
        }
      } else {
        c = [
          ...c,
          {
            field,
            ..._.pick(field, [
              'label',
              'path',
              'type',
            ]),
            width,
          },
        ];
      }
      
      return c;
    }, []);

    if (!nameIncluded) {
      cols.unshift({
        type: 'id',
        label: 'ID',
        path: 'id',
      });
    }
    return cols;
  };

  expandSort (input) {
    const sort = {
      rawInput: input || this.defaultSort,
      isDefaultSort: false,
    };
    sort.input = sort.rawInput;
    if (sort.input === '__default__') {
      sort.isDefaultSort = true;
      sort.input = this.sortable ? 'sortOrder' : this.namePath;
    }
    const inputs = listToArray(sort.input);
    sort.paths = _.reduce(inputs, (c, path) => {
      let invert = false;
      if (path.charAt(0) === '-') {
        invert = true;
        path = path.substr(1);
      }
      else if (path.charAt(0) === '+') {
        path = path.substr(1);
      }
      const field = this.fields[path];
      if (!field) {
        // TODO: Support arbitary document paths
        window.console.warn('Invalid Sort specified:', path);
      } else {
        c = [
          ...c,
          {
            field,
            invert,
            ..._.pick(field, [
              'label',
              'path',
            ]),
          },
        ];
      }
      return c;
    }, []);

    return sort;
  };

  buildQueryString (needTs) {
    const query = {};
    const {
      search,
      filters=[],
      expandedDefaultColumns,
      page,
      limit,
      sort,
    } = this;
    if (search) {
      _.set(query, 'search', search);
    }
    if (filters.length) {
      _.set(query, 'filters', JSON.stringify(this.getFilters(filters)));
    }
    if (expandedDefaultColumns) {
      _.set(query, 'fields', _.map(expandedDefaultColumns, ({ path }) => path)
                              .filter(i => i)
                              .join(','));
    }

    if (limit) {
      _.set(query, 'limit', limit);
    }
    if (page) {
      _.set(query, 'skip', (page * limit));
    }
    if (sort) {
      _.set(query, 'sort', this.getSortString(sort));
    }
    _.set(query, 'expandRelationshipFields', true);
    if (needTs) {
      _.set(query, 'ts', new Date().getTime());
    }

    return '?' + qs.stringify(query);
  };
}

export default List;
