const _ = require('lodash');

class field {
    constructor(nextnode, listName) {
        this.localization = nextnode.get('localization');
        this.supportingLang = nextnode.get('support locales');
        this._lists = nextnode.lists;
        this._listName = listName;
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

    getValue() {
        return _.map(this._lists, (list, key) => {
            const uiElements = list.uiElements;
            var set = {
                listname: key,
                [this._listName]: _.reduce(uiElements, (a, ele) => {
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
            // assign mulitlingual structure
            if (this.localization) {
                set = { 
                    ...set, 
                    ...{ 
                        [this._listName]: _.reduce(this.supportingLang, (a, lang) => {
                            a = {
                                ...a, 
                                ...{
                                    [lang]: set[this._listName],
                                },
                            };
                            return a;
                        }, {})
                    },
                };

                console.log(set[this._listName]);
            }
            return set;
        });
    }
};

module.exports = field;
