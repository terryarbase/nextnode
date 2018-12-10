var _ = require('lodash');

/**
 * Gets the options for the List, as used by the React components
 */
function getOptions () {
	var ops = {
		autocreate: this.options.autocreate,
		autokey: this.autokey,
		defaultColumns: this.options.defaultColumns,
		defaultSort: this.options.defaultSort,
		fields: {},
		hidden: this.options.hidden,
		initialFields: _.map(this.initialFields, 'path'),
		key: this.key,
		label: this.label,
		nameField: this.nameField ? this.nameField.getOptions() : null,
		nameFieldIsFormHeader: this.nameFieldIsFormHeader,
		nameIsInitial: this.nameIsInitial,
		nameIsVirtual: this.nameIsVirtual,
		namePath: this.namePath,
		/*
		** @Terry Chan 11/12/2018
		*/
		nolist: this.options.nolist,

		nocreate: this.options.nocreate,
		nodelete: this.options.nodelete,
		noedit: this.options.noedit,
		/*
		** @Terry Chan 04/08/2018
		*/
		nodownload: this.options.nodownload,
		nofilter: this.options.nofilter,
		noscale: this.options.noscale,
		multilingual: this.options.multilingual,
		path: this.path,
		perPage: this.options.perPage,
		plural: this.plural,
		searchFields: this.options.searchFields,
		singular: this.singular,
		sortable: this.options.sortable,
		sortContext: this.options.sortContext,
		track: this.options.track,
		tracking: this.tracking,
		showSelfCreatedOnly: this.options.showSelfCreatedOnly,
		relationships: this.relationships,
		uiElements: [],
		/*
		** @Terry Chan 05/11/2018
		*/
		realtimeEditFields: [],
	};
	var realtimeEditFields = [];
	_.forEach(this.uiElements, function (el) {

		switch (el.type) {
			// TODO: handle indentation
			case 'field':
				// add the field options by path
				ops.fields[el.field.path] = el.field.getOptions();
				// ops.fields[el.field.path].realtimeEdit = !!_.find(ops.realtimeButtons, b => b === el.field.path);
				// don't output hidden fields
				if (el.field.hidden) {
					return;
				}
				const realEdit = ops.fields[el.field.path].realedit;
				const restrict = ops.fields[el.field.path].restrictDelegated;
				// add the field to the elements array
				ops.uiElements.push({
					type: 'field',
					field: el.field.path,
					realEdit,
					restrict,
				});
				// push to realtime list for easy manipulate 
				if (realEdit) {
					realtimeEditFields = [ ...realtimeEditFields, el.field.path ];
				}
				break;
			case 'heading':
				ops.uiElements.push({
					type: 'heading',
					content: el.heading,
					options: el.options,
				});
				break;
		}
	});

	ops = { ...ops, realtimeEditFields };
	return ops;
}

module.exports = getOptions;
