/**
 * Check whether or not field is supporting multilingual
 */

function isMultilingual (type) {
	const types = this.keystone.Field.Types;
	const localizationType = [
		types.Text.name,
                types.Textarea.name,
                types.TextArray.name,
                types.Html.name,
                types.Url.name,
                types.Name.name,
                types.File.name,
	];
	return localizationType.indexOf(type) >= 0;
}

module.exports = isMultilingual;
