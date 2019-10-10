const user 		= require('./user');
const common 	= require('./common');

const api 		= require('../api');

const initialRoute = config => {
	// prvent lost from spreading
	config.api = api;
	user(config);
	common(config);
};

module.exports = initialRoute;
