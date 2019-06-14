import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
// language packs
import locales from "./";
// console.log(Keystone.currentUILanguage);
i18n.use(reactI18nextModule).init({
// we init with resources
	resources: locales,

	// direct use server cookie 
	lng: Keystone.currentUILanguage || 'en',
	fallbackLng: Keystone.currentUILanguage || 'en',
	debug: false,

	load: "languageOnly",
	
	// have a common namespace used around the full app
	ns: ["form"],
	defaultNS: "form",
	
	keySeparator: false, // we use content as keys
	
	interpolation: {
		escapeValue: false, // not needed for react!!
		formatSeparator: ","
	},
	
	react: {
		wait: true,
		nsMode: "default"
	}
});

export default i18n;
