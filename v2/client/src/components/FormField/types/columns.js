import boolean from './boolean/BooleanColumn';
import cloudinaryimage from './cloudinaryimage/CloudinaryImageColumn';
import cloudinaryimages from './cloudinaryimages/CloudinaryImagesColumn';
import code from './code/CodeColumn';
import color from './color/ColorColumn';
import date from './date/DateColumn';
import datearray from './datearray/DateArrayColumn';
import datetime from './datetime/DatetimeColumn';
import email from './email/EmailColumn';
// import embedly from './embedly/EmbedlyColumn';
import file from './file/FileColumn';
import geopoint from './geopoint/GeoPointColumn';
import html from './html/HtmlColumn';
import key from './key/KeyColumn';
import location from './location/LocationColumn';
import markdown from './markdown/MarkdownColumn';
import money from './money/MoneyColumn';
import name from './name/NameColumn';
import number from './number/NumberColumn';
import numberarray from './numberarray/NumberArrayColumn';
import password from './password/PasswordColumn';
import relationship from './relationship/RelationshipColumn';
import select from './select/SelectColumn';
import text from './text/TextColumn';
import textarray from './textarray/TextArrayColumn';
import textarea from './textarea/TextareaColumn';
import url from './url/UrlColumn';
import keytext from './keytext/KeyTextColumn';
import daterange from './daterange/DateRangeColumn';
import datetimerange from './datetimerange/DateTimeRangeColumn';
import list from './list/ListColumn';
import object from './object/ObjectColumn';
import invalidColumn from './../components/columns/InvalidColumn';
import IDColumn from './../components/columns/IdColumn';

export default {
	unrecognised: invalidColumn,
	id: IDColumn,
	textarray,
	text,
	textarea,
	url,
	keytext,
	daterange,
	datetimerange,
	list,
	object,
	location,
	markdown,
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
