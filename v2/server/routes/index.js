const nextnode  = require('./../../../');

const user 		= require('./user');
const common 	= require('./common');
const list 		= require('./list');

const api 		= require('../api');

const initialRoute = config => {
	// prvent lost from spreading
	config.api = api;
	common(config);
	user({
		...config,
		apiVersion: `v${nextnode.get('stage')}`,
	});
	list(config);
};

module.exports = initialRoute;
