const _ = require('lodash');
/*
** prepare the correct format to handler
** no matter it multilingual structure or single language structure
** Terry Chan
** 19/11/2018
*/
function prepareCorrectParam (param) {
	const fields = this.fields;
	var newData = {};
	const paramFields = _.keys(param);
	if (paramFields.length) {
		// console.log('paramFields: ', param);
		newData = _.reduce(paramFields, (acc, key) => {
			const field = fields[key];
			// no matter it is json string
			var data = param[key];
			try {
		        data = JSON.parse(data);
		    } catch (e) {
		    }
			if (field) {
				data = field.getValueFromElasticData({
					[key]: data,
				});
			}
			return { ...acc, ...{ [key]: data } };
		}, {});
	}
	return newData;
}

module.exports = prepareCorrectParam;
