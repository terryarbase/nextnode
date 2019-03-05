// const nextnode = require('next-nodecms');
// const PermissionType = require('./../enum/PermissionType');
// const Types = keystone.Field.Types;
const _find = require('lodash/find');
const _keys = require('lodash/keys');
const _map = require('lodash/map');
const _forOwn = require('lodash/forOwn');

/**
* Country Model
* ==========
*/
let delegatedCountry = {
    country: 'Hong Kong',
    code: '+852',
    delegated: true,
}


const createDelegatedCountry= async (node, model) => {
    try {
        let delegated = await model.findOne({ delegated: true });
        if (!delegated) {
            delegated = await new model(delegatedCountry).save(); 
            console.log(`> [Country List] Create a delegated country: ${delegated.code}`);
        } else {
            console.log('> [Country List] Delegated country and no need to create');
        }
    } catch (err) {
        console.log('> [Country List] Cannot create a delegated country entry.');
        console.log(err);
        process.exit(1);
    }
};

async function createCountryModel (countryModelName) {
    const nextNode = this;
    const Types = nextNode.Field.Types;
    
    const multilingual = nextNode.get('localization');
    if (multilingual) {
        delegatedCountry = {
            ...delegatedCountry,
            country: {
                [nextNode.get('locale')]: 'Hong Kong',
            }
        }
    }
    delegatedCountry = {
        ...delegatedCountry,
        _id: nextNode.mongoose.Types.ObjectId('5c7ce286d080dd49e0a8f02c'),
    };
    const CountryList = new nextNode.List(countryModelName, {
        track: true,
        noscale: true,
        // nodelete: true,
        // nocreate: true,
        // nodownload: true,
        multilingual,
        map: {
            name: 'code',
        },
        isCore: true,
        searchFields: 'country, code',
        defaultColumns: 'country, code, updatedAt',
        defaultSort: '-updatedAt',
    });

    CountryList.add({
        country: {
            type: Types.Text,
            required: true,
            restrictDelegated: true,
            initial: true,
        },
        code: {
            type: Types.Text,
            required: true,
            initial: true,
            restrictDelegated: true,
            multilingual: false,
        },
        delegated: { 
            restrictDelegated: true,
            type: Types.Boolean,
            noedit: true,
            hidden: true, 
        },
    });

    CountryList.register();

    return createDelegatedCountry(nextNode, CountryList.model);
}

module.exports = createCountryModel;
