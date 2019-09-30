const toFind                        = require('lodash/find');
const valuesOf                      = require('lodash/values');
const toMap                         = require('lodash/map');
const doOwn                         = require('lodash/forOwn');
const isArray                       = require('lodash/isArray');

const declareCustomizedOption       = require('../../list/declareCustomizedOption');

function createAccount() {
    const nextNode = this;
    const advancedModels = this.get('advanced user model') || {};
    // service worker part
    const serviceWorker = nextNode.get('service worker js');

    const { list = {}, field = {}, advancePlugin } = typeof advancedModels === 'function' ? 
    advancedModels(this) : advancedModels;
    var options = {
        track: true,
        nodownload: true,   // no need to export
        // history: true,
        noscale: true,
        isCore: true,     // discard the reverse checking / any core related checking 
        multilingual: false,    // no need to support multi language anymore
        searchFields: 'name, email',
        defaultColumns: 'name, permission, isAdmin',
        defaultSort: '-delegated',
        ...list,
    };
    var AccountCollection = new this.List('User', options);
    const Types = this.Field.Types;
    const adminLockEnabled = nextNode.get('admin lock');
    const multilingual = nextNode.get('localization');
    let accountInfo = {
        name: {
            type: Types.Text,
            required: true,
            initial: true,
            index: true,
        },
        permission: {
            type: Types.Relationship,
            ref: 'Permission',
            required: true,
            many: nextNode.get('multi admin role'),
            initial: true,
            restrictDelegated: true,
        },
        identity: {
            type: Types.Relationship,
            ref: 'SystemIdentity',
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
        browserDeviceToken: {
            type: Types.Text,
            noedit: true,
            hidden: !serviceWorker,     // if no service worker config, then can hide it
            note: 'Special for Service Worker Browser Push',
        },
        enabledBrowserPush: {
            type: Types.Boolean,
            noedit: true,
            default: false,
            hidden: !serviceWorker,
            note: 'Receiving on Browser Push Notification',
        },
    };

    if (multilingual) {
        accountInfo = {
            ...accountInfo,
            language: {
                type: Types.Select,
                default: nextNode.get('locale'),
                required: true,
                initial: true,
                options: nextNode.get('support locales pack'),
            },
        };
    }

    /*
    ** Addon for the customized options from client
    ** Central initialization in this delegated method
    ** Terry Chan
    ** 09/04/2019
    */
    const extraFields = declareCustomizedOption(nextNode, field);

	AccountCollection.add(
        "Account Info",
        {
            ...accountInfo,
            password: {
                type: Types.Password,
                initial: true,
                required: true,
            },
            ...extraFields,
        },
        "Activity Log",
        {
            lastLoginAt: { type: Types.Datetime, noedit: true },
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
            },
            delegated: { 
                restrictDelegated: true,
                type: Types.Boolean,
                noedit: true,
                hidden: true, 
            },
        }
    );

    // Provide access to Keystone
    AccountCollection.schema.virtual('canAccessKeystone').get(function isAdmin() {
        return this.isAdmin;
    });

    var options = {};
    if (adminLockEnabled) {
        options = {
            plugin: require('./../hook/account'),
        };
    }
    if (advancePlugin) {
        options = {
            ...options,
            plugin: [
                options.plugin,
                advancePlugin,
            ],
        };
    }

    // LocalizationCollection.schema.plugin(plugin, { list: LocalizationCollection });
    AccountCollection = AccountCollection.register(options);


}

module.exports = createAccount;
