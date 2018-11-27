const toFind        = require('lodash/find');
const valuesOf      = require('lodash/values');
const toMap         = require('lodash/map');

const plugin        = require('./../hook/localization');
var Languages       = require('../../../locales');
Languages           = Languages.toJS();

// const getDelegated = langs => toFind(langs, language => language.delegated);

const concatOptions = node => {
    var options = {
        track: true,
        nodownload: true,
        noscale: true,
        map:{
            name: 'language',
        },
        defaultColumns: 'language, activate',
        searchFields: 'language',
        defaultSort: '-activate',
        isCore: true,
    };
    var langs = valuesOf(Languages);
    const needLocalize = node.get('localization');
    if (!needLocalize) {
        options = {
            ...options,
            hidden: true,
            nocreate: true,
            noedit: true,
            nodelete: true,
        };
        langs = [];
        if (Languages[node.get('locale')]) {
            langs = [Languages[node.get('locale')]];
        }
        // getDelegated(Languages);
        // if (langs) langs = [langs];
    }
    return {
        config: options,
        langs,
    };
}

const executeInsertLanguage = async (node, model, { icon, label, value, active }) => {
    const defaultLocale = node.get('locale');
    const delegated = defaultLocale && defaultLocale === value;
    var existing = await model.findOne({
        identify: value,
    });
    if (existing) {
        console.log('> [Localization] Update Currrent Language: ', existing.language, ' (', delegated, ')');
        existing.delegated = delegated;
        existing.icon = icon;
        // if the language is set to inactive, then set to active if it is delegated record
        if (!existing.activate && delegated) {
            existing.activate = true;
        }
        return await existing.save();
    }
    console.log('> [Localization] Add New Language: ', label, ' (', delegated, ')');
    // create new lang
    return await new model({
        language: label,
        identify: value,
        delegated,
        activate: delegated || active,
        icon,
    }).save();
};

const createAvailableLanguage = async (node, model, langs) => {
    const tasks = toMap(langs, lang => executeInsertLanguage(node, model, lang));
    try {
        await Promise.all(tasks);
    } catch (err) {
        console.log(err);
    }
}

function createLocalization() {
    const { config, langs } = concatOptions(this);
    var LocalizationCollection = new this.List('Localization', config);
    const Types = this.Field.Types;
    const nextNode = this;
    var schema = {};
    if (!langs.length) {
        console.log('No any Language can be read in locales/index.js / Your "locale" options is invalid in index.js');
        process.exit(1);
    }
    // const oneDelegated = getDelegated(langs);
    // if (!oneDelegated) {
    //     console.log('At least one language with delegated flag in locales/index.js');
    //     return;
    // }
    
	LocalizationCollection.add({
        language: { type: Types.Text, required: true, initial: true },
        icon: {
            type: Types.Text,
            noedit: true,
            base64Image: true, 
        },
        identify: {
            type: Types.Text,
            required: true,
            initial: true,
            index: true,
            noedit: true,
        },
        activate: { type: Types.Boolean, realedit: true, restrictDelegated: true },
        delegated: { 
            type: Types.Boolean,
            noedit: true,
            hidden: true,  
        },
    });
    
    // LocalizationCollection.schema.plugin(plugin, { list: LocalizationCollection });
    LocalizationCollection = LocalizationCollection.register({ plugin });
    // LocalizationCollection.schema.plugin(plugin, { model: LocalizationCollection.model });
    // console.log(LocalizationCollection.model);
    createAvailableLanguage(nextNode, LocalizationCollection.model, langs);
}

module.exports = createLocalization;