const user 		= require('./user');
const common 	= require('./common');

const initialRoute = config => {
	user(config);
	common(config);
};

module.exports = initialRoute;
