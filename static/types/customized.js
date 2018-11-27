const _ = require('lodash');
const { Map, List, Seq } = require('immutable');
const nextnode = require('./../../');
const ImmutableType = require('./');
/*
** The customized options list for Types.Select
** User must define their mapping option list for use
** Customized Use
** Terry Chan
** 27/11/2018
*/
class Customized extends ImmutableType {
	constructor(options = [], languagePack) {
		super(nextnode);
		const type = this.validateFormat(options);
		this.initialize({ ...type, languagePack });
	}
	initialize(options) {
		const { languagePack, isTransfer } = options;
		const isLocalization = nextnode.get('localization');
		if (isLocalization && isTransfer && !languagePack) {
			throw new Error(`Your Customized Option is missing language pack for the mapping.`);
		} else if (!isLocalization) {
			options = {
				...options,
				...{
					isTransfer: false,
					languagePack: null,
				},
			};
		}
		super.initialize(options);
	}
	/*
	** Validate the format of provided options
	** Terry Chan
	** 27/11/2018
	*/
	validateFormat(options) {
		const value = this.getProperlyValue(options);
		var isTransfer = false;
		_.forEach(value, (v, i) => {
			// if directly provide object then ignore the isTransfer
			if (v.key && typeof v.label !== 'object') {
				isTransfer = true;
			}
			if (!v.value || !v.label) {
				throw new Error(`Option: ${i+1} is missing value or label field. Please adjust the customized option first.`);
			}
		});
		return { type: List(value), isTransfer };
	}

	getProperlyValue(options) {
		if (_.isArray(options)) {
			return options;
		}
		// return Map(options);
		var newOptions = options;
		if (!newOptions instanceof Map || newOptions instanceof List) {
			newOptions = options.toJS();
		}
		return _.values(newOptions);
	}

}

module.exports = Customized;
