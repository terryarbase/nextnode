const _ = require('lodash');
/*
** prepare identity field value for the current user
** Terry Chan
** 19/11/2018
*/
function prepareDataPermission ({
	user,
}, bodyParam) {
	const {
		delegated,
		identity,
	} = user;
	// system delegated user, no need to force identifiedBy field
	if (!delegated) {
		const isIdentification = this.get('identification');
		if (isIdentification){
			bodyParam.identifiedBy = String(identity);
		}
	}
}

module.exports = prepareDataPermission;
