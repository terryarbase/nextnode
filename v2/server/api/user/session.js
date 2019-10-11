const _ 			= require('lodash');
/*
** Initial the client's side for the member session
** Terry Chan
** 11/09/2019
*/
const session = async ({
	nextnode,
	req,
	res,
}) => {
    // get config information
    const {
		api: {
			common: {
				info: InfoAPI,
			},
		},
	} = nextnode.get('nextnode v2');

	// get the common app info after login
	const data = new InfoAPI({
		nextnode,
		req,
		res,
	}).getInfo();

	res.json({
		data,
	});
}

module.exports = session;
