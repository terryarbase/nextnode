const toFind        = require('lodash/find');
const valuesOf      = require('lodash/values');
const toMap         = require('lodash/map');
const doOwn         = require('lodash/forOwn');
const isArray       = require('lodash/isArray');

function createAppIdentity() {
    const nextNode = this;
    const advancedModels = this.get('advanced system identity model') || {};

    const { list = {}, field = {}, advancePlugin } = advancedModels(this);
    let configs = {
        track: true,
        nodownload: true,   // no need to export
        // history: true,
        noscale: true,
        isCore: true,     // discard the reverse checking / any core related checking 
        multilingual: true,    // no need to support multi language anymore
        searchFields: 'name',
        defaultColumns: 'name, role',
        defaultSort: '-updatedAt',
        ...list,
    };
    let SystemIdentityCollection = new this.List('SystemIdentity', configs);
    const Types = this.Field.Types;
    // const multilingual = nextNode.get('localization');
    const info = {
        enabled: {
            type: Types.Boolean,
            default: true,
            initial: true,
            realedit: true,
        },
        name: {
            type: Types.Text,
            required: true,
            initial: true,
            index: true,
        },
        systemRole: {
            type: Types.Relationship,
            ref: 'Role',
            required: true,
            initial: true,
            restrictDelegated: true,
            filters: {
                delegated: false,
            },
            note: 'Permissions List Reference',
        },
    };

    /*
    ** Addon for the customized options from client
    ** Central initialization in this delegated method
    ** Terry Chan
    ** 09/04/2019
    */
    let extraFields = {};
    doOwn(field, (schema, f) => {
        let newSchema = { ...schema };
        if (schema.options && typeof schema.options === 'object') {
            newSchema = {
                ...schema,
                options: new nextNode.Options.customized(
                    schema.options.options,
                    schema.options.lang,
                ).getSectionValues()
            }
        }
        extraFields = {
            ...extraFields,
            [f]: newSchema,
        }
    });

	SystemIdentityCollection.add(
        "Basic Information",
        {
            ...info,
        },
        "Other Information",
        {
            ...extraFields,
        }
    );


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
    SystemIdentityCollection = SystemIdentityCollection.register(options);


}

module.exports = createAppIdentity;
