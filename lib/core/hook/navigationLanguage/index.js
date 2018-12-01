const fs 	= require('fs');
const _		= require('lodash');
const NavLanguage = require('../../../handler/staticGenerator/navigationLanguage');

const processLog = (msg, err, quit) => {
	console.log('> ', msg);
	console.log('> ', err);
	if (quit) {
		process.exit(1);
	}
};

function NavLanguageHook (schema, options) {
	schema.post('save', async function (doc) {
		const navLanguage = new NavLanguage(options.node, options.schema.model);
		// export file
		const { load, error } = await navLanguage.exportNavSectionStatic();
		// console.log(load, error);
		if (load && error) {
			processLog('> Cannot query Navigation Language Section from the Navigation-Language Collection', error, true);
		} else if (error) {
			processLog('> Cannot write the Static Navigation Language Section File.', error, true);
		}
  	});
}



module.exports = NavLanguageHook;
