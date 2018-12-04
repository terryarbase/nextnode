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
	const tableLocaleLabelKey = `${listKey}-${prefix}-${content}`;
	const tableLocaleLabel = translator(tableLocaleLabelKey);
	// console.log(exists);
	// console.log('tableLocaleLabel ', tableLocaleLabelKey, t(tableLocaleLabelKey));
	if (tableLocaleLabel !== tableLocaleLabelKey) {
		return tableLocaleLabel;
	} else {
		const globalLocaleLabelKey = `${prefix}-${content}`;
		const globalLocaleLabel = translator(globalLocaleLabelKey);
		if (globalLocaleLabelKey !== globalLocaleLabel) {
			return globalLocaleLabel;
		}
	}
	return altContent || content;
}

module.exports = {
	getTranslatedLabel,
};
