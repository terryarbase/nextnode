// const keystone = require('keystone');
// const PermissionType = require('./../enum/PermissionType');
// const Types = keystone.Field.Types;
const _                             = require('lodash');
const SectionHandler = {
    list: require('./languageSection/list'),
    note: require('./languageSection/note'),
    // TODO placeholder
    // placeholder: require('./languageSection/placeholder'),
};
const plugin                        = require('./../hook/appLanguage');
const LanguageSectionGenerator      = require('./../../handler/staticGenerator/appLanguage');
/**
* Language Section Model
* ==========
*/
// nameRequired: only field section need to edit List name, turn off for the rest of section
const createSectionTable = (nextnode) => {
    const Types = nextnode.Field.Types;
    const multilingual = nextnode.get('localization');
    const SectionList = new nextnode.List('ApplicationLanguage', {
        track: true,
        noscale: true,
        nodelete: true,
        nocreate: true,
        noimport: true,
        nodownload: true,
        multilingual,
        map: {
            name: 'listLabel',
        },
        isCore: true,
        searchFields: 'listName, listLabel',
        defaultColumns: 'listLabel, updatedAt',
        defaultSort: '-updatedAt',
    });
    var schema = {
        listName: { // only for the key of the list
            type: Types.Text,
            required: true,
            multilingual: false,
            initial: true,
            noedit: true,
        },
        listLabel: {    // display label for the list
            type: Types.Text,
            required: true,
            initial: true,
        },
    };
    _.forEach(nextnode.Options.section.keys, section => {
        schema = {
            ...schema,
            ...{
               [section]: {
                    type: Types.KeyText,
                    noeditkey: true,
                    noeditadd: true,
                }, 
            },
        };
    });

    SectionList.add(schema);

    SectionList.register({ plugin });

    return SectionList;
};

const getCurrentSection = async (list) => {
    return await list.model.find();
}

const insertSections = async (list, sections) => {
    return await list.model.insertMany(sections);
}

const updateSection = async (list, id, section) => {
    return await list.model.update({ _id: id }, section);
}

const removeAllSections = async (list) => {
    return await list.model.remove();
}

/*
** @Array: document remove actions
** Construct the document action to any current language section
** which is no longer to use in the app section checking by listName field
** Terry Chan
** 02/12/2018
*/
const getNoExistingSections = (currentSection, newSection) => {
    return _.differenceBy(
            currentSection, 
            newSection, 'listName'
        ).reduce((a, s) => {

            // remove the document from currentSection
            // if it is a mongoose document object with a remove method
            if (s.remove) {
                a = [ ...a, s.remove() ];
            }
            return a;
        }, []
    );
}
/*
** @Array: document update actions
** Construct new app language section regarding from the newSection
** the new section's label must not be overrided to the existing section's label
** Terry Chan
** 02/12/2018
*/
const getDifferentSectionWithMultilingual = (existing, section) => {
    return _.fromPairs(
        _.keys(section)
        .map(
            // construct to [lang, union keytext array]
            k => [
                k,
                /*
                 ** [IMPORTANT]
                 ** 1. Union new section and current section for any new field defined by you
                 ** 2. Intersection with combined section with the new section for any field deleted by you
                 ** Terry Chan
                 ** 30/11/2018
                 */
                _.intersectionBy(
                    _.unionBy(existing[k], section[k], 'key'),
                    section[k],
                    'key',
                )
            ]
        )
    );
}
const getNewSections = (nextnode, list, currentSection, newSection) => {
    const multilingual = nextnode.get('localization');
    const sectionList = nextnode.Options.section.keys;
    return _.reduce(newSection, (a, section) => {
        const existing = _.find(currentSection, s => s.listName === section.listName);
        // new section for languages
        if (!existing) {
            a = [ ...a, insertSections(list, [section]) ];
        } else {
            if (multilingual) {
                var newSection;
                existing.set('listLabel', 
                    _.chain((newSection = { ...section.listLabel, ...existing.listLabel }))
                        .keys()
                        .reduce((a, key) => {
                            if (section.listLabel[key]) {
                                a = [
                                    ...a,
                                    [key, newSection[key]],
                                ]
                            }
                            return a;
                    }, []).fromPairs().value()
                );
            } else {
                existing.set('listLabel', existing.listLabel);
            }
            // for section (field, note and etc)
            _.forEach(sectionList, key => {
                if (section[key]) {
                    if (multilingual) {
                        // union by unique object with multilingual
                        existing.set(key, getDifferentSectionWithMultilingual(existing[key], section[key]));
                    } else if (_.isArray(section[key])) {
                        existing.set(key, _.unionBy(existing, section, 'key'));
                    }
                }
            });
            a = [ ...a, existing.save()];
        }
        return a;
    }, []);
}

const executeSections = async (nextnode, list, newSection) => {
    const currentSection = await getCurrentSection(list);
    var result;
    if (!currentSection.length) {
        result = await insertSections(list, newSection);
        console.log('> [Language Section] Insert initial language section');
        return;
    }
    return Promise.all([
        // remove all of no longer exists section from newSection
        ...getNoExistingSections(currentSection, newSection), 
        // prepare insert/update process the whole set of section
        ...getNewSections(nextnode, list, currentSection, newSection),
    ]).then(result => result);
}

function createLanguageSection (nextnode) {
    // const nextnode = this;
    const currentlyList = nextnode.lists && nextnode.lists['ApplicationLanguage'];
    // use customerized ordering
    const list = currentlyList || createSectionTable(nextnode);
    const sectioner = new SectionHandler.list(nextnode, 'field');
    const value = sectioner.getValue();
    // console.log(value);
    if (currentlyList) {
        return executeSections(nextnode, list, value).then(
            result => new LanguageSectionGenerator(nextnode, list.model).exportSectionStatic()
        ).catch(err => {
            console.log('> [Language Section] Cannot create language section.');
            console.log(err);
            process.exit(1);
        }); 
    }
    // (async () => {
    //     try {
    //         executeSections(nextnode, list, value);
    //         return new LanguageSectionGenerator(nextnode, list.model).exportSectionStatic();
    //     } catch (err) {
    //         console.log('> [Language Section] Cannot create language section.');
    //         console.log(err);
    //         process.exit(1);
    //     };
    // })();
}

module.exports = {
    createLanguageSection,
    createSectionTable,
};
