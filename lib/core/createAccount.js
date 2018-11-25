const toFind        = require('lodash/find');
const valuesOf      = require('lodash/values');
const toMap         = require('lodash/map');

const plugin        = require('./hook/localization');
// var Languages       = require('../../locales');
// Languages           = Languages.toJS();

// const getDelegated = langs => toFind(langs, language => language.delegated);
const delegatedAdmin = {
    name: 'Administrator',
    email: 'admin@4d.com.hk',
    // encryted
    password: '$2a$10$FnO9ANc9zOcQkRhsxrHoYOA1dUC5YIdy0FM65EHrAqNEsip6ouw.i',   // should be changed for the first login
    isAdmin: true,
    delegated: true,
}

const createDelegatedAccount = async (node, model) => {
    const role = node.list('Role').model;

};


function createAccount() {
    var options = {
        track: true,
        history: true,
        multilingual: false,    // no need to support multi language anymore
        searchFields: 'name, email',
        defaultColumns: 'name, role, enabled',
    };
    var AccountCollection = new this.List('Account', options);
    const Types = this.Field.Types;
    const nextNode = this;
    const localization = nextNode.get('localization');
    const schema = {
        name: {
            type: Types.Text,
            required: true,
            index: true,
        },
        role: {
            type: Types.Relationship,
            ref: 'Role',
            initial: true,
        },
        email: {
            type: Types.Email,
            initial: true,
            required: true,
            index: true
        },
        lastLoginAt: { type: Types.Datetime, noedit: true },
        password: { type: Types.Password, initial: true, required: true },
        incorrectPassword: { type: Types.Number, default: 0 }, // if 5, update lockedAt 
        lockedAt: { type: Types.Datetime, noedit: true }, // After 24 hours, auto unlock (reset incorrectCount and lockedAt)
        delegated: { 
            type: Types.Boolean,
            noedit: true,
            hidden: true, 
        },
    },
    'Permissions',
    {
        enabled: {
            type: Boolean,
            default: false,
            index: true,
            initial: true,
            realedit: true,
            restrictDelegated: true,
        }
    };
    
    if (!localization) {
        delete schema.incorrectPassword;
        delete schema.lockedAt;
    }

	AccountCollection.add(schema);
    
    // LocalizationCollection.schema.plugin(plugin, { list: LocalizationCollection });
    AccountCollection = AccountCollection.register();
    // LocalizationCollection.schema.plugin(plugin, { model: LocalizationCollection.model });
    // console.log(LocalizationCollection.model);
    createDelegatedAccount(nextNode, AccountCollection.model);
}

module.exports = createAccount;
