import _ from "lodash";
// locales
import i18n from "./../i18n";

const delimiter = '_';
const otherDelimiter = '-';		// non-menu item

const getFromLocale = (prefix, key) => i18n.t(`${prefix}.${key}`);

const concatKey = (paths, d) => paths.join(d);

const getTranslation = (prefix, paths, d=delimiter) => {
	const key = concatKey(paths, d);
	return getFromLocale(prefix, key);
}

// get the target translated text with section_ prefix for the menu item
export const translateSection = sectionName => getTranslation('menu', [
	'section',
	sectionName,
]);

// get the target translated text with table_ prefix for the table list
export const translateListName = listName => getTranslation('list', [
	'table',
	listName,
]);

/*
** Get the field translation value for the type of field
** Terry Chan
** 21/10/2019
*/
export const translateListField = (listName, field, title='') => {
	const ops = [
		'field',
		_.camelCase(field),
	];
	let keyWithListName = getTranslation('list', [
		listName,
		...ops,
	], otherDelimiter);
	// console.log(i18n.translations);
	// special handle for the delegated field name (e.g. field-updateAt, field-createdBy etc)
	if (!keyWithListName) {
		// remove the List name prefix
		keyWithListName = getTranslation('list', ops, otherDelimiter);

	}
	return keyWithListName || title;
};
const translateListCommon = (listName, type, content) => {
	const value = getTranslation('list', [
		type,
		_.camelCase(content),
	], otherDelimiter);

	// if the translation cannot be found and return the original content
	return value || content;
}
/*
** Get the heading translation value for the type of heading
** Terry Chan
** 21/10/2019
*/
export const translateListHeading = (listName, content) => translateListCommon(listName, 'heading', content);
export const translateListNote = (listName, content) => translateListCommon(listName, 'note', content);
