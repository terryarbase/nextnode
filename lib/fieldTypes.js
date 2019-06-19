var fields = {
	// get AzureFile () { return require('../fields/types/azurefile/AzureFileType'); },
	get Boolean () { return require('../fields/types/boolean/BooleanType'); },
	get CloudinaryImage () { return require('../fields/types/cloudinaryimage/CloudinaryImageType'); },
	get CloudinaryImages () { return require('../fields/types/cloudinaryimages/CloudinaryImagesType'); },
	get Code () { return require('../fields/types/code/CodeType'); },
	get Color () { return require('../fields/types/color/ColorType'); },
	get Date () { return require('../fields/types/date/DateType'); },
	get DateArray () { return require('../fields/types/datearray/DateArrayType'); },
	get Datetime () { return require('../fields/types/datetime/DatetimeType'); },
	get Email () { return require('../fields/types/email/EmailType'); },
	get Embedly () { return require('../fields/types/embedly/EmbedlyType'); },
	get File () { return require('../fields/types/file/FileType'); },
	get GeoPoint () { return require('../fields/types/geopoint/GeoPointType'); },
	get Html () { return require('../fields/types/html/HtmlType'); },
	get Key () { return require('../fields/types/key/KeyType'); },
	// get LocalFile () { return require('../fields/types/localfile/LocalFileType'); },
	// get LocalFiles () { return require('../fields/types/localfiles/LocalFilesType'); },
	get Location () { return require('../fields/types/location/LocationType'); },
	get Markdown () { return require('../fields/types/markdown/MarkdownType'); },
	get Money () { return require('../fields/types/money/MoneyType'); },
	get Name () { return require('../fields/types/name/NameType'); },
	get Number () { return require('../fields/types/number/NumberType'); },
	get NumberArray () { return require('../fields/types/numberarray/NumberArrayType'); },
	get Password () { return require('../fields/types/password/PasswordType'); },
	get Relationship () { return require('../fields/types/relationship/RelationshipType'); },
	get S3File () { return require('../fields/types/s3file/S3FileType'); },
	get Select () { return require('../fields/types/select/SelectType'); },
	get Text () { return require('../fields/types/text/TextType'); },
	get TextArray () { return require('../fields/types/textarray/TextArrayType'); },
	get Textarea () { return require('../fields/types/textarea/TextareaType'); },
	get Url () { return require('../fields/types/url/UrlType'); },
	/*
	** Customized Schema Types
	** Terry Chan
	** 29/11/2018
	*/
	get KeyText () { return require('../fields/types/keytext/KeyTextType'); },
	/*
	** Customized Schema Types
	** Terry Chan
	** 30/01/2019
	*/
	get DateRange () { return require('../fields/types/daterange/DateRangeType'); },
	get DateTimeRange () { return require('../fields/types/datetimerange/DateTimeRangeType'); },
	// TODO
	// add multilingual for the field child if its type is supporting multilingual	
	get List () { return require('../fields/types/list/ListType'); },

	// ObjectType added by Fung Lee 11/06/2019
	get Object () { return require('../fields/types/object/ObjectType'); },
};

module.exports = fields;
