const _ 			= require('lodash');
const nextnode 		= require('../../');
const Types 		= require('../fieldTypes');

/*
** [ADDON] assign pre-defined SystemIdentity field
** if the identification is turned on
** Terry Chan
** 05/05/2019
*/
module.exports = function identification() {

	const list = this;
	const options = list.get('identification');

	if (!options) {
		// if the track setting is falsy, bail
		return;
	}

	// add track fields to schema
	list.add(
		"Permission Information",
		{
			identifiedBy: {
				type: Types.Relationship,
				ref: 'SystemIdentity',
				initial: true,
			},
		}
	);


};
