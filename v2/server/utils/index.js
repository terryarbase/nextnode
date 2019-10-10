
/*
** Identify the validator is error callback function
** if so, return to main flow and execute it
** Terry Chan
** 09-05-2019
*/
const isValidatorError = result => result && typeof result === 'function';

module.exports = {
	isValidatorError,
};
