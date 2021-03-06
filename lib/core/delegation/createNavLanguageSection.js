// const keystone = require('keystone');
// const PermissionType = require('./../enum/PermissionType');
// const Types = keystone.Field.Types;
const _ = require('lodash');
const SectionHandler = {
    list: require('./languageSection/list'),
    note: require('./languageSection/note'),
    // TODO placeholder
    // placeholder: require('./languageSection/placeholder'),
};
const plugin        = require('./../hook/navigationLanguage');
const NavigationSectionGenerator = require('./../../handler/staticGenerator/navigationLanguage');
/**
* Language Section Model
* ==========
*/
// nameRequired: only field section need to edit List name, turn off for the rest of section
const createNavSectionTable = (nextnode, listName) => {
    const Types = nextnode.Field.Types;
    const multilingual = nextnode.get('localization');
    const NavSectionList = new nextnode.List('NavigationLanguage', {
        track: true,
        noscale: true,
        nodelete: true,
        nocreate: true,
        noimport: true,
        nodownload: true,
        multilingual,
        map: {
            name: 'label',
        },
        isCore: true,
        searchFields: 'navigation, label',
        defaultColumns: 'label, updatedAt',
        defaultSort: '-updatedAt',
    });

    NavSectionList.add({
        navigation: {
            type: Types.Text,
            required: true,
            initial: true,
            noedit: true,
            multilingual: false,
        },
        label: {
            type: Types.Text,
            required: true,
            initial: true,
        },
    });

    NavSectionList.register({ plugin });

    return NavSectionList;
};

const getCurrentNavSection = async (list) => {
    return await list.model.find();
};

const insertNavSections = async (list, sections) => {
    return await list.model.insertMany(sections);
};

const updateNavSection = async (list, id, section) => {
    return await list.model.update({ _id: id }, section);
};

/*
** @Array: document remove actions
** Construct the document action to any current navigation section
** which is no longer to use in the app section
** Terry Chan
** 02/12/2018
*/
const getNoExistingSections = (currentSection, newSection) => {
    return _.differenceBy(
            currentSection, 
            newSection, 'navigation'
        ).reduce((a, s) => {
            // console.log('>>>>>> remove it: ', s);
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
const getNewSections = (nextnode, list, currentSection, newSection) => {
    const multilingual = nextnode.get('localization');

    return _.reduce(newSection, (a, section) => {
        const existing = _.find(currentSection, s => s.navigation === section.navigation);
        // new section for languages
        if (!existing) {
            a = [ ...a, insertNavSections(list, [section]) ];
        } else if (multilingual) {
            // union by unique object with multilingual
            existing.set('label', _.fromPairs(
                _.keys(section.label)
                .map(
                    // construct to [lang, union keytext array]
                    k => [
                        k,
                        // use existing key 
                        existing.label[k] || section.label[k],
                    ]
                )
            ));
            a = [ ...a, existing.save()];
        } else {
            existing.set('label', existing.label);
            a = [ ...a, existing.save()];
            // || section.label);
        }
        //console.log(existing);
        return a;
    }, []);
};

const executeSections = async (nextnode, list, newSection) => {
    const multilingual = nextnode.get('localization');
    const currentSection = await getCurrentNavSection(list);
    var result;
    if (!currentSection.length) {
        result = await insertNavSections(list, newSection);
        console.log('> [Navigation Language Section] Insert initial navigation language section');
        return;
    }
    return Promise.all([
        // remove all of no longer exists section from newSection
        ...getNoExistingSections(currentSection, newSection), 
        // prepare insert/update process the whole set of section
        ...getNewSections(nextnode, list, currentSection, newSection),
    ]);
};

const getNewNavigationList = nextnode => {
    const multilingual = nextnode.get('localization');
    const supportingLanguage = nextnode.get('support locales');
    // const newNav = {
    //     ...nextnode.reservedCollections(),
    //     ...nextnode.get('nav'),
    // };
    const newNav = nextnode.mergeNavOptionWithReservedCollections();
    return _.keys(newNav).map(nav => {
        if (multilingual) {
            return {
                navigation: nav,
                // convert to { en: 'nav', zhtw: 'nav' }
                label: _.fromPairs(
                    _.map(supportingLanguage, lang => [lang, _.startCase(nav)])
                ),
            };
        }
        return {
            navigation: nav,
            label: nav,
        };
    });
};

function createNavLanguageSection (nextnode) {
    // const nextnode = this;
    const currentlyList = nextnode.lists && nextnode.lists['NavigationLanguage'];
    // use customerized ordering
    const list = currentlyList || createNavSectionTable(nextnode);
    const value = getNewNavigationList(nextnode);

    // after create the list then create the relative data
    if (currentlyList) {
        return executeSections(nextnode, list, value).then(
            result => new NavigationSectionGenerator(nextnode, list.model).exportNavSectionStatic()
        ).catch(err => {
            console.log('> [Navigation Language Section] Cannot create navigation language section.');
            console.log(err);
            process.exit(1);
        });
    }
    // (async () => {
    //     try {
    //         await executeSections(nextnode, list, value);
    //         return new NavigationSectionGenerator(nextnode, list.model).exportNavSectionStatic();
    //     } catch (err) {
    //         console.log('> [Navigation Language Section] Cannot create navigation language section.');
    //         console.log(err);
    //         process.exit(1);
    //     };
    // })();
}

module.exports = {
    createNavLanguageSection,
    createNavSectionTable,
};
