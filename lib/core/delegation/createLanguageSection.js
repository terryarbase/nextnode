// const keystone = require('keystone');
// const PermissionType = require('./../enum/PermissionType');
// const Types = keystone.Field.Types;
const _ = require('lodash');
const SectionHandler = {
    field: require('./languageSection/field'),
};
/**
* Language Section Model
* ==========
*/

// nameRequired: only field section need to edit List name, turn off for the rest of section
const createSectionTable = (nextnode, listName, nameRequired) => {
    const Types = nextnode.Field.Types;
    const multilingual = nextnode.get('localization');
    const SectionList = new nextnode.List(listName, {
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
        [`${listName}s`]: {
            type: Types.KeyText,
            required: true,
            initial: true,
            noeditkey: true,
            noeditadd: true,
        },
    };
    if (nameRequired) {
        schema = {
        ...{
            listName: {
                type: Types.Text,
                required: true,
                initial: true,
                noedit: true,
            }, 
        }, ...schema };
    }
    SectionList.add(schema);

    SectionList.register();

    return SectionList;
};

function createLanguageSectionRelatedModel () {
    const nextnode = this;
    // use customerized ordering
    _.forEach(this.Options.section.keys, section => {
        const name = _.startCase(section);
        const list = createSectionTable(nextnode, name);
        if (_.has(SectionHandler, section)) {
            const sectioner = new SectionHandler[section](nextnode, name, section === 'field');
            sectioner.getValue();
        }
    });
    // createSectionTable(nextnode, 'field');

    // _forOwn(allLists, (list, key) =>{
    //     const uiElements = list.uiElements;
    // });
	// SectionList.add(

 //    );

 //    SectionList.register();
}

module.exports = createLanguageSectionRelatedModel;
