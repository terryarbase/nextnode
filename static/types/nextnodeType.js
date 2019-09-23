const { Map } = require('immutable');
const ImmutableType = require('./');
/*
** The common options list for Types.Select
** Next-nodecms data Type Use
** Terry Chan
** 27/11/2018
*/
class NextNodeTypes extends ImmutableType {
	constructor(node) {
		const type = Map({
			boolean: {
				value: 'Boolean',
				label: 'Boolean',
				key: 'select_option_nextnode_boolean',
			},
			cloudinaryImage: {
				value: 'CloudinaryImage',
				label: 'Cloudinary Image',
				key: 'select_option_nextnode_cloudinaryImage',
			},
			cloudinaryImages: {
				value: 'CloudinaryImages',
				label: 'cloudinary Images',
				key: 'select_option_nextnode_cloudinaryImages',
			},
			code: {
				value: 'Code',
				label: 'Code',
				key: 'select_option_nextnode_code',
			},
			color: {
				value: 'Color',
				label: 'Color',
				key: 'select_option_nextnode_color',
			},
			date: {
				value: 'Date',
				label: 'Date',
				key: 'select_option_nextnode_date',
			},
			datearray: {
				value: 'DateArray',
				label: 'Date Array',
				key: 'select_option_nextnode_datearray',
			},
			daterange: {
				value: 'DateRange',
				label: 'Date Range',
				key: 'select_option_nextnode_daterange',
			},
			datetime: {
				value: 'Datetime',
				label: 'Date & Time',
				key: 'select_option_nextnode_datetime',
			},
			datetimerange: {
				value: 'DateTimeRange',
				label: 'Date & Time Range',
				key: 'select_option_nextnode_datetimerange',
			},
			email: {
				value: 'Email',
				label: 'Email',
				key: 'select_option_nextnode_email',
			},
			embedly: {
				value: 'Embedly',
				label: 'Embedly',
				key: 'select_option_nextnode_code',
			},
			file: {
				value: 'File',
				label: 'file',
				key: 'select_option_nextnode_file',
			},
			geopoint: {
				value: 'GeoPoint',
				label: 'Geo Point',
				key: 'select_option_nextnode_geopoint',
			},
			html: {
				value: 'Html',
				label: 'HTML',
				key: 'select_option_nextnode_html',
			},
			key: {
				value: 'Key',
				label: 'Key',
				key: 'select_option_nextnode_key',
			},
			keytext: {
				value: 'KeyText',
				label: 'Key Text',
				key: 'select_option_nextnode_keytext',
			},
			list: {
				value: 'List',
				label: 'List',
				key: 'select_option_nextnode_list',
			},
			location: {
				value: 'Location',
				label: 'Location',
				key: 'select_option_nextnode_location',
			},
			markdown: {
				value: 'Markdown',
				label: 'Markdown',
				key: 'select_option_nextnode_markdown',
			},
			money: {
				value: 'Money',
				label: 'Money',
				key: 'select_option_nextnode_money',
			},
			name: {
				value: 'Name',
				label: 'Name',
				key: 'select_option_nextnode_name',
			},
			number: {
				value: 'Number',
				label: 'Number',
				key: 'select_option_nextnode_number',
			},
			numberarray: {
				value: 'NumberArray',
				label: 'NumberArray',
				key: 'select_option_nextnode_numberarray',
			},
			password: {
				value: 'Password',
				label: 'Password',
				key: 'select_option_nextnode_password',
			},
			relationship: {
				value: 'Relationship',
				label: 'Relationship',
				key: 'select_option_nextnode_relationship',
			},
			select: {
				value: 'Select',
				label: 'Select',
				key: 'select_option_nextnode_select',
			},
			text: {
				value: 'Text',
				label: 'Text',
				key: 'select_option_nextnode_text',
			},
			textarray: {
				value: 'TextArray',
				label: 'Text Array',
				key: 'select_option_nextnode_textarray',
			},
			url: {
				value: 'URL',
				label: 'URL',
				key: 'select_option_nextnode_url',
			},
			object: {
				value: 'Object',
				label: 'Object',
				key: 'select_option_nextnode_object',
			},
		});
		super(node);
		super.initialize({ type, isTransfer: true });
	}
} 

module.exports = nextnode => new NextNodeTypes(nextnode);
