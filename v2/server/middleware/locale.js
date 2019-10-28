/*
** Enhance Hooking for all of localization middleware
** Prepare the content language and ui language for the upcoming requests
** Ready for the i18n translation setting
** Terry Chan
** 11/10/2019
*/
const _                         = require('lodash');
const fs                        = require('fs');
const nextnode                  = require('./../../../');
// const Utils                     = require('./../utils');

const localization              = require('./../../../lib/handler/staticGenerator/localization');
const appLanguage               = require('./../../../lib/handler/staticGenerator/appLanguage');
const navigationLanguage        = require('./../../../lib/handler/staticGenerator/navigationLanguage');

const getStaticLanguageFile = async () => {
    const path = `${nextnode.get('nextnode root')}/${nextnode.get('static lang path')}`;
    let data;
    try {
        data = JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (err) { // if the language cannnot be read, then query db
        console.log(err);
        console.log('> Cannot read the Static Language File, query languages from Database.');
        const langHandler = new localization(nextnode, nextnode.list('Locale').model);
        // export file, and get db languages, if error then ignore localization in the app
        const { data: dbLang} = await langHandler.exportLanguageStatic();
        data = dbLang;
    }
    return data;
};

const getStaticNavLanguageSectionFile = async () => {
    const path = `${nextnode.get('nextnode root')}/${nextnode.get('static navigation path')}`;
    let data;
    try {
        data = JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (err) { // if the language cannnot be read, then query db
        console.log(err);
        console.log('> Cannot read the Static Navigation Language Section File, query navigation language sections from Database.');
        const navLangHandler = new navigationLanguage(nextnode, nextnode.list('NavigationLanguage').model);
        // export file, and get db languages, if error then ignore localization in the app
        const { data: dbLang} = await navLangHandler.exportNavSectionStatic();
        data = dbLang;
    }
    // console.log(data);
    return data;
};

const getStaticAppLanguageSectionFile = async () => {
    const path = `${nextnode.get('app root')}/${nextnode.get('static section path')}`;
    let data;
    try {
        data = JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (err) { // if the language cannnot be read, then query db
        console.log('> Cannot read the Static App Language Section File, query app language sections from Database.');
        const appLangHandler = new appLanguage(nextnode, nextnode.list('ApplicationLanguage').model);
        // export file, and get db languages, if error then ignore localization in the app
        const { data: dbLang} = await appLangHandler.exportSectionStatic();
        data = dbLang;
    }
    // console.log(data);
    return data;
};

const fromRequestLanguage = (req, name) => {
    return req.get(name) || req.body[name] || req.query[name];
    // if (nextnode.get('support locales').indexOf(lang) === -1){
    //     return null;
    // }
    // return lang;
}

// is it valid lang in supporting language pack
const getValidSupports = (supportLanguages, language) => {
    return !!supportLanguages[language] ? language : null;
}

const getCurrentLanguage = async ({
    currentLang,
    supportLanguages,
    req,
}) => {
    let contentLanguage = currentLang;
    let uiLanguage = currentLang;
    if (nextnode.get('localization')) {
        // get the language prefered from the request info
        contentLanguage = fromRequestLanguage(req, 'dataLanguage');
        uiLanguage = fromRequestLanguage(req, 'language');
        if (req.user) {
            const {
                user,
            } = req;
            // use system user preference by default, if no given language from the request
            if (!contentLanguage) {
                contentLanguage = user.contentLanguage;
            }
            if (!uiLanguage) {
                uiLanguage = user.language;
            }
        }
    }
    // ensure the chosen language is well supported in locale.json
    contentLanguage = getValidSupports(supportLanguages, contentLanguage) || currentLang;
    uiLanguage = getValidSupports(supportLanguages, uiLanguage) || currentLang;

    return {
        contentLanguage,
        uiLanguage,
    }
};

const includeLocale = async function (req, res, next) {
    req.nextnode = nextnode;
    req.keystone = nextnode;
    const defaultLanguage = nextnode.get('locale');
    // get all current supported language from locale.json config
    const localization = await getStaticLanguageFile();
    // const localization = _.pick(supportLanguages, defaultLanguage);

    // get request language setting, no matter it is supporting localization
    const { contentLanguage, uiLanguage } = await getCurrentLanguage({
        currentLang: defaultLanguage,
        supportLanguages: localization,
        req,
    });

    req.t = nextnode.get('i18n');
    // console.log(uiLanguage);
    // all of message handling should use the ui-language by default
    req.t.setLocale(uiLanguage);
    req.locales = {
        // localization language set
        localization,
        // default language to pickup the data
        defaultLanguage,
        // adminUI current data language, serve the any requested lang first before cookie lang
        langd: contentLanguage,
        // adminUI current layout language
        langf: uiLanguage,
    };

    req.appLanguage = await getStaticAppLanguageSectionFile();
    req.menuLanguage = await getStaticNavLanguageSectionFile();

    nextnode.set('langf', req.locales.langf);
    nextnode.set('langd', req.locales.langd);
    nextnode.set('language pack', req.locales.localization);

    next();
};

module.exports = {
    includeLocale,
};
