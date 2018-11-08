const toFind        = require('lodash/find');
const valuesOf      = require('lodash/values');
const toMap         = require('lodash/map');

var Languages       = require('../../locales');
Languages           = Languages.toJS();

const getDelegated = langs => toFind(langs, language => language.delegated);

const concatOptions = node => {
    var options = {
        nodownload: true,
        noscale: true,
        map:{
            name: 'language',
        },
        defaultColumns: 'language, activate',
        searchFields: 'language',
        defaultSort: '-activate',
    };
    var langs = valuesOf(Languages);
    const needLocalize = node.get('localization');
    if (!needLocalize) {
        options = {
            ...options,
            // hidden: true,
            nocreate: true,
            noedit: true,
            // nodelete: true,
        };
        langs = getDelegated(Languages);
        if (langs) langs = [langs];
    }
    return {
        config: options,
        langs,
    };
}

const executeInsertLanguage = async (model, { label, value }) => {
    const defaultLocale = node.get('defaultLocale');
    const delegated = defaultLocale && defaultLocale === value;
    return await model.findOneAndUpdate({
        identify: value,
    }, {
        language: label,
        identify: value,
        delegated,
        activate: delegated,
    }, {
        upsert: true,
        new: true,
    }).exec();
};

const createAvailableLanguage = async (model, langs) => {
    const tasks = toMap(langs, lang => executeInsertLanguage(model, lang));
    try {
        await Promise.all(tasks);
    } catch (err) {
        console.log(err);
    }
}

function createLocalization() {
    const nextNode = this;
    const { config, langs } = concatOptions(nextNode);
    const LocalizationCollection = new nextNode.List('Localization', config);
    const Types = this.Field.Types;

    var schema = {};
    if (!langs.length) {
        console.log('No any Language can be read in locales/index.js');
        return;
    }
    const oneDelegated = getDelegated(langs);
    if (!oneDelegated) {
        console.log('At least one language with delegated flag in locales/index.js');
        return;
    }
    
	LocalizationCollection.add({
        language: { type: Types.Text, required: true, initial: true },
        identify: {
            type: Types.Text,
            required: true,
            initial: true,
            index: true,
            noedit: true,
        },
        activate: { type: Types.Boolean, realedit: true },
        delegated: { 
            type: Types.Boolean,
            noedit: true,
            hidden: true,  
        },
    });

    LocalizationCollection.register();
    createAvailableLanguage(LocalizationCollection.model, langs);
}

module.exports = createLocalization;
