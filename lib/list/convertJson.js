/*
** [******19/11/2018 Deprecated********]
** Revamped Version to use await promise
** Terry Chan
** 19/11/2018
*/

const convertJson = param => {
	var data;
    try {
        data = JSON.parse(param);
    } catch (e) {
    	data = param;
    }
    return data;
}

module.exports = convertJson;
