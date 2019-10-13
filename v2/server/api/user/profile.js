
const _                 = require('lodash');

const APIInterface      = require('./../interface');
/*
** Prepare the Member Profile
** Terry Chan
** 13/09/2019
*/
class ProfileHandler extends APIInterface{
    constructor(config) {
        super(config);
    }

    async execute() {
        let data = this.getUserInfo(req.user);
		try {
			const {
				utils: {
					readUserRoleList,
				},
			} = this.nextnode.get('nextnode v2');
		    
			data = {
				...data,
				role: readUserRoleList(data.role),
			};

		} catch (err) {
	    	return res.apiError(500, err);
	    }

	    return res.json({
	    	data,
	    });
    }
}

module.exports = ProfileHandler;
