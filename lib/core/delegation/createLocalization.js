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
        noimport: true,
        nodownload: true,
        noscale: true,
        nocreate: true,
        nodelete: true,
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
            noedit: true,
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

const executeInsertLanguage = async (idx, node, model, { icon, label, sortLabel, value, active, altIdentify }) => {
    const defaultLocale = node.get('locale');
    const delegated = defaultLocale && defaultLocale === value;
    var existing = await model.findOne({
        identify: value,
    });
    if (existing) {
        existing.delegated = delegated;
        existing.icon = icon;
        existing.altIdentify = altIdentify;
        // if the language is set to inactive, then set to active if it is delegated record
        if (!existing.activate && delegated) {
            existing.set('activate', true);
        }
        console.log('> [Localization] Update Currrent Language: ', existing.language, ' (', delegated, ')');
        return await existing.save();
    }
    console.log('> [Localization] Add New Language: ', label, ' (', delegated, ')');
    // create new lang
    return await new model({
        language: label,
        identify: value,
        label: sortLabel,
        delegated,
        ordering: (delegated || active) ? 99 : idx + 1,
        activate: delegated || active,
        icon,
    }).save();
};

const createAvailableLanguage = async (node, model, langs) => {
    const tasks = toMap(langs, (lang, idx) => executeInsertLanguage(idx, node, model, lang));
    try {
        await Promise.all(tasks);
    } catch (err) {
        console.log(err);
    }
}

async function createLocalization() {
    const { config, langs } = concatOptions(this);
    var LocalizationCollection = new this.List('Locale', config);
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
        label: { type: Types.Text, initial: true },
        icon: {
            type: Types.Text,
            noedit: true,
            base64Image: true, 
            base64Prefix: true,
        },
        identify: {
            type: Types.Text,
            required: true,
            initial: true,
            index: true,
            noedit: true,
        },
        altIdentify: {
            type: Types.Text,
            // required: true,
            // initial: true,
            index: true,
            noedit: true,
            note: 'Used for calendar',
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
        ordering: {
            type: Types.Number,
            default: 1,
        },
    });
    
    // LocalizationCollection.schema.plugin(plugin, { list: LocalizationCollection });
    LocalizationCollection = LocalizationCollection.register({ plugin });
    // LocalizationCollection.schema.plugin(plugin, { model: LocalizationCollection.model });
    // console.log(LocalizationCollection.model);

    return await createAvailableLanguage(nextNode, LocalizationCollection.model, langs);
}

module.exports = createLocalization;
