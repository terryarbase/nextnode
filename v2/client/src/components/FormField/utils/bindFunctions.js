/*
	Tidier binding for component methods to Classes
	===============================================

	constructor() {
		super();
		bindFunctions.call(this, ['handleClick', 'handleOther']);
	}
*/

const bindFunctions = functions => {
	functions.forEach(f => (this[f] = this[f].bind(this)));
};

export default bindFunctions;
