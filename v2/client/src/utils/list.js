import _ from 'lodash';
import listToArray from 'list-to-array';
import qs from 'query-string';

class List {
  constructor(list) {
    _.assign(this, list);
    this.options = list;

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

    if (filters) {

      // push to object and decode it
      try {
        let filtersQuery = JSON.parse(decodeURIComponent(filters));
        filtersQuery = _.isArray(filtersQuery) ? filtersQuery : [ filtersQuery ];
        console.log();
        newParams = {
          ...newParams,
          filters: _.reduce(filtersQuery, (v, filter) => {
            const f = _.find(this.columns, c => c.path === filter.path);
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
          }, []),
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
    return _.map(filterArray, filter => ({
      ..._.omit(filter, ['field']),
    }));
  };

  addFilter(filter) {
    const {
      filters,
    } = this;
    this.filters = _.unionBy([filter], filters, 'path');
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