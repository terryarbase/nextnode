const _                             = require('lodash');

const declareCustomizedOption       = require('../../../list/declareCustomizedOption');

function createModelListItem() {
    const nextNode = this;
    const advancedModels = this.get('advanced model list item model') || {};

    const { list = {}, field = {}, advancePlugin } = typeof advancedModels === 'function' ? 
    advancedModels(this) : advancedModels;

    const config = {
        noimport: true,     // no need to import
        nodownload: true,   // no need to export
        noedit: true,
        nodelete: true,
        hidden: true,   // no need to view in the AdminUI
        // history: true,
        noscale: true,
        isCore: true,     // discard the reverse checking / any core related checking 
        multilingual: false,    // no need to support multi language anymore
        searchFields: 'name, type',
        defaultColumns: 'name, type, target',
        defaultSort: '-delegated',
        ...list,
    };
    let ModelListItemCollection = new this.List('ModelListItem', config);
    const Types = this.Field.Types;
    let modelListtItemInfo = {
        name: {
            type: Types.Text,
            required: true,
            initial: true,
            index: true,
        },
        type: {
            type: Types.Select,
            assign: true,
            options: 'nextnodeType',
            default: 'Text'
        },
        target: {
            type: Types.Relationship,
            ref: 'ModelList',
            label: 'List'
        },
    };

    const extraFields = declareCustomizedOption(nextNode, field);


	ModelListItemCollection.add({
        ...modelListtItemInfo,
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
    ModelListItemCollection = ModelListItemCollection.register(options);

}

module.exports = createModelListItem;
