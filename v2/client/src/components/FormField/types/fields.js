import boolean from './boolean/BooleanField';
import cloudinaryimage from './cloudinaryimage/CloudinaryImageField';
import cloudinaryimages from './cloudinaryimages/CloudinaryImagesField';
import code from './code/CodeField';
import color from './color/ColorField';
import date from './date/DateField';
import datearray from './datearray/DateArrayField';
import datetime from './datetime/DatetimeField';
import email from './email/EmailField';
// import embedly from './embedly/EmbedlyField';
import file from './file/FileField';
import geopoint from './geopoint/GeoPointField';
import html from './html/HtmlField';
import key from './key/KeyField';
import location from './location/LocationField';
// import markdown from './markdown/MarkdownField';
import money from './money/MoneyField';
import name from './name/NameField';
import number from './number/NumberField';
import numberarray from './numberarray/NumberArrayField';
import password from './password/PasswordField';
import relationship from './relationship/RelationshipField';
import select from './select/SelectField';
import text from './text/TextField';
import textarray from './textarray/TextArrayField';
import textarea from './textarea/TextareaField';
import url from './url/UrlField';
import keytext from './keytext/KeyTextField';
import daterange from './daterange/DateRangeField';
import datetimerange from './datetimerange/DateTimeRangeField';
import list from './list/ListField';
import object from './object/ObjectField';

export default {
	textarray,
	text,
	textarea,
	url,
	keytext,
	KeyText: keytext,
	daterange,
	datetimerange,
	list,
	object,
	location,
	// markdown,
	money,
	name,
	number,
	numberarray,
	password,
	relationship,
	select,
	key,
	boolean,
	cloudinaryimage,
	cloudinaryimages,
	code,
	color,
	date,
	datearray,
	datetime,
	email,
	// embedly,
	file,
	geopoint,
	html,
};
