var _ = require('lodash');
var utils = require('keystone-utils');
const locales = require('./../locales').toJS();

module.exports = function (keystone) {
	/*
	** [REMOVED]
	** no big deal for hardcodeing on these supporting languages
	** languages supportings are deciding during your application initializtion
	** add it manually if the supporting language specified in /locales/
	** major used to check for the multilingual format only
	** Terry Chan
	** 18/11/2018
	*/
	// const multilingualSupporting = [
	// 	'en',
	// 	'zhtw',
	// 	'zhcn',
	// ];
	function List (key, options) {
		if (keystone.isReservedCollection(key, options)) {
			throw new Error(`The list name (${key}) is already reserved. Please change another one name.`);
		}
		if (!(this instanceof List)) return new List(key, options);
		this.keystone = keystone;

		var defaultOptions = {
			schema: {
				collection: keystone.prefixModel(key),
			},
			/*
			** @Terry Chan 11/12/2018
			** for every kind of view
			*/
			nolist: false,

			isCore: false,
			
			noedit: false,
			nocreate: false,
			nodelete: false,
			autocreate: false,
			sortable: false,
			hidden: false,
			/*
			** @Terry Chan 04/08/2018
			** for list view only
			*/
			noimport: false,
			nodownload: false,
			nofilter: false,
			noscale: false,
			multilingual: false,
			/*
			** @Terry Chan 05/05/2019
			** need to filter the record with system identity field
			*/
			identification: false,
			track: false,
			inherits: false,
			perPage: 100,
			calendarView: true,
			searchFields: '__name__',
			searchUsesTextIndex: false,
			defaultSort: '__default__',
			defaultColumns: '__name__',
		};

		// initialFields values are initialised on demand by the getter
		// var initialFields;

		// Inherit default options from parent list if it exists
		if (options && options.inherits) {
			if (options.inherits.options && options.inherits.options.inherits) {
				throw new Error('Inherited Lists may not contain any inheritance');
			}
			defaultOptions = utils.options(defaultOptions, options.inherits.options);
			if (options.inherits.options.track) {
				options.track = false;
			}
		}

		this.options = utils.options(defaultOptions, options);
		// init properties
		this.key = key;
		this.initialSupportLang = _.keys(locales);
		this.path = this.get('path') || utils.keyToPath(key, true);
		this.schema = new keystone.mongoose.Schema({}, this.options.schema);
		this.schemaFields = [];
		this.uiElements = [];
		this.underscoreMethods = {};
		this.fields = {};
		this.fieldsArray = [];
		this.fieldTypes = {};
		this.relationshipFields = [];
		this.relationships = {};
		this.mappings = {
			name: null,
			createdBy: null,
			createdOn: null,
			modifiedBy: null,
			modifiedOn: null,
		};

		var self = this;

		// init mappings
		_.forEach(this.options.map, function (val, key) { self.map(key, val); });

		// define property getters
		Object.defineProperty(this, 'label', { get: function () {
			return this.get('label') || this.set('label', utils.plural(utils.keyToLabel(key)));
		} });
		Object.defineProperty(this, 'singular', { get: function () {
			return this.get('singular') || this.set('singular', utils.singular(this.label));
		} });
		Object.defineProperty(this, 'plural', { get: function () {
			return this.get('plural') || this.set('plural', utils.plural(this.singular));
		} });
		Object.defineProperty(this, 'namePath', { get: function () {
			return this.mappings.name || '_id';
		} });
		Object.defineProperty(this, 'nameField', { get: function () {
			return this.fields[this.mappings.name];
		} });
		Object.defineProperty(this, 'nameIsVirtual', { get: function () {
			return this.model.schema.virtuals[this.mappings.name] ? true : false;
		} });
		Object.defineProperty(this, 'nameFieldIsFormHeader', { get: function () {
			return (this.fields[this.mappings.name] && this.fields[this.mappings.name].type === 'text') ? !this.fields[this.mappings.name].noedit : false;
		} });
		Object.defineProperty(this, 'nameIsInitial', { get: function () {
			return (this.fields[this.mappings.name] && this.fields[this.mappings.name].options.initial === undefined);
		} });
		Object.defineProperty(this, 'initialFields', { get: function () {
			const fieldBlacklist = keystone.reservedPermissionField();
			return _.filter(this.fields, (option, field) => !_.includes(fieldBlacklist, field));
			// return initialFields || (initialFields = _.filter(this.fields, function (i) { return i.initial; }));
		} });
		if (this.get('inherits')) {
			var parentFields = this.get('inherits').schemaFields;
			this.add.apply(this, parentFields);
		}
	}

	// TODO: Protect dynamic properties from being accessed until the List
	// has been registered (otherwise, incomplete schema could be cached)

	// Search Fields
	Object.defineProperty(List.prototype, 'searchFields', {
		get: function () {
			if (!this._searchFields) {
				this._searchFields = this.expandPaths(this.get('searchFields'));
			}
			return this._searchFields;
		}, set: function (value) {
			this.set('searchFields', value);
			delete this._searchFields;
		},
	});

	// Default Sort Field
	Object.defineProperty(List.prototype, 'defaultSort', {
		get: function () {
			var ds = this.get('defaultSort');
			return (ds === '__default__') ? (this.get('sortable') ? 'sortOrder' : this.namePath) : ds;
		}, set: function (value) {
			this.set('defaultSort', value);
		},
	});

	// Default Column Fields
	Object.defineProperty(List.prototype, 'defaultColumns', {
		get: function () {
			if (!this._defaultColumns) {
				this._defaultColumns = this.expandColumns(this.get('defaultColumns'));
			}
			return this._defaultColumns;
		}, set: function (value) {
			this.set('defaultColumns', value);
			delete this._defaultColumns;
		},
	});

	// Add prototype methods
	List.prototype.add = require('./list/add');
	List.prototype.convertJson = require('./list/convertJson');
	List.prototype.addFiltersToQuery = require('./list/addFiltersToQuery');
	List.prototype.addSearchToQuery = require('./list/addSearchToQuery');
	List.prototype.automap = require('./list/automap');
	List.prototype.apiForGet = require('./list/apiForGet');
	List.prototype.expandColumns = require('./list/expandColumns');
	List.prototype.expandPaths = require('./list/expandPaths');
	List.prototype.expandSort = require('./list/expandSort');
	List.prototype.field = require('./list/field');
	List.prototype.get = List.prototype.set = require('./list/set');
	List.prototype.getAdminURL = require('./list/getAdminURL');
	List.prototype.getCSVData = require('./list/getCSVData');
	List.prototype.getData = require('./list/getData');
	List.prototype.getBasicData = require('./list/getBasicData');
	List.prototype.getDocumentName = require('./list/getDocumentName');
	List.prototype.getOptions = require('./list/getOptions');
	List.prototype.getPages = require('./list/getPages');
	List.prototype.getSearchFilters = require('./list/getSearchFilters');
	List.prototype.getUniqueValue = require('./list/getUniqueValue');
	List.prototype.isReserved = require('./list/isReserved');
	List.prototype.isBlockingMultilingual = require('./list/isBlockingMultilingual');
	List.prototype.isMultilingual = require('./list/isMultilingual');
	List.prototype.map = require('./list/map');
	List.prototype.paginate = require('./list/paginate');
	List.prototype.processFilters = require('./list/processFilters');
	List.prototype.register = require('./list/register');
	List.prototype.relationship = require('./list/relationship');
	List.prototype.selectColumns = require('./list/selectColumns');
	List.prototype.updateItem = require('./list/updateItem');
	List.prototype.prepareCorrectParam = require('./list/prepareCorrectParam');
	// Aysnc update items
	List.prototype.updateItems = require('./list/updateItem/async');
	List.prototype.underscoreMethod = require('./list/underscoreMethod');
	List.prototype.buildSearchTextIndex = require('./list/buildSearchTextIndex');
	List.prototype.declaresTextIndex = require('./list/declaresTextIndex');
	List.prototype.ensureTextIndex = require('./list/ensureTextIndex');

	List.prototype.isMultilingualFormat = require('./list/isMultilingualFormat'); 
	List.prototype.isSystemIdentity = require('./list/isSystemIdentity');
	List.prototype.prepareDataPermission = require('./list/prepareDataPermission');

	// List.prototype.addToDelegationModelList = require('./list/fields/addToDelegationModelList');

	return List;

};
