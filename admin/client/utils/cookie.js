/**
 * Mangament Cookie session
 * Terry Chan
 * 28/11/2018
 */
import Cookies from 'universal-cookie';

const setCookie = (name, value, options) => {
	const cookies = new Cookies();
	cookies.set(name, value, options);
	// console.log(getCookie(name));
	window.console.warn(`[Cookie/${name}]: saving language: ${value}`);
	window.console.warn('[Cookie/'+name+'] options:', options);
};

const getCookie = name => {
	const cookies = new Cookies();
	return cookies.get(name, { path: '/' });
};

const setUILanguage = (value, options = {}) => {
	// window.console.warn(`[Cookie/${Keystone.currentUILanguageName}]: set current UI language: ${value}`);
	setCookie(Keystone.currentUILanguageName, value, {
		...Keystone.languageCookieOptions,
		...options,
	});
};

const getUILanguage = () => {
	const value = getCookie(Keystone.currentUILanguageName);
	// window.console.warn(`[Cookie/${Keystone.currentUILanguageName}]: get current UI language: ${value}`);
	return value;
};

const setDataLanguage = (value, options = {}) => {
	// window.console.warn(`[Cookie/${Keystone.currentLanguageName}]: set current data language: ${value}`);
	setCookie(Keystone.currentLanguageName, value, {
		...Keystone.languageCookieOptions,
		...options,
	});
};

const getDataLanguage = () => {
	const value = getCookie(Keystone.currentLanguageName);
	// window.console.warn(`[Cookie/${Keystone.currentLanguageName}]: get current data language: ${value}`);
	return value;
};

export {
	setCookie,
	getCookie,
	setUILanguage,
	setDataLanguage,
	getDataLanguage,
	getUILanguage,
};
