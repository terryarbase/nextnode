const { Map } = require('immutable');
const ImmutableType = require('./');
/*
** The common options list for Types.Select
** Environment Use
** Terry Chan
** 27/11/2018
*/
class Environment extends ImmutableType {
	constructor(node) {
		const type = Map({
			localhost: {
				value: 'localhost',
				label: 'Localhost',
			},
			development: {
				value: 'developemnt',
				label: 'Development',
			},
			beta: {
				value: 'beta',
				label: 'Beta',
			},
			uat: {
				value: 'uat',
				label: 'UAT',
			},
			preproduction: {
				value: 'preproduction',
				label: 'Pre-Production',
			},
			production: {
				value: 'production',
				label: 'Production',
			},
		});
		super(node);
		super.initialize({ type });
	}
} 

module.exports = nextnode => new Environment(nextnode);
