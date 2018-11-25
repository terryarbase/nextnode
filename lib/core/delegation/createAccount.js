const toFind        = require('lodash/find');
const valuesOf      = require('lodash/values');
const toMap         = require('lodash/map');

// const plugin        = require('./../hook/localization');
// var Languages       = require('../../locales');
// Languages           = Languages.toJS();

// const getDelegated = langs => toFind(langs, language => language.delegated);
var delegatedAdmin = {
    name: 'Administrator',
    email: 'admin@4d.com.hk',
    // encryted
    password: '$2a$10$FnO9ANc9zOcQkRhsxrHoYOA1dUC5YIdy0FM65EHrAqNEsip6ouw.i',   // should be changed for the first login
    isAdmin: true,
    delegated: true,
}

const createDelegatedAccount = async (node, model) => {
    const role = node.list('Role').model;
    try {
        const delegatedRole = await role.findOne({ delegated: true });
        var delegatedAccount = await model.findOne({ delegated: true });
        if (!delegatedAccount) {
            const schema = { ...delegatedAdmin, ...{ role: delegatedRole._id } };
            delegatedAccount = await new model(schema).save(); 
            console.log('> [Administrator Account] Create a delegated administrator account: ', delegatedAccount);
        } else {
            console.log('> [Administrator Account] Delegated administrator account and no need to create');
        }
    } catch (err) {
        console.log('> [Administrator Account] Cannot create a delegated administrator account.');
        console.log(err);
        process.exit(1);
    }
};


function createAccount() {
    var options = {
        track: true,
        history: true,
        noscale: true,
        map:{
            name: 'language',
        },
        isCore: true,     // discard the reverse checking / any core related checking 
        multilingual: false,    // no need to support multi language anymore
        searchFields: 'name, email',
        defaultColumns: 'name, role, enabled',
        defaultSort: '-delegated',
    };
    var AccountCollection = new this.List('Account', options);
    const Types = this.Field.Types;
    const nextNode = this;
    const localization = nextNode.get('localization');
    
    // if (!localization) {
    //     delete schema.incorrectPassword;
    //     delete schema.lockedAt;
    // }

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
        },
        email: {
            type: Types.Email,
            initial: true,
            required: true,
            index: true
        },
        lastLoginAt: { type: Types.Datetime, noedit: true },
        password: { type: Types.Password, initial: true, required: true },
        incorrectPassword: {
            type: Types.Number,
            default: 0,
            hidden: !localization,
            noedit: !localization,
        }, // if 5, update lockedAt 
        lockedAt: { 
            type: Types.Datetime,
            noedit: true,
            hidden: !localization,
            noedit: !localization,
        }, // After 24 hours, auto unlock (reset incorrectCount and lockedAt)
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
    });
    
    // LocalizationCollection.schema.plugin(plugin, { list: LocalizationCollection });
    AccountCollection = AccountCollection.register();
    // LocalizationCollection.schema.plugin(plugin, { model: LocalizationCollection.model });
    // console.log(LocalizationCollection.model);
    createDelegatedAccount(nextNode, AccountCollection.model);
}

module.exports = createAccount;
