const _ = require('lodash');
const LanguageSection = require('./');

/*
** Handle related input notes or remarks in the List
** Terry Chan
** 30/11/2018
*/
class NoteSection extends LanguageSection{
    constructor(nextnode, listName, list) {
        super(nextnode, listName, list);
    }

    getKeyName(type, value) {
        return `${_.camelCase(this.getName())}-${_.camelCase(value)}`;
    }

    getValue() {
        // return _.map(this.lists, (list, key) => {
            const uiElements = this.list.uiElements;
            const list = _.reduce(uiElements, (a, ele) => {
                const { type } = ele;
                if (type === 'field') {
                    const { field: { path, options: { note } } } = ele;
                    if (note) {
                        a = [
                            ...a, 
                            ...[{
                                key: this.getKeyName(type, path),
                                value: note,
                            }]
                        ];
                    }
                }
                return a;
            }, []);
            // assign mulitlingual structure if needed
            return this.getMultilingual({
                [this.listName]: list,
            })[this.listName];
       // });
    }

    getName() {
        return 'note';
    }
};

module.exports = NoteSection;
