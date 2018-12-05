/*
** Manage the localization related operations 
** Terry Chan
** 05/12/2018
*/

/* Get a label from i18n translator with the complex namespace
** namespace rules:
** 1. listname+prefix(field/heading)+labelname
** 2. prefix(field/heading)+labelname
** fulfill one of the above case, otherwise use the original content/label to display
*/
const getTranslatedLabel = (translator, options = {}) => {
	const { listKey, prefix, content, altContent } = options;
	var { namespace } = options;
	namespace = namespace ? `${namespace}:` : '';
	var localeLabelKey = `${listKey}-${prefix}-${content}`;
	var fullLocaleLabelKey = `${namespace}${localeLabelKey}`;
	
	var localeLabel = translator(fullLocaleLabelKey);
	// console.log(exists);
	if (localeLabel !== localeLabelKey) {
		return localeLabel;
	} else {
		localeLabelKey = `${prefix}-${content}`;
		fullLocaleLabelKey = `${namespace}${localeLabelKey}`;
		localeLabel = translator(fullLocaleLabelKey);
		if (localeLabel !== localeLabelKey) {
			return localeLabel;
		}
	}
	return altContent || content;
}

module.exports = {
	getTranslatedLabel,
};
