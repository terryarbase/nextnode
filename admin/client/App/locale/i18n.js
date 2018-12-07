import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// language packs
import locales from "./";

i18n.use(LanguageDetector).init({
// we init with resources
	resources: locales,

	// direct use server cookie 
	lng: Keystone.currentUILanguage || 'en',
	fallbackLng: Keystone.currentUILanguage || 'en',
	debug: false,
	
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
		nsMode: 'fallback',
	}
});

export default i18n;
