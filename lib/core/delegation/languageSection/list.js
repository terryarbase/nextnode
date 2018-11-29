const _ = require('lodash');
const LanguageSection = require('./');

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
            const uiElements = list.uiElements;
            const set = {
                listname: key,
                [this.listName]: _.reduce(uiElements, (a, ele) => {
                    const { type } = ele;
                    if (type === 'heading') {
                        a = [
                            ...a, 
                            ...[{
                                key: this.getKeyName(type, ele.heading),
                                value: ele.heading,
                            }]
                        ];
                    } else if (type === 'field') {
                        a = [
                            ...a,
                            ...[{
                                key: this.getKeyName(type, ele.field.label),
                                value: ele.field.label,
                            }]
                        ];
                    }
                    return a;
                }, []),
            }
            // assign mulitlingual structure if needed
            return this.getMultilingual(set);
        });
    }
};

module.exports = ListSection;
