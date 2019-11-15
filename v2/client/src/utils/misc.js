import _ from "lodash";
import qs from 'query-string';
import {
  reactLocalStorage,
} from 'reactjs-localstorage';

// configurations
import {
  signin as signinRouteName,
  storageName,
} from "./../config/constants.json";

// locales
import i18n from "./../i18n";

export const pickError = ({
	error,
	language,
	path,
}) => {
	let errorMessage = _.get(error, path);
	// deal with no matter it is object
	const multilingualError = _.get(errorMessage, language);
	if (errorMessage && multilingualError) {
		errorMessage = multilingualError;
	}

	if (typeof errorMessage === 'object') {
		const keys = _.keys(errorMessage);
		if (!!keys.length) {
			errorMessage = errorMessage[keys[0]];
		}
	}
	return errorMessage;
}

export const rejectWithRedirection = (history, redirect=false) => {
	let url = signinRouteName;
	if (redirect) {
		// use native to get the current matching router pathname (e.g. /content/dashboard, /content/post etc)
		let {
	      location: {
	        pathname,
	      },
	    } = window;
	    // the current page is not the signin page
	    if (!_.includes([
	      signinRouteName,
	    ], pathname) && !!pathname) {
	    	pathname = encodeURIComponent(pathname);
	    	// store the forward url in local storage
	    	reactLocalStorage.set(storageName.forwardUrl, pathname);
	    	// url = `${url}?forward=${pathname}`;
	    }
	}

	if (history) {
		// use the given Router
      	history.push(url);
    } else {
      	window.location.href = url;
    }
    // for rendering call
    return null;
}

export const randomColorPicker = () => {
	const randomColor = [
	    '#ffcdd2',
	    '#e1bee7',
	    '#b39ddb',
	    '#c5cae9',
	    '#bbdefb',
	    '#b3e5fc',
	    '#00bcd4',
	    '#4db6ac',
	    '#e6ee9c',
	    '#aed581',
	    '#66bb6a',
	    '#ffb74d',
	    '#ff7043',
	    '#bcaaa4',
	    '#90a4ae',
	    '#ff7043',
	];
	const color = Math.floor(Math.random() * Math.floor(randomColor.length));
	return randomColor[color];
}

export const acceptWithRedirection = history => {
	let {
      location: {
        search,
      },
    } = window;

    search = qs.parse(search);
    let {
		forward: to,
	} = search;
  	to = decodeURIComponent(to);

  	history.push(to);
}

export const getCurrentLanguageInfo = ({
	localization,
	language,
	defaultLanguage,
}) => {
  	const currentLanguage = !language ? i18n.locale : language;
  	// pick the info the chosen UI language, and use the default language if the chosen is not found
 	return _.get(localization, currentLanguage) || _.get(localization, defaultLanguage);
}

export const isActiveLink = (link, pathname) => link && (pathname === link || pathname.indexOf(link) !== -1);
