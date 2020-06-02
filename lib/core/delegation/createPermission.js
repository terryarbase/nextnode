const _            = require('lodash');

function createPermission() {
    const nextNode = this;
    createPermissionListField(nextNode);

    const multilingual = nextNode.get('localization');
    const allLists = nextNode.lists;
    const advancedModels = this.get('advanced permission model') || {};
    const Types = nextNode.Field.Types;

    const { list = {}, field = {}, advancePlugin } = typeof advancedModels === 'function'
        ? advancedModels(this)
        : advancedModels;

    const fieldBlacklist = nextNode.reservedPermissionField();
    const permissionKey = {
        list: nextNode.reservedListPermissionKey(),
        field: nextNode.reservedFieldPermissionKey(),
    };

    let options = {
        // track: true,
        // noimport: true,     // no need to import
        // nodownload: true,   // no need to export
        noscale: true,
        isCore: true,     // discard the reverse checking / any core related checking
        multilingual,
        searchFields: 'name',
        defaultColumns: 'name',
        defaultSort: '-delegated',
        ...list,
    };

    /* table permission */
    const permissionOptions = [
        { label: 'True', value: true },
        { label: 'False', value: false },
    ]

    const fieldSchemaTemplate = {
        type: Types.Select,
        options: permissionOptions,
        boolean: true,
        restrictDelegated: true,
        required: true,
        default: true,
    }

    const listPermissionSchema = (defaultValue = true) => _.reduce(permissionKey.list, (fields, key) => {
        fields[key] = { ...fieldSchemaTemplate, defaultValue }
        return fields
    }, {});

    const listFieldPermissionSchema = _.reduce(permissionKey.field, (schema, key) => {
        schema.fields[key] = { ...fieldSchemaTemplate }
        return schema
    }, {
        type: Types.Object,
        multilingual: false,
        restrictDelegated: true,
        fields: {},
    });

    let permissionSchema = {
        // special self list for frontend UI render
        Permission: {
            type: Types.Object,
            multilingual: false,
            ignoreCombine: true,
            restrictDelegated: true,
            label: 'Permission',
            fields: {
                ...listPermissionSchema(false),
            },
        }
    };
    _.forEach(allLists, list => {
        const listFieldsPermissionSchema = _.reduce(list.fields, (schema, value, key) => {
            if (_.includes(fieldBlacklist, key)) return schema;
            schema[key] = { ...listFieldPermissionSchema }
            return schema
        }, {});

        permissionSchema[list.key] = { 
            type: Types.Object,
            multilingual: false,
            restrictDelegated: true,
            label: list.label,
            // hidden: !!allLists[key].options.hidden,
            fields: {
                ...listPermissionSchema(true),
                ...listFieldsPermissionSchema,
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
    _.forEach(allLists, list => {
        const fieldName = `${list.key}Query`;
        permissionQuery[fieldName] = {
            type: Types.Object,
            multilingual: false,
            restrictDelegated: true,
            label: field.label,
            fields: {
                value: {
                    type: Types.Relationship,
                    ref: 'PermissionListField',
                    filters: {
                        systemList: 'User'
                    },
                    note: "match value from 'User' list",
                },
                field: {
                    type: Types.Relationship,
                    ref: 'PermissionListField',
                    filters: {
                        systemList: list.key,
                    },
                    note: `match field from '${list.key}' list`,
                },
                isPopulate: {
                    type: Types.Boolean,
                },
                populateField: {
                    type: Types.Relationship,
                    ref: 'PermissionListField',
                    filters: {
                        systemList: `:${fieldName}.populate`
                    },
                    dependsOn: {
                        [`${fieldName}.isPopulate`]: true,
                    }
                },
                populate: {
                    type: Types.Select,
                    options: _.keys(allLists),
                    dependsOn: {
                        [`${fieldName}.isPopulate`]: true,
                    }
                },
                // hidden field
                _value: {
                    type: Types.Text,
                    hidden: true,
                },
                _field: {
                    type: Types.Text,
                    hidden: true,
                },
                _populateField: {
                    type: Types.Text,
                    hidden: true,
                }
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
    Permission.fieldBlacklist = fieldBlacklist;
    Permission.permissionKey = permissionKey;
    Permission.register(options);

    // update latest list to existed permission record
    updateLatestListPermission(nextNode, Permission);
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

async function updateLatestListPermission(nextNode, Permission, options) {
    const allListKeys = _.keys(nextNode.lists);
    const schema = _.pick(Permission.fields, allListKeys)
    const permissions = await Permission.model.find();
    const {
        permissionKey: {
            list: permissionKeyList,
            field: permissionKeyField,
        },
    } = Permission;

    /* permissionKeyList will auto set, not need check manual */
    // create a permission path checking list
    const checkList = _.reduce(schema, (paths, listSchema, listKey) => {
        const fieldKeys = _.difference(_.keys(listSchema.fields), permissionKeyList);
        const fieldSchema = _.pick(listSchema.fields, fieldKeys);
        _.forOwn(fieldSchema, (fpSchema, fieldKey) => {
            _.forEach(permissionKeyField, fpk => {
                paths.push(`${listKey}.${fieldKey}.${fpk}`);
            });
        })
        return paths
    }, []);

    _.forEach(permissions, p => {
        // set missing permission value via checklist
        const updateValue = _.reduce(checkList, (value, path) => {
            const permission = _.get(value, path);
            if (!_.isBoolean(permission)) {
                _.set(value, path, true);
            }
            return value
        }, p.toObject());

        p.set(updateValue);
        p.save();
    });
}

module.exports = createPermission;