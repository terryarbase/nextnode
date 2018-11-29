const _ = require('lodash');
const LanguageSection = require('./');

/*
** Handle related input notes or remarks in the List
** Terry Chan
** 30/11/2018
*/
class NoteSection extends LanguageSection{
    constructor(nextnode, listName) {
        super(nextnode, listName);
    }

    getValue() {
        return _.map(this.lists, (list, key) => {
            const uiElements = list.uiElements;
            const set = {
                [this.listName]: _.reduce(uiElements, (a, ele) => {
                    const { type } = ele;
                    if (type === 'field') {
                        const { field: { options: { note }, label } } = ele;
                        if (note) {
                            a = [
                                ...a, 
                                ...[{
                                    key: this.getKeyName(type, label),
                                    value: note,
                                }]
                            ];
                        }
                    }
                    return a;
                }, []),
            }
            // assign mulitlingual structure if needed
            return this.getMultilingual(set);
        });
    }
};

module.exports = NoteSection;
