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
/**
* Language Section Model
* ==========
*/
var newSections = {

};

// nameRequired: only field section need to edit List name, turn off for the rest of section
const createSectionTable = (nextnode, listName) => {
    const Types = nextnode.Field.Types;
    const multilingual = nextnode.get('localization');
    const SectionList = new nextnode.List('ListLanguage', {
        track: true,
        noscale: true,
        nodelete: true,
        nocreate: true,
        nodownload: true,
        multilingual,
        isCore: true,
        searchFields: 'listName',
        defaultColumns: 'listName, updatedAt',
        defaultSort: '-updatedAt',
    });
    var schema = {
        listName: {
            type: Types.Text,
            required: true,
            initial: true,
        },
    };
    _.forEach(nextnode.Options.section.keys, section => {
        schema = {
            ...schema,
            ...{
               [`${section}s`]: {
                    type: Types.KeyText,
                    required: true,
                    initial: true,
                    noeditkey: true,
                    noeditadd: true,
                }, 
            },
        };
    });
    // if (nameRequired) {
    //     schema = {
    //         ...{
    //             listName: {
    //                 type: Types.Text,
    //                 required: true,
    //                 initial: true,
    //                 noedit: true,
    //             }, 
    //         }, ...schema,
    //     };
    // any child section
    // } else {
    //     schema = {
    //         ...{
    //             list: {
    //                 type: Types.Relationship,
    //                 ref: 'List'
    //                 required: true,
    //                 initial: true,
    //                 noedit: true,

    //             }, 
    //         }, ...schema,
    //     };
    // }
    SectionList.add(schema);

    SectionList.register();

    return SectionList;
};

function createLanguageSectionRelatedModel () {
    const nextnode = this;
    // use customerized ordering
    const list = createSectionTable(nextnode);
    _.forEach(this.Options.section.keys, section => {
        const name = _.startCase(section);
        if (_.has(SectionHandler, section)) {
            const sectioner = new SectionHandler[section](nextnode, name);
            const value = sectioner.getValue();
            if (value.length) {
                _.forEach(value, v=> {
                    console.log(v);
                });
                newSections = {
                    ...newSections,
                    ...{
                        [section]: value,
                    },
                };
            }
        }
    });

    console.log(newSections);
    // createSectionTable(nextnode, 'field');

    // _forOwn(allLists, (list, key) =>{
    //     const uiElements = list.uiElements;
    // });
	// SectionList.add(

 //    );

 //    SectionList.register();
}

module.exports = createLanguageSectionRelatedModel;
