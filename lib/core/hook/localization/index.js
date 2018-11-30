const fs 	= require('fs');
const _		= require('lodash');
const localization = require('../../../handler/staticGenerator/localization');

const processLog = (msg, err, quit) => {
	console.log('> ', msg);
	console.log('> ', err);
	if (quit) {
		process.exit(1);
	}
};

function LocalizationHook (schema, options) {
	schema.post('save', async function (doc) {
		const langHandler = new localization(options.node, options.schema.model);
		// export file
		const { load, error } = await langHandler.exportLanguageStatic();
		// console.log(load, error);
		if (load && error) {
			processLog('> Cannot query Languages from the Localization Collection', error, true);
		} else if (error) {
			processLog('> Cannot write the Static Language File.', error, true);
		}
  	});
}



module.exports = LocalizationHook;
