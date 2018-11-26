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
                types.Email.name,
                types.Code.name,
                types.File.name,
                types.Color.name,
                types.CloudinaryImage.name,
                types.CloudinaryImages.name,
                types.Location.name,
	];
	return localizationType.indexOf(type) >= 0;
}

module.exports = isMultilingual;
