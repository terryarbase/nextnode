const fs 	= require('fs');
const _		= require('lodash');
const AppLanguage = require('../../../handler/staticGenerator/appLanguage');

const processLog = (msg, err, quit) => {
	console.log('> ', msg);
	console.log('> ', err);
	if (quit) {
		process.exit(1);
	}
};

function AppLanguageHook (schema, options) {
	schema.post('save', async function (doc) {
		const appLanguage = new AppLanguage(options.node, options.schema.model);
		// export file
		const { load, error } = await appLanguage.exportSectionStatic();
		// console.log(load, error);
		if (load && error) {
			processLog('> Cannot query App Language Section from the App-language Collection', error, true);
		} else if (error) {
			processLog('> Cannot write the Static App Language Section File.', error, true);
		}
  	});
}



module.exports = AppLanguageHook;
