const _map            = require('lodash/map');
const _forOwn         = require('lodash/forOwn');
const _pick           = require('lodash/pick');
const _cloneDeep      = require('lodash/cloneDeep');
const _filter         = require('lodash/filter');
const _differenceWith = require('lodash/differenceWith');

function createPermission() {
    const nextNode = this;
    const allLists = _cloneDeep(nextNode.lists);
    createPermissionListField(nextNode, allLists);
    const advancedModels = this.get('advanced permission model') || {};

    const { list = {}, field = {}, advancePlugin } = typeof advancedModels === 'function' ? 
    advancedModels(this) : advancedModels;

    let options = {
        track: true,
        nodownload: true,   // no need to export
        noscale: true,
        isCore: true,     // discard the reverse checking / any core related checking 
        multilingual: true,    // no need to support multi language anymore
        // searchFields: 'name, email',
        // defaultColumns: 'name, role, isAdmin',
        defaultSort: '-delegated',
        // ...list,
    };
    let Permission = new nextNode.List('Permission', options);
    const Types = nextNode.Field.Types;
    // const adminLockEnabled = nextNode.get('admin lock');
    // const multilingual = nextNode.get('localization');

    /* table permission */
    const permissionOptions = [
        { label: 'No View', value: 0 },
        { label: 'View', value: 1 },
        { label: 'Edit', value: 2 },
    ]

    let permissionSchema = {};
    Object.keys(allLists).forEach(function (key) {
        const listSchemaField = {};
        _forOwn(allLists[key].fields, (value, key) => (
            listSchemaField[key] = {
                type: Types.Select,
                numeric: true,
                options: permissionOptions,
                required: true,
                initial: true,
                // assign: true,
                default: 2,
                // restrictDelegated: true,
            }
        ));

        permissionSchema[allLists[key].key] = { 
            type: Types.Object,
            multilingual: false,
            // restrictDelegated: true,
            label: allLists[key].label,
            // hidden: !!allLists[key].options.hidden,
            fields: {
                _table: {
                    type: Types.Number,
                    hidden: true,
                    default: 3,
                },
                ...listSchemaField,
            },
        };
    });
    /* table permission end */

    const queryConditionOptions = [
        { label: 'And', value: 'and' },
        { label: 'Or', value: 'or' },
    ]

    /* table query */
    let permissionQuery = {};
    Object.keys(allLists).forEach(function (key) {
        const field = allLists[key];
        const fieldName = `${field.key}Query`;
        permissionQuery[fieldName] = { 
            type: Types.List,
            multilingual: false,
            restrictDelegated: true,
            label: field.label,
            fields: {
                userField: {
                    type: Types.Relationship,
                    ref: 'PermissionListField',
                    filters: {
                        systemList: 'User',
                    },
                    required: true,
                    initial: true,
                },
                field: {
                    type: Types.Text,
                    hidden: true,
                },
                targetList: {
                    type: Types.Select,
                    options: Object.keys(allLists),
                },
                targetField: {
                    type: Types.Relationship,
                    ref: 'PermissionListField',
                    filters: { 
                        systemList: ':targetList'
                    },
                },
                populateField: {
                    type: Types.Text,
                    hidden: true,
                },
                // condition: {
                //     type: Types.Select,
                //     options: queryConditionOptions,
                //     default: 'and',
                //     required: true,
                //     initial: true,
                // },
                // field: {
                //     type: Types.Relationship,
                //     ref: 'PermissionListField',
                //     filters: {
                //         systemList: field.key
                //     },
                //     required: true,
                //     initial: true,
                // },
                // targetList: {
                //     type: Types.Select,
                //     options: Object.keys(allLists),
                //     required: true,
                //     initial: true,
                // },
                // targetField: {
                //     type: Types.Relationship,
                //     ref: 'PermissionListField',
                //     filters: { 
                //         systemList: ':targetList'
                //     },
                //     required: true,
                //     initial: true,
                // }
            },
        };
    })
    /* table query end */

	Permission.add(
        {
            name: {
                type: Types.Text,
                required: true,
                initial: true,
                index: true,
            },
        },
        "List Permission",
        {
            ...permissionSchema,
        },
        "List Query",
        {
            ...permissionQuery,
        },
        {
            delegated: { 
                restrictDelegated: true,
                type: Types.Boolean,
                noedit: true,
                hidden: true, 
            },
        }
    );

    options = {
        plugin: require('./../hook/permission'),
    };
    if (advancePlugin) {
        options = {
            ...options,
            plugin: [
                options.plugin,
                advancePlugin,
            ],
        };
    }

    // Localization.schema.plugin(plugin, { list: Localization });
    Permission.register(options);
}

function createPermissionListField(nextNode, allLists) {
    var options = {
        nocreate: true,     // system auto create related list field
        nodownload: true,   // no need to export
        noscale: true,
        isCore: true,     // discard the reverse checking / any core related checking 
        multilingual: false,    // no need to support multi language anymore
        searchFields: 'field, systemList',
        defaultColumns: 'field, systemList',
        defaultSort: '-delegated',
        map: {
            name: 'field',
        }
    };
    let PermissionListField = new nextNode.List('PermissionListField', options);
    const Types = nextNode.Field.Types;
    const systemListOption = Object.keys(allLists);

    PermissionListField.add(
        {
            field: {
                type: Types.Text,
                required: true,
                initial: true,
            },
            systemList: {
                type: Types.Select,
                options: systemListOption,
                required: true,
                initial: true,
            },
            delegated: { 
                restrictDelegated: true,
                type: Types.Boolean,
                noedit: true,
                hidden: true, 
            },
        }
    );

    PermissionListField.register();

    createDelegatedPermissionListField(PermissionListField, allLists);
}

async function createDelegatedPermissionListField(list, allLists) {
    try {
        const existFields = await list.model.find({});
 
        const schemaFields = [];
        _forOwn(allLists, (schema, listName) => {
            // define special _id filed
            schemaFields.push({
                systemList: listName,
                field: '_id',
                delegated: true,
            })
            _forOwn(schema.fields, (fieldSchema, fieldName) => {
                schemaFields.push({
                    systemList: listName,
                    field: fieldName,
                    delegated: true,
                })
            })
        });

        // create new filed which not exist in db
        const createFields = _differenceWith(schemaFields, existFields, (schemaField, existField) => {
            return schemaField.systemList === existField.systemList && 
                schemaField.field === existField.field;
        });

        if (createFields.length) {
            await list.model.create(createFields);
        }

        // remove filed which not exist in schema
        const removeFields = _differenceWith(existFields, schemaFields, (existField, schemaField) => {
            return schemaField.systemList === existField.systemList && 
                schemaField.field === existField.field;
        });

        if (removeFields.length) {
            _map(removeFields, filed => {
                filed.remove();
            });
        }
    } catch (err) {
        console.log('> [Permission List Field] update delegated records error:', err);
        process.exit(1);
    }
}

module.exports = createPermission;