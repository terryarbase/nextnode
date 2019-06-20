const _            = require('lodash');

function createPermission() {
    const nextNode = this;
    createPermissionListField(nextNode);

    const multilingual = nextNode.get('localization');
    // const allLists = _cloneDeep(nextNode.lists);
    const allLists = nextNode.lists;
    const advancedModels = this.get('advanced permission model') || {};
    const Types = nextNode.Field.Types;

    const { list = {}, field = {}, advancePlugin } = typeof advancedModels === 'function' ? 
    advancedModels(this) : advancedModels;

    let options = {
        track: true,
        nodownload: true,   // no need to export
        noscale: true,
        isCore: true,     // discard the reverse checking / any core related checking
        multilingual,
        searchFields: 'name',
        defaultColumns: 'name',
        defaultSort: '-delegated',
        ...list,
    };

    const fieldBlacklist = [
        'delegated',
        'createdAt',
        'createdBy',
        'updatedAt',
        'updatedBy',
    ];

    /* table permission */
    const permissionOptions = [
        { label: 'No View', value: 0 },
        { label: 'View', value: 1 },
        { label: 'Edit', value: 2 },
    ]

    let permissionSchema = {
        // special self list for frontend UI render
        Permission: {
            type: Types.Object,
            multilingual: false,
            ignoreCombine: true,
            restrictDelegated: true,
            label: 'Permission',
            fields: {
                _table: {
                    type: Types.Select,
                    numeric: true,
                    options: permissionOptions,
                    restrictDelegated: true,
                    default: 0,
                    noedit: true,
                },
                _ignore: {
                    restrictDelegated: true,
                    type: Types.Boolean,
                    noedit: true,
                    hidden: true, 
                },
            },
        }
    };
    _.keys(allLists).forEach(function (key) {
        const listSchemaField = {};
        _.forOwn(allLists[key].fields, (value, key) => {
            if (_.includes(fieldBlacklist, key)) {
                return;
            }
            listSchemaField[key] = {
                type: Types.Select,
                numeric: true,
                options: permissionOptions,
                restrictDelegated: true,
                required: true,
                initial: true,
                // assign: true,
                default: 2,
            }
        });

        permissionSchema[allLists[key].key] = { 
            type: Types.Object,
            multilingual: false,
            restrictDelegated: true,
            label: allLists[key].label,
            // hidden: !!allLists[key].options.hidden,
            fields: {
                _table: {
                    type: Types.Select,
                    numeric: true,
                    options: permissionOptions,
                    restrictDelegated: true,
                    default: 2,
                    noedit: true,
                    note: 'Auto combine based on own fields permission on save',
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
    _.keys(allLists).forEach(function (key) {
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
                    options: _.keys(allLists),
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

    let Permission = new nextNode.List('Permission', options);
	Permission.add(
        {
            name: {
                type: Types.Text,
                required: true,
                initial: true,
                index: true,
                min: 2,
            },
            permissionKey: {
                type: Types.Text,
                multilingual: false,
                required: true,
                initial: true
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

function createPermissionListField(nextNode) {
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
    const systemListOption = _.keys(nextNode.lists);

    PermissionListField.add(
        {
            field: {
                type: Types.Text,
                restrictDelegated: true,
                required: true,
                initial: true,
            },
            systemList: {
                type: Types.Select,
                options: systemListOption,
                restrictDelegated: true,
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

    createDelegatedPermissionListField(nextNode, PermissionListField);
}

async function createDelegatedPermissionListField(nextNode, list) {
    try {
        const blacklist = ['PermissionListField'];
        let allLists = nextNode.lists;
        allLists = _.pickBy(allLists, list => !_.includes(blacklist, list.key));

        const existFields = await list.model.find({});
 
        const schemaFields = [];
        _.forOwn(allLists, (schema, listName) => {
            // define special _id filed
            schemaFields.push({
                systemList: listName,
                field: '_id',
                delegated: true,
            })
            // other fields defined in schema
            _.forOwn(schema.fields, (fieldSchema, fieldName) => {
                schemaFields.push({
                    systemList: listName,
                    field: fieldName,
                    delegated: true,
                })
            })
        });

        // create new filed which not exist in db
        const createFields = _.differenceWith(schemaFields, existFields, (schemaField, existField) => {
            return schemaField.systemList === existField.systemList && 
                schemaField.field === existField.field;
        });

        if (createFields.length) {
            await list.model.create(createFields);
        }

        // remove filed which not exist in schema
        const removeFields = _.differenceWith(existFields, schemaFields, (existField, schemaField) => {
            return schemaField.systemList === existField.systemList && 
                schemaField.field === existField.field;
        });

        if (removeFields.length) {
            _.map(removeFields, filed => {
                filed.remove();
            });
        }
    } catch (err) {
        console.log('> [Permission List Field] update delegated records error:', err);
        process.exit(1);
    }
}

module.exports = createPermission;