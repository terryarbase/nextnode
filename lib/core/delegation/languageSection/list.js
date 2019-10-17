const _ = require('lodash');
const LanguageSection = require('./');
const SectionHandler = {
    note: require('./note'),
    // TODO placeholder
    // placeholder: require('./languageSection/placeholder'),
};
/*
** Handle related field name or header label in the List
** Terry Chan
** 30/11/2018
*/
class ListSection extends LanguageSection{
    constructor(nextnode, listName) {
        super(nextnode, listName);
    }

    getValue() {
        return _.map(this.lists, (list, key) => {
            const notes = new SectionHandler.note(this.nextnode, key, list);
            const set = {
                listName: key,
                listLabel: this.localization ? 
                _.fromPairs(_.map(this.supportingLang, l => [l, key])) : key,
                [this.listName]: this.getMultilingual({
                    [this.listName]: _.reduce(list.uiElements, (a, ele) => {
                        const { type } = ele;
                        if (type === 'heading'
                            && !this.nextnode.isReservedLanguageSectionFields(ele.heading)) {
                            a = [
                                ...a, 
                                {
                                    key: this.getKeyName(type, ele.heading),
                                    value: ele.heading,
                                },
                            ];
                        } else if (type === 'field'
                            && !this.nextnode.isReservedLanguageSectionFields(ele.field.path)) {
                            // console.log(ele.field);
                            a = [
                                ...a,
                                {
                                    key: this.getKeyName(type, ele.field.path),
                                    /*
                                    ** add spaces before capital letter for the human read
                                    ** Terry Chan
                                    ** 17/10/2019
                                    */
                                    value: (ele.field.label || '').split(/(?=[A-Z])/).join(' '),
                                },
                            ];
                        }
                        return a;
                    }, []),
                })[this.listName],
                [notes.getName()]: notes.getValue(),
            }
            // assign mulitlingual structure if needed
            return set;
        });
    }

};

module.exports = ListSection;
