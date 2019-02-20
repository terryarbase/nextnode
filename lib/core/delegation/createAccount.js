const toFind        = require('lodash/find');
const valuesOf      = require('lodash/values');
const toMap         = require('lodash/map');

function createAccount() {
    var options = {
        track: true,
        nodownload: true,   // no need to export
        // history: true,
        noscale: true,
        isCore: true,     // discard the reverse checking / any core related checking 
        multilingual: false,    // no need to support multi language anymore
        searchFields: 'name, email',
        defaultColumns: 'name, role, isAdmin',
        defaultSort: '-delegated',
    };
    var AccountCollection = new this.List('User', options);
    const Types = this.Field.Types;
    const nextNode = this;
    const adminLockEnabled = nextNode.get('admin lock');

	AccountCollection.add({
        name: {
            type: Types.Text,
            required: true,
            initial: true,
            index: true,
        },
        role: {
            type: Types.Relationship,
            ref: 'Role',
            required: true,
            initial: true,
            restrictDelegated: true,
        },
        email: {
            type: Types.Email,
            initial: true,
            required: true,
            index: true,
            restrictDelegated: true,
        },
        accountStatus: {
            type: Types.Select,
            options: 'status',
            assign: true,
            default: true,
            restrictDelegated: true,
        },
        lastLoginAt: { type: Types.Datetime, noedit: true },
        password: { type: Types.Password, initial: true, required: true },
        incorrectPassword: {
            type: Types.Number,
            default: 0,
            restrictDelegated: true,
            hidden: !adminLockEnabled,
            noedit: !adminLockEnabled,
        }, // if 5, update lockedAt 
        lockedAt: { 
            type: Types.Datetime,
            noedit: !adminLockEnabled,
            hidden: !adminLockEnabled,
            restrictDelegated: true,
        }, // After 24 hours, auto unlock (reset incorrectCount and lockedAt)
        delegated: { 
            restrictDelegated: true,
            type: Types.Boolean,
            noedit: true,
            hidden: true, 
        },
    },
    'Permissions',
    {
        isAdmin: {
            type: Boolean,
            default: false,
            index: true,
            initial: true,
            realedit: true,
            restrictDelegated: true,
        }
    });

    // Provide access to Keystone
    AccountCollection.schema.virtual('canAccessKeystone').get(function isAdmin() {
        return this.isAdmin;
    });

    var plugins = {};
    if (adminLockEnabled) {
        plugins = {
            ...plugins,
            ...{
                plugin: require('./../hook/account'),
            },
        };
    }
    // LocalizationCollection.schema.plugin(plugin, { list: LocalizationCollection });
    AccountCollection = AccountCollection.register(plugins);
}

module.exports = createAccount;
