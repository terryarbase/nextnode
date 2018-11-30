const _ = require('lodash');

/*
** Interface for the language section in the List
** Terry Chan
** 30/11/2018
*/
class LanguageSection {
    constructor(nextnode, listName, list) {
        this.nextnode = nextnode;
        this.localization = nextnode.get('localization');
        this.supportingLang = nextnode.get('support locales');
        this.lists = nextnode.lists;
        this.list = list;
        this.listName = listName;
    }

    /*
    ** get format of key with the pattern as the following
    ** ElementType-ElementValue
    ** Terry Chan
    ** 29/11/2018
    */
    getKeyName(type, value) {
        return `${_.camelCase(type)}-${_.camelCase(value)}`;
    }

    getMultilingual(set) {
        // assign mulitlingual structure
        if (this.localization) {
            return { 
                ...set, 
                ...{ 
                    [this.listName]: _.reduce(this.supportingLang, (a, lang) => {
                        a = {
                            ...a, 
                            ...{
                                [lang]: set[this.listName],
                            },
                        };
                        return a;
                    }, {})
                },
            };
        }
        return set;
    }
};

module.exports = LanguageSection;
