const _                             = require('lodash');
const declareCustomizedOption       = require('../../../list/declareCustomizedOption');

function createModelList() {
    const nextNode = this;
    const advancedModels = this.get('advanced model list model') || {};

    const { list = {}, field = {}, advancePlugin } = typeof advancedModels === 'function' ? 
    advancedModels(this) : advancedModels;

    const config = {
        nodownload: true,   // no need to export
        noedit: true,
        nodelete: true,
        hidden: true,   // no need to view in the AdminUI
        // history: true,
        noscale: true,
        isCore: true,     // discard the reverse checking / any core related checking 
        multilingual: false,    // no need to support multi language anymore
        searchFields: 'name',
        defaultColumns: 'name, fields, selectable',
        defaultSort: '-delegated',
        ...list,
    };
    let ModelListCollection = new this.List('ModelList', config);
    
    const Types = this.Field.Types;
    let modelListtInfo = {
        name: {
            type: Types.Text,
            required: true,
            initial: true,
            index: true,
        },
        fields: {
            type: Types.Relationship,
            ref: 'ModelListItem',
            many: true,
        },
        selectable: {
            type: Types.Boolean,
            default: true,
            realedit: true,
            initial: true,
        },
    };

    const extraFields = declareCustomizedOption(nextNode, field);

	ModelListCollection.add({
        ...modelListtInfo,
        ...extraFields,
    });

    let options = {};
    // if (adminLockEnabled) {
    //     options = {
    //         plugin: require('./../hook/account'),
    //     };
    // }
    if (advancePlugin) {
        options = {
            ...options,
            plugin: [
                // options.plugin,
                advancePlugin,
            ],
        };
    }
    // LocalizationCollection.schema.plugin(plugin, { list: LocalizationCollection });
    ModelListCollection = ModelListCollection.register(options);

}

module.exports = createModelList;
