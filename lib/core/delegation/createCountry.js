// const nextnode = require('next-nodecms');
// const PermissionType = require('./../enum/PermissionType');
// const Types = keystone.Field.Types;
const _find                         = require('lodash/find');
const _keys                         = require('lodash/keys');
const _map                          = require('lodash/map');
const _forOwn                       = require('lodash/forOwn');

const declareCustomizedOption       = require('../../list/declareCustomizedOption');

/**
* Country Model
* ==========
*/
// let delegatedCountry = {
//     country: 'Hong Kong',
//     code: '+852',
//     delegated: true,
// }

let delegatedCountry = [
    {
        isoCode: 'HK',
        country: {
            en: 'Hong Kong',
            zhcn: '香港',
            zhtw: '香港'
        },
        ordering: 999,
        enabled: true, code: '+852',
        delegated: true,
    },
    {
        isoCode: 'CN',
        country: {
            en: 'China',
            zhcn: '中国',
            zhtw: '中國'
        },
        ordering: 998,
        enabled: true, code: '+86',
        delegated: false,
    },
    {
        isoCode: 'TW',
        country: {
            en: 'Taiwan',
            zhcn: '台湾',
            zhtw: '台湾；臺灣'
        },
        ordering: 997,
        enabled: true, code: '+886',
        delegated: false,
    },
    {
        isoCode: 'MO',
        country: {
            en: 'Macao',
            zhcn: '澳门',
            zhtw: '澳門'
        },
        ordering: 996,
        enabled: true, code: '+853',
        delegated: false,
    },
    {
        isoCode: 'BD',
        country: {
            en: 'Bangladesh',
            zhcn: '孟加拉国',
            zhtw: '孟加拉'
        },
        enabled: false, code: '+880',
        delegated: false,
    },
    {
        isoCode: 'MX',
        country: {
            en: 'Mexico',
            zhcn: '墨西哥',
            zhtw: '墨西哥'
        },
        enabled: false, code: '+52',
        delegated: false,
    },
    {
        isoCode: 'IL',
        country: {
            en: 'Israel',
            zhcn: '以色列',
            zhtw: '以色列'
        },
        enabled: false, code: '+972',
        delegated: false,
    },
    {
        isoCode: 'FR',
        country: {
            en: 'France',
            zhcn: '法国',
            zhtw: '法國'
        },
        enabled: false, code: '+33',
        delegated: false,
    },
    {
        isoCode: 'IO',
        country: {
            en: 'British Indian Ocean Territory',
            zhcn: '英属印度洋领地',
            zhtw: '英屬印度洋地區'
        },
        enabled: false, code: '+246',
        delegated: false,
    },
    {
        isoCode: 'MY',
        country: {
            en: 'Malaysia',
            zhcn: '马来西亚',
            zhtw: '馬來西亞'
        },
        enabled: false, code: '+60',
        delegated: false,
    },
    {
        isoCode: 'FI',
        country: {
            en: 'Finland',
            zhcn: '芬兰',
            zhtw: '芬蘭'
        },
        enabled: false, code: '+358',
        delegated: false,
    },
    {
        isoCode: 'FJ',
        country: {
            en: 'Fiji',
            zhcn: '斐济群岛',
            zhtw: '斐濟'
        },
        enabled: false, code: '+679',
        delegated: false,
    },
    {
        isoCode: 'FK',
        country: {
            en: 'Falkland Islands',
            zhcn: '马尔维纳斯群岛（福克兰）',
            zhtw: '福克蘭群島（馬爾維納斯）'
        },
        enabled: false, code: '+500',
        delegated: false,
    },
    {
        isoCode: 'FM',
        country: {
            en: 'Micronesia',
            zhcn: '密克罗尼西亚联邦',
            zhtw: '密克羅尼西亞'
        },
        enabled: false, code: '+691',
        delegated: false,
    },
    {
        isoCode: 'FO',
        country: {
            en: 'Faroe Islands',
            zhcn: '法罗群岛',
            zhtw: '法羅群島'
        },
        enabled: false, code: '+298',
        delegated: false,
    },
    {
        isoCode: 'TZ',
        country: {
            en: 'Tanzania',
            zhcn: '坦桑尼亚',
            zhtw: '坦桑尼亞'
        },
        enabled: false, code: '+255',
        delegated: false,
    },
    {
        isoCode: 'NI',
        country: {
            en: 'Nicaragua',
            zhcn: '尼加拉瓜',
            zhtw: '尼加拉瓜'
        },
        enabled: false, code: '+505',
        delegated: false,
    },
    {
        isoCode: 'UG',
        country: {
            en: 'Uganda',
            zhcn: '乌干达',
            zhtw: '烏干達'
        },
        enabled: false, code: '+256',
        delegated: false,
    },
    {
        isoCode: 'NL',
        country: {
            en: 'Netherlands',
            zhcn: '荷兰',
            zhtw: '荷蘭'
        },
        enabled: false, code: '+31',
        delegated: false,
    },
    {
        isoCode: 'IM',
        country: {
            en: 'Isle of Man',
            zhcn: '马恩岛',
            zhtw: '萌島'
        },
        enabled: false, code: '+44-1624',
        delegated: false,
    },
    {
        isoCode: 'NO',
        country: {
            en: 'Norway',
            zhcn: '挪威',
            zhtw: '挪威'
        },
        enabled: false, code: '+47',
        delegated: false,
    },
    {
        isoCode: 'MR',
        country: {
            en: 'Mauritania',
            zhcn: '毛里塔尼亚',
            zhtw: '毛里塔尼亞'
        },
        enabled: false, code: '+222',
        delegated: false,
    },
    {
        isoCode: 'NA',
        country: {
            en: 'Namibia',
            zhcn: '纳米比亚',
            zhtw: '納米比亞'
        },
        enabled: false, code: '+264',
        delegated: false,
    },
    {
        isoCode: 'MS',
        country: {
            en: 'Montserrat',
            zhcn: '蒙塞拉特岛',
            zhtw: '蒙塞拉特島'
        },
        enabled: false, code: '+1-664',
        delegated: false,
    },
    {
        isoCode: 'VU',
        country: {
            en: 'Vanuatu',
            zhcn: '瓦努阿图',
            zhtw: '瓦努阿圖'
        },
        enabled: false, code: '+678',
        delegated: false,
    },
    {
        isoCode: 'MP',
        country: {
            en: 'Northern Mariana Islands',
            zhcn: '北马里亚纳群岛',
            zhtw: '北馬里亞納群島'
        },
        enabled: false, code: '+1-670',
        delegated: false,
    },
    {
        isoCode: 'NC',
        country: {
            en: 'New Caledonia',
            zhcn: '新喀里多尼亚',
            zhtw: '新喀里多尼亞'
        },
        enabled: false, code: '+687',
        delegated: false,
    },
    {
        isoCode: 'MQ',
        country: {
            en: 'Martinique',
            zhcn: '马提尼克',
            zhtw: '馬提尼克'
        },
        enabled: false, code: '+596',
        delegated: false,
    },
    {
        isoCode: 'NE',
        country: {
            en: 'Niger',
            zhcn: '尼日尔',
            zhtw: '尼日爾'
        },
        enabled: false, code: '+227',
        delegated: false,
    },
    {
        isoCode: 'MV',
        country: {
            en: 'Maldives',
            zhcn: '马尔代夫',
            zhtw: '馬爾代夫'
        },
        enabled: false, code: '+960',
        delegated: false,
    },
    {
        isoCode: 'NF',
        country: {
            en: 'Norfolk Island',
            zhcn: '诺福克岛',
            zhtw: '諾福克島'
        },
        enabled: false, code: '+672',
        delegated: false,
    },
    {
        isoCode: 'MW',
        country: {
            en: 'Malawi',
            zhcn: '马拉维',
            zhtw: '馬拉維'
        },
        enabled: false, code: '+265',
        delegated: false,
    },
    {
        isoCode: 'NG',
        country: {
            en: 'Nigeria',
            zhcn: '尼日利亚',
            zhtw: '尼日利亞'
        },
        enabled: false, code: '+234',
        delegated: false,
    },
    {
        isoCode: 'MT',
        country: {
            en: 'Malta',
            zhcn: '马耳他',
            zhtw: '馬爾他'
        },
        enabled: false, code: '+356',
        delegated: false,
    },
    {
        isoCode: 'NZ',
        country: {
            en: 'New Zealand',
            zhcn: '新西兰',
            zhtw: '新西蘭'
        },
        enabled: false, code: '+64',
        delegated: false,
    },
    {
        isoCode: 'MU',
        country: {
            en: 'Mauritius',
            zhcn: '毛里求斯',
            zhtw: '毛里求斯'
        },
        enabled: false, code: '+230',
        delegated: false,
    },
    {
        isoCode: 'NP',
        country: {
            en: 'Nepal',
            zhcn: '尼泊尔',
            zhtw: '尼泊爾'
        },
        enabled: false, code: '+977',
        delegated: false,
    },
    {
        isoCode: 'MK',
        country: {
            en: 'Macedonia',
            zhcn: '马其顿',
            zhtw: '馬其頓'
        },
        enabled: false, code: '+389',
        delegated: false,
    },
    {
        isoCode: 'NR',
        country: {
            en: 'Nauru',
            zhcn: '瑙鲁',
            zhtw: '瑙魯'
        },
        enabled: false, code: '+674',
        delegated: false,
    },
    {
        isoCode: 'MH',
        country: {
            en: 'Marshall Islands',
            zhcn: '马绍尔群岛',
            zhtw: '馬紹爾群島'
        },
        enabled: false, code: '+692',
        delegated: false,
    },
    {
        isoCode: 'NU',
        country: {
            en: 'Niue',
            zhcn: '纽埃',
            zhtw: '紐埃'
        },
        enabled: false, code: '+683',
        delegated: false,
    },
    {
        isoCode: 'MN',
        country: {
            en: 'Mongolia',
            zhcn: '蒙古国；蒙古',
            zhtw: '蒙古國'
        },
        enabled: false, code: '+976',
        delegated: false,
    },
    {
        isoCode: 'CK',
        country: {
            en: 'Cook Islands',
            zhcn: '库克群岛',
            zhtw: '庫克群島'
        },
        enabled: false, code: '+682',
        delegated: false,
    },
    {
        isoCode: 'ML',
        country: {
            en: 'Mali',
            zhcn: '马里',
            zhtw: '馬里'
        },
        enabled: false, code: '+223',
        delegated: false,
    },
    {
        isoCode: 'CI',
        country: {
            en: 'Ivory Coast',
            zhcn: '科特迪瓦',
            zhtw: '科特迪瓦'
        },
        enabled: false, code: '+225',
        delegated: false,
    },
    {
        isoCode: 'MM',
        country: {
            en: 'Myanmar',
            zhcn: '缅甸',
            zhtw: '緬甸'
        },
        enabled: false, code: '+95',
        delegated: false,
    },
    {
        isoCode: 'CH',
        country: {
            en: 'Switzerland',
            zhcn: '瑞士',
            zhtw: '瑞士'
        },
        enabled: false, code: '+41',
        delegated: false,
    },
    {
        isoCode: 'UZ',
        country: {
            en: 'Uzbekistan',
            zhcn: '乌兹别克斯坦',
            zhtw: '烏茲別克'
        },
        enabled: false, code: '+998',
        delegated: false,
    },
    {
        isoCode: 'CO',
        country: {
            en: 'Colombia',
            zhcn: '哥伦比亚',
            zhtw: '哥倫比亞'
        },
        enabled: false, code: '+57',
        delegated: false,
    },
    {
        isoCode: 'MC',
        country: {
            en: 'Monaco',
            zhcn: '摩纳哥',
            zhtw: '摩納哥'
        },
        enabled: false, code: '+377',
        delegated: false,
    },
    {
        isoCode: 'MA',
        country: {
            en: 'Morocco',
            zhcn: '摩洛哥',
            zhtw: '摩洛哥'
        },
        enabled: false, code: '+212',
        delegated: false,
    },
    {
        isoCode: 'CM',
        country: {
            en: 'Cameroon',
            zhcn: '喀麦隆',
            zhtw: '喀麥隆'
        },
        enabled: false, code: '+237',
        delegated: false,
    },
    {
        isoCode: 'MF',
        country: {
            en: 'Saint Martin',
            zhcn: '法属圣马丁',
            zhtw: '法屬聖馬丁'
        },
        enabled: false, code: '+590',
        delegated: false,
    },
    {
        isoCode: 'CL',
        country: {
            en: 'Chile',
            zhcn: '智利',
            zhtw: '智利'
        },
        enabled: false, code: '+56',
        delegated: false,
    },
    {
        isoCode: 'MG',
        country: {
            en: 'Madagascar',
            zhcn: '马达加斯加',
            zhtw: '馬達加斯加'
        },
        enabled: false, code: '+261',
        delegated: false,
    },
    {
        isoCode: 'CC',
        country: {
            en: 'Cocos Islands',
            zhcn: '科科斯群岛',
            zhtw: '科科斯群島'
        },
        enabled: false, code: '+61',
        delegated: false,
    },
    {
        isoCode: 'MD',
        country: {
            en: 'Moldova',
            zhcn: '摩尔多瓦',
            zhtw: '摩爾多瓦'
        },
        enabled: false, code: '+373',
        delegated: false,
    },
    {
        isoCode: 'CA',
        country: {
            en: 'Canada',
            zhcn: '加拿大',
            zhtw: '加拿大'
        },
        enabled: false, code: '+1',
        delegated: false,
    },
    {
        isoCode: 'ME',
        country: {
            en: 'Montenegro',
            zhcn: '黑山',
            zhtw: '黑山'
        },
        enabled: false, code: '+382',
        delegated: false,
    },
    {
        isoCode: 'CG',
        country: {
            en: 'Republic of the Congo',
            zhcn: '刚果（布）',
            zhtw: '剛果'
        },
        enabled: false, code: '+242',
        delegated: false,
    },
    {
        isoCode: 'ER',
        country: {
            en: 'Eritrea',
            zhcn: '厄立特里亚',
            zhtw: '厄立特里亞'
        },
        enabled: false, code: '+291',
        delegated: false,
    },
    {
        isoCode: 'CF',
        country: {
            en: 'Central African Republic',
            zhcn: '中非',
            zhtw: '中非'
        },
        enabled: false, code: '+236',
        delegated: false,
    },
    {
        isoCode: 'ES',
        country: {
            en: 'Spain',
            zhcn: '西班牙',
            zhtw: '西班牙'
        },
        enabled: false, code: '+34',
        delegated: false,
    },
    {
        isoCode: 'CD',
        country: {
            en: 'Democratic Republic of the Congo',
            zhcn: '刚果（金）',
            zhtw: '民主剛果'
        },
        enabled: false, code: '+243',
        delegated: false,
    },
    {
        isoCode: 'SA',
        country: {
            en: 'Saudi Arabia',
            zhcn: '沙特阿拉伯',
            zhtw: '沙特阿拉伯'
        },
        enabled: false, code: '+966',
        delegated: false,
    },
    {
        isoCode: 'CZ',
        country: {
            en: 'Czech Republic',
            zhcn: '捷克',
            zhtw: '捷克'
        },
        enabled: false, code: '+420',
        delegated: false,
    },
    {
        isoCode: 'ZW',
        country: {
            en: 'Zimbabwe',
            zhcn: '津巴布韦',
            zhtw: '津巴布韋'
        },
        enabled: false, code: '+263',
        delegated: false,
    },
    {
        isoCode: 'CY',
        country: {
            en: 'Cyprus',
            zhcn: '塞浦路斯',
            zhtw: '塞浦路斯'
        },
        enabled: false, code: '+357',
        delegated: false,
    },
    {
        isoCode: 'SO',
        country: {
            en: 'Somalia',
            zhcn: '索马里',
            zhtw: '索馬里'
        },
        enabled: false, code: '+252',
        delegated: false,
    },
    {
        isoCode: 'CX',
        country: {
            en: 'Christmas Island',
            zhcn: '圣诞岛',
            zhtw: '聖誕島'
        },
        enabled: false, code: '+61',
        delegated: false,
    },
    {
        isoCode: 'ET',
        country: {
            en: 'Ethiopia',
            zhcn: '埃塞俄比亚',
            zhtw: '埃塞俄比亞'
        },
        enabled: false, code: '+251',
        delegated: false,
    },
    {
        isoCode: 'CR',
        country: {
            en: 'Costa Rica',
            zhcn: '哥斯达黎加',
            zhtw: '哥斯達黎加'
        },
        enabled: false, code: '+506',
        delegated: false,
    },
    {
        isoCode: 'SB',
        country: {
            en: 'Solomon Islands',
            zhcn: '所罗门群岛',
            zhtw: '所羅門群島'
        },
        enabled: false, code: '+677',
        delegated: false,
    },
    {
        isoCode: 'CW',
        country: {
            en: 'Curacao',
            zhcn: '库拉索',
            zhtw: '庫拉索'
        },
        enabled: false, code: '+599',
        delegated: false,
    },
    {
        isoCode: 'VN',
        country: {
            en: 'Vietnam',
            zhcn: '越南',
            zhtw: '越南'
        },
        enabled: false, code: '+84',
        delegated: false,
    },
    {
        isoCode: 'CV',
        country: {
            en: 'Cape Verde',
            zhcn: '佛得角',
            zhtw: '佛得角'
        },
        enabled: false, code: '+238',
        delegated: false,
    },
    {
        isoCode: 'IT',
        country: {
            en: 'Italy',
            zhcn: '意大利',
            zhtw: '意大利'
        },
        enabled: false, code: '+39',
        delegated: false,
    },
    {
        isoCode: 'CU',
        country: {
            en: 'Cuba',
            zhcn: '古巴',
            zhtw: '古巴'
        },
        enabled: false, code: '+53',
        delegated: false,
    },
    {
        isoCode: 'EC',
        country: {
            en: 'Ecuador',
            zhcn: '厄瓜多尔',
            zhtw: '厄瓜多爾'
        },
        enabled: false, code: '+593',
        delegated: false,
    },
    {
        isoCode: 'SZ',
        country: {
            en: 'Swaziland',
            zhcn: '斯威士兰',
            zhtw: '斯威士蘭'
        },
        enabled: false, code: '+268',
        delegated: false,
    },
    {
        isoCode: 'ZA',
        country: {
            en: 'South Africa',
            zhcn: '南非',
            zhtw: '南非'
        },
        enabled: false, code: '+27',
        delegated: false,
    },
    {
        isoCode: 'SY',
        country: {
            en: 'Syria',
            zhcn: '叙利亚',
            zhtw: '敘利亞'
        },
        enabled: false, code: '+963',
        delegated: false,
    },
    {
        isoCode: 'EG',
        country: {
            en: 'Egypt',
            zhcn: '埃及',
            zhtw: '埃及'
        },
        enabled: false, code: '+20',
        delegated: false,
    },
    {
        isoCode: 'SX',
        country: {
            en: 'Sint Maarten',
            zhcn: '荷属圣马丁',
            zhtw: '荷屬聖馬丁'
        },
        enabled: false, code: '+599',
        delegated: false,
    },
    {
        isoCode: 'EE',
        country: {
            en: 'Estonia',
            zhcn: '爱沙尼亚',
            zhtw: '愛沙尼亞'
        },
        enabled: false, code: '+372',
        delegated: false,
    },
    {
        isoCode: 'KG',
        country: {
            en: 'Kyrgyzstan',
            zhcn: '吉尔吉斯斯坦',
            zhtw: '吉爾吉斯'
        },
        enabled: false, code: '+996',
        delegated: false,
    },
    {
        isoCode: 'EH',
        country: {
            en: 'Western Sahara',
            zhcn: '西撒哈拉',
            zhtw: '西撒哈拉'
        },
        enabled: false, code: '+212',
        delegated: false,
    },
    {
        isoCode: 'KE',
        country: {
            en: 'Kenya',
            zhcn: '肯尼亚',
            zhtw: '肯尼亞'
        },
        enabled: false, code: '+254',
        delegated: false,
    },
    {
        isoCode: 'ZM',
        country: {
            en: 'Zambia',
            zhcn: '赞比亚',
            zhtw: '贊比亞'
        },
        enabled: false, code: '+260',
        delegated: false,
    },
    {
        isoCode: 'SS',
        country: {
            en: 'South Sudan',
            zhcn: '南苏丹',
            zhtw: '南蘇丹'
        },
        enabled: false, code: '+211',
        delegated: false,
    },
    {
        isoCode: 'PM',
        country: {
            en: 'Saint Pierre and Miquelon',
            zhcn: '圣皮埃尔和密克隆',
            zhtw: '聖皮埃爾島和密克隆島'
        },
        enabled: false, code: '+508',
        delegated: false,
    },
    {
        isoCode: 'SR',
        country: {
            en: 'Suriname',
            zhcn: '苏里南',
            zhtw: '蘇里南'
        },
        enabled: false, code: '+597',
        delegated: false,
    },
    {
        isoCode: 'PL',
        country: {
            en: 'Poland',
            zhcn: '波兰',
            zhtw: '波蘭'
        },
        enabled: false, code: '+48',
        delegated: false,
    },
    {
        isoCode: 'KI',
        country: {
            en: 'Kiribati',
            zhcn: '基里巴斯',
            zhtw: '基里巴斯'
        },
        enabled: false, code: '+686',
        delegated: false,
    },
    {
        isoCode: 'PN',
        country: {
            en: 'Pitcairn',
            zhcn: '皮特凯恩群岛',
            zhtw: '皮特凱恩群島'
        },
        enabled: false, code: '+870',
        delegated: false,
    },
    {
        isoCode: 'KH',
        country: {
            en: 'Cambodia',
            zhcn: '柬埔寨',
            zhtw: '柬埔寨'
        },
        enabled: false, code: '+855',
        delegated: false,
    },
    {
        isoCode: 'PH',
        country: {
            en: 'Philippines',
            zhcn: '菲律宾',
            zhtw: '菲律賓'
        },
        enabled: false, code: '+63',
        delegated: false,
    },
    {
        isoCode: 'KN',
        country: {
            en: 'Saint Kitts and Nevis',
            zhcn: '圣基茨和尼维斯',
            zhtw: '聖基茨和尼維斯'
        },
        enabled: false, code: '+1-869',
        delegated: false,
    },
    {
        isoCode: 'PK',
        country: {
            en: 'Pakistan',
            zhcn: '巴基斯坦',
            zhtw: '巴基斯坦'
        },
        enabled: false, code: '+92',
        delegated: false,
    },
    {
        isoCode: 'KM',
        country: {
            en: 'Comoros',
            zhcn: '科摩罗',
            zhtw: '科摩羅'
        },
        enabled: false, code: '+269',
        delegated: false,
    },
    {
        isoCode: 'PE',
        country: {
            en: 'Peru',
            zhcn: '秘鲁',
            zhtw: '秘魯'
        },
        enabled: false, code: '+51',
        delegated: false,
    },
    {
        isoCode: 'ST',
        country: {
            en: 'Sao Tome and Principe',
            zhcn: '圣多美和普林西比',
            zhtw: '聖多美及普林西比'
        },
        enabled: false, code: '+239',
        delegated: false,
    },
    {
        isoCode: 'PG',
        country: {
            en: 'Papua New Guinea',
            zhcn: '巴布亚新几内亚',
            zhtw: '巴布亞新幾內亞'
        },
        enabled: false, code: '+675',
        delegated: false,
    },
    {
        isoCode: 'SK',
        country: {
            en: 'Slovakia',
            zhcn: '斯洛伐克',
            zhtw: '斯洛伐克'
        },
        enabled: false, code: '+421',
        delegated: false,
    },
    {
        isoCode: 'PF',
        country: {
            en: 'French Polynesia',
            zhcn: '法属波利尼西亚',
            zhtw: '法屬波利尼西亞'
        },
        enabled: false, code: '+689',
        delegated: false,
    },
    {
        isoCode: 'KR',
        country: {
            en: 'South Korea',
            zhcn: '韩国；南朝鲜',
            zhtw: '韓國；南韓'
        },
        enabled: false, code: '+82',
        delegated: false,
    },
    {
        isoCode: 'PA',
        country: {
            en: 'Panama',
            zhcn: '巴拿马',
            zhtw: '巴拿馬'
        },
        enabled: false, code: '+507',
        delegated: false,
    },
    {
        isoCode: 'SI',
        country: {
            en: 'Slovenia',
            zhcn: '斯洛文尼亚',
            zhtw: '斯洛文尼亞'
        },
        enabled: false, code: '+386',
        delegated: false,
    },
    {
        isoCode: 'IQ',
        country: {
            en: 'Iraq',
            zhcn: '伊拉克',
            zhtw: '伊拉克'
        },
        enabled: false, code: '+964',
        delegated: false,
    },
    {
        isoCode: 'KP',
        country: {
            en: 'North Korea',
            zhcn: '朝鲜；北朝鲜',
            zhtw: '朝鲜；北韓'
        },
        enabled: false, code: '+850',
        delegated: false,
    },
    {
        isoCode: 'PY',
        country: {
            en: 'Paraguay',
            zhcn: '巴拉圭',
            zhtw: '巴拉圭'
        },
        enabled: false, code: '+595',
        delegated: false,
    },
    {
        isoCode: 'KW',
        country: {
            en: 'Kuwait',
            zhcn: '科威特',
            zhtw: '科威特'
        },
        enabled: false, code: '+965',
        delegated: false,
    },
    {
        isoCode: 'SJ',
        country: {
            en: 'Svalbard and Jan Mayen',
            zhcn: '斯瓦尔巴群岛和扬马延岛',
            zhtw: '斯瓦爾巴特群島'
        },
        enabled: false, code: '+47',
        delegated: false,
    },
    {
        isoCode: 'SN',
        country: {
            en: 'Senegal',
            zhcn: '塞内加尔',
            zhtw: '塞內加爾'
        },
        enabled: false, code: '+221',
        delegated: false,
    },
    {
        isoCode: 'PT',
        country: {
            en: 'Portugal',
            zhcn: '葡萄牙',
            zhtw: '葡萄牙'
        },
        enabled: false, code: '+351',
        delegated: false,
    },
    {
        isoCode: 'SM',
        country: {
            en: 'San Marino',
            zhcn: '圣马力诺',
            zhtw: '聖馬力諾'
        },
        enabled: false, code: '+378',
        delegated: false,
    },
    {
        isoCode: 'PW',
        country: {
            en: 'Palau',
            zhcn: '帕劳',
            zhtw: '帕勞；帛琉'
        },
        enabled: false, code: '+680',
        delegated: false,
    },
    {
        isoCode: 'SL',
        country: {
            en: 'Sierra Leone',
            zhcn: '塞拉利昂',
            zhtw: '塞拉利昂'
        },
        enabled: false, code: '+232',
        delegated: false,
    },
    {
        isoCode: 'PS',
        country: {
            en: 'Palestinian Territory',
            zhcn: '巴勒斯坦',
            zhtw: '巴勒斯坦'
        },
        enabled: false, code: '+970',
        delegated: false,
    },
    {
        isoCode: 'SC',
        country: {
            en: 'Seychelles',
            zhcn: '塞舌尔',
            zhtw: '塞舌爾'
        },
        enabled: false, code: '+248',
        delegated: false,
    },
    {
        isoCode: 'PR',
        country: {
            en: 'Puerto Rico',
            zhcn: '波多黎各',
            zhtw: '波多黎各'
        },
        enabled: false, code: '+1-787 and 1-939',
        delegated: false,
    },
    {
        isoCode: 'KZ',
        country: {
            en: 'Kazakhstan',
            zhcn: '哈萨克斯坦',
            zhtw: '哈薩克'
        },
        enabled: false, code: '+7',
        delegated: false,
    },
    {
        isoCode: 'VE',
        country: {
            en: 'Venezuela',
            zhcn: '委内瑞拉',
            zhtw: '委內瑞拉'
        },
        enabled: false, code: '+58',
        delegated: false,
    },
    {
        isoCode: 'KY',
        country: {
            en: 'Cayman Islands',
            zhcn: '开曼群岛',
            zhtw: '開曼群島'
        },
        enabled: false, code: '+1-345',
        delegated: false,
    },
    {
        isoCode: 'SG',
        country: {
            en: 'Singapore',
            zhcn: '新加坡',
            zhtw: '新加坡；星加坡'
        },
        enabled: false, code: '+65',
        delegated: false,
    },
    {
        isoCode: 'HN',
        country: {
            en: 'Honduras',
            zhcn: '洪都拉斯',
            zhtw: '宏都拉斯'
        },
        enabled: false, code: '+504',
        delegated: false,
    },
    {
        isoCode: 'SE',
        country: {
            en: 'Sweden',
            zhcn: '瑞典',
            zhtw: '瑞典'
        },
        enabled: false, code: '+46',
        delegated: false,
    },
    {
        isoCode: 'SD',
        country: {
            en: 'Sudan',
            zhcn: '苏丹',
            zhtw: '蘇丹'
        },
        enabled: false, code: '+249',
        delegated: false,
    },
    {
        isoCode: 'HU',
        country: {
            en: 'Hungary',
            zhcn: '匈牙利',
            zhtw: '匈牙利'
        },
        enabled: false, code: '+36',
        delegated: false,
    },
    {
        isoCode: 'DO',
        country: {
            en: 'Dominican Republic',
            zhcn: '多米尼加',
            zhtw: '多明尼加'
        },
        enabled: false, code: '+1-809 and 1-829',
        delegated: false,
    },
    {
        isoCode: 'HT',
        country: {
            en: 'Haiti',
            zhcn: '海地',
            zhtw: '海地'
        },
        enabled: false, code: '+509',
        delegated: false,
    },
    {
        isoCode: 'DM',
        country: {
            en: 'Dominica',
            zhcn: '多米尼克',
            zhtw: '多米尼克'
        },
        enabled: false, code: '+1-767',
        delegated: false,
    },
    {
        isoCode: 'HR',
        country: {
            en: 'Croatia',
            zhcn: '克罗地亚',
            zhtw: '克羅地亞'
        },
        enabled: false, code: '+385',
        delegated: false,
    },
    {
        isoCode: 'DJ',
        country: {
            en: 'Djibouti',
            zhcn: '吉布提',
            zhtw: '吉布提'
        },
        enabled: false, code: '+253',
        delegated: false,
    },
    {
        isoCode: 'JO',
        country: {
            en: 'Jordan',
            zhcn: '约旦',
            zhtw: '約旦'
        },
        enabled: false, code: '+962',
        delegated: false,
    },
    {
        isoCode: 'DK',
        country: {
            en: 'Denmark',
            zhcn: '丹麦',
            zhtw: '丹麥'
        },
        enabled: false, code: '+45',
        delegated: false,
    },
    {
        isoCode: 'TN',
        country: {
            en: 'Tunisia',
            zhcn: '突尼斯',
            zhtw: '突尼斯'
        },
        enabled: false, code: '+216',
        delegated: false,
    },
    {
        isoCode: 'VG',
        country: {
            en: 'British Virgin Islands',
            zhcn: '英属维尔京群岛',
            zhtw: '英屬處女群島'
        },
        enabled: false, code: '+1-284',
        delegated: false,
    },
    {
        isoCode: 'OM',
        country: {
            en: 'Oman',
            zhcn: '阿曼',
            zhtw: '阿曼'
        },
        enabled: false, code: '+968',
        delegated: false,
    },
    {
        isoCode: 'DE',
        country: {
            en: 'Germany',
            zhcn: '德国',
            zhtw: '德國'
        },
        enabled: false, code: '+49',
        delegated: false,
    },
    {
        isoCode: 'GH',
        country: {
            en: 'Ghana',
            zhcn: '加纳',
            zhtw: '加納'
        },
        enabled: false, code: '+233',
        delegated: false,
    },
    {
        isoCode: 'YE',
        country: {
            en: 'Yemen',
            zhcn: '也门',
            zhtw: '也門'
        },
        enabled: false, code: '+967',
        delegated: false,
    },
    {
        isoCode: 'GI',
        country: {
            en: 'Gibraltar',
            zhcn: '直布罗陀',
            zhtw: '直布羅陀'
        },
        enabled: false, code: '+350',
        delegated: false,
    },
    {
        isoCode: 'DZ',
        country: {
            en: 'Algeria',
            zhcn: '阿尔及利亚',
            zhtw: '阿爾及利亞'
        },
        enabled: false, code: '+213',
        delegated: false,
    },
    {
        isoCode: 'GL',
        country: {
            en: 'Greenland',
            zhcn: '格陵兰',
            zhtw: '格陵蘭'
        },
        enabled: false, code: '+299',
        delegated: false,
    },
    {
        isoCode: 'US',
        country: {
            en: 'United States',
            zhcn: '美国',
            zhtw: '美國'
        },
        enabled: false, code: '+1',
        delegated: false,
    },
    {
        isoCode: 'GM',
        country: {
            en: 'Gambia',
            zhcn: '冈比亚',
            zhtw: '岡比亞'
        },
        enabled: false, code: '+220',
        delegated: false,
    },
    {
        isoCode: 'UY',
        country: {
            en: 'Uruguay',
            zhcn: '乌拉圭',
            zhtw: '烏拉圭'
        },
        enabled: false, code: '+598',
        delegated: false,
    },
    {
        isoCode: 'GN',
        country: {
            en: 'Guinea',
            zhcn: '几内亚',
            zhtw: '幾內亞'
        },
        enabled: false, code: '+224',
        delegated: false,
    },
    {
        isoCode: 'YT',
        country: {
            en: 'Mayotte',
            zhcn: '马约特',
            zhtw: '馬約特'
        },
        enabled: false, code: '+262',
        delegated: false,
    },
    {
        isoCode: 'SV',
        country: {
            en: 'El Salvador',
            zhcn: '萨尔瓦多',
            zhtw: '薩爾瓦多'
        },
        enabled: false, code: '+503',
        delegated: false,
    },
    {
        isoCode: 'UM',
        country: {
            en: 'United States Minor Outlying Islands',
            zhcn: '美国本土外小岛屿',
            zhtw: '美國海外小島'
        },
        enabled: false, code: '+1',
        delegated: false,
    },
    {
        isoCode: 'GA',
        country: {
            en: 'Gabon',
            zhcn: '加蓬',
            zhtw: '加蓬'
        },
        enabled: false, code: '+241',
        delegated: false,
    },
    {
        isoCode: 'LB',
        country: {
            en: 'Lebanon',
            zhcn: '黎巴嫩',
            zhtw: '黎巴嫩'
        },
        enabled: false, code: '+961',
        delegated: false,
    },
    {
        isoCode: 'GB',
        country: {
            en: 'United Kingdom',
            zhcn: '英国',
            zhtw: '英國'
        },
        enabled: false, code: '+44',
        delegated: false,
    },
    {
        isoCode: 'LC',
        country: {
            en: 'Saint Lucia',
            zhcn: '圣卢西亚',
            zhtw: '聖盧西亞'
        },
        enabled: false, code: '+1-758',
        delegated: false,
    },
    {
        isoCode: 'GD',
        country: {
            en: 'Grenada',
            zhcn: '格林纳达',
            zhtw: '格林納達'
        },
        enabled: false, code: '+1-473',
        delegated: false,
    },
    {
        isoCode: 'LA',
        country: {
            en: 'Laos',
            zhcn: '老挝',
            zhtw: '老挝'
        },
        enabled: false, code: '+856',
        delegated: false,
    },
    {
        isoCode: 'GE',
        country: {
            en: 'Georgia',
            zhcn: '格鲁吉亚',
            zhtw: '格魯吉亞'
        },
        enabled: false, code: '+995',
        delegated: false,
    },
    {
        isoCode: 'TV',
        country: {
            en: 'Tuvalu',
            zhcn: '图瓦卢',
            zhtw: '圖瓦盧'
        },
        enabled: false, code: '+688',
        delegated: false,
    },
    {
        isoCode: 'GF',
        country: {
            en: 'French Guiana',
            zhcn: '法属圭亚那',
            zhtw: '法屬圭亞那'
        },
        enabled: false, code: '+594',
        delegated: false,
    },
    {
        isoCode: 'GG',
        country: {
            en: 'Guernsey',
            zhcn: '根西岛',
            zhtw: '根西島'
        },
        enabled: false, code: '+44-1481',
        delegated: false,
    },
    {
        isoCode: 'TT',
        country: {
            en: 'Trinidad and Tobago',
            zhcn: '特立尼达和多巴哥',
            zhtw: '千里達和多巴哥'
        },
        enabled: false, code: '+1-868',
        delegated: false,
    },
    {
        isoCode: 'GY',
        country: {
            en: 'Guyana',
            zhcn: '圭亚那',
            zhtw: '圭亞那'
        },
        enabled: false, code: '+592',
        delegated: false,
    },
    {
        isoCode: 'TR',
        country: {
            en: 'Turkey',
            zhcn: '土耳其',
            zhtw: '土耳其'
        },
        enabled: false, code: '+90',
        delegated: false,
    },
    {
        isoCode: 'JP',
        country: {
            en: 'Japan',
            zhcn: '日本',
            zhtw: '日本'
        },
        enabled: false, code: '+81',
        delegated: false,
    },
    {
        isoCode: 'LK',
        country: {
            en: 'Sri Lanka',
            zhcn: '斯里兰卡',
            zhtw: '斯里蘭卡'
        },
        enabled: false, code: '+94',
        delegated: false,
    },
    {
        isoCode: 'GP',
        country: {
            en: 'Guadeloupe',
            zhcn: '瓜德罗普',
            zhtw: '瓜德魯普島'
        },
        enabled: false, code: '+590',
        delegated: false,
    },
    {
        isoCode: 'LI',
        country: {
            en: 'Liechtenstein',
            zhcn: '列支敦士登',
            zhtw: '列支敦士登'
        },
        enabled: false, code: '+423',
        delegated: false,
    },
    {
        isoCode: 'GQ',
        country: {
            en: 'Equatorial Guinea',
            zhcn: '赤道几内亚',
            zhtw: '赤道幾內亞'
        },
        enabled: false, code: '+240',
        delegated: false,
    },
    {
        isoCode: 'LV',
        country: {
            en: 'Latvia',
            zhcn: '拉脱维亚',
            zhtw: '拉脫維亞'
        },
        enabled: false, code: '+371',
        delegated: false,
    },
    {
        isoCode: 'GR',
        country: {
            en: 'Greece',
            zhcn: '希腊',
            zhtw: '希臘'
        },
        enabled: false, code: '+30',
        delegated: false,
    },
    {
        isoCode: 'TO',
        country: {
            en: 'Tonga',
            zhcn: '汤加',
            zhtw: '湯加'
        },
        enabled: false, code: '+676',
        delegated: false,
    },
    // {
    //     isoCode: 'GS',
    //     country: {
    //         en: 'South Georgia and the South Sandwich Islands',
    //         zhcn: '南乔治亚岛和南桑威奇群岛',
    //         zhtw: '南喬治亞島與南桑威奇群島'
    //     },
    //     code: null,
    //     delegated: true,
    // },
    {
        isoCode: 'LT',
        country: {
            en: 'Lithuania',
            zhcn: '立陶宛',
            zhtw: '立陶宛'
        },
        enabled: false, code: '+370',
        delegated: false,
    },
    {
        isoCode: 'GT',
        country: {
            en: 'Guatemala',
            zhcn: '危地马拉',
            zhtw: '危地馬拉'
        },
        enabled: false, code: '+502',
        delegated: false,
    },
    {
        isoCode: 'LU',
        country: {
            en: 'Luxembourg',
            zhcn: '卢森堡',
            zhtw: '盧森堡'
        },
        enabled: false, code: '+352',
        delegated: false,
    },
    {
        isoCode: 'GU',
        country: {
            en: 'Guam',
            zhcn: '关岛',
            zhtw: '關島'
        },
        enabled: false, code: '+1-671',
        delegated: false,
    },
    {
        isoCode: 'LR',
        country: {
            en: 'Liberia',
            zhcn: '利比里亚',
            zhtw: '利比里亞'
        },
        enabled: false, code: '+231',
        delegated: false,
    },
    {
        isoCode: 'GW',
        country: {
            en: 'Guinea-Bissau',
            zhcn: '几内亚比绍',
            zhtw: '幾內亞比紹'
        },
        enabled: false, code: '+245',
        delegated: false,
    },
    {
        isoCode: 'LS',
        country: {
            en: 'Lesotho',
            zhcn: '莱索托',
            zhtw: '萊索托'
        },
        enabled: false, code: '+266',
        delegated: false,
    },
    {
        isoCode: 'TK',
        country: {
            en: 'Tokelau',
            zhcn: '托克劳',
            zhtw: '托克勞群島'
        },
        enabled: false, code: '+690',
        delegated: false,
    },
    {
        isoCode: 'TH',
        country: {
            en: 'Thailand',
            zhcn: '泰国',
            zhtw: '泰國'
        },
        enabled: false, code: '+66',
        delegated: false,
    },
    {
        isoCode: 'RO',
        country: {
            en: 'Romania',
            zhcn: '罗马尼亚',
            zhtw: '羅馬尼亞'
        },
        enabled: false, code: '+40',
        delegated: false,
    },
    // {
    //     isoCode: 'TF',
    //     country: {
    //         en: 'French Southern Territories',
    //         zhcn: '法属南部领地',
    //         zhtw: '法屬南部地區'
    //     },
    //     code: null,
    //     delegated: true,
    // },
    {
        isoCode: 'TJ',
        country: {
            en: 'Tajikistan',
            zhcn: '塔吉克斯坦',
            zhtw: '塔吉克'
        },
        enabled: false, code: '+992',
        delegated: false,
    },
    {
        isoCode: 'TG',
        country: {
            en: 'Togo',
            zhcn: '多哥',
            zhtw: '多哥'
        },
        enabled: false, code: '+228',
        delegated: false,
    },
    {
        isoCode: 'TM',
        country: {
            en: 'Turkmenistan',
            zhcn: '土库曼斯坦',
            zhtw: '土庫曼'
        },
        enabled: false, code: '+993',
        delegated: false,
    },
    {
        isoCode: 'TD',
        country: {
            en: 'Chad',
            zhcn: '乍得',
            zhtw: '乍得'
        },
        enabled: false, code: '+235',
        delegated: false,
    },
    {
        isoCode: 'RE',
        country: {
            en: 'Reunion',
            zhcn: '留尼汪',
            zhtw: '留尼汪'
        },
        enabled: false, code: '+262',
        delegated: false,
    },
    {
        isoCode: 'TC',
        country: {
            en: 'Turks and Caicos Islands',
            zhcn: '特克斯和凯科斯群岛',
            zhtw: '特克斯和凱科斯群島'
        },
        enabled: false, code: '+1-649',
        delegated: false,
    },
    {
        isoCode: 'TL',
        country: {
            en: 'East Timor',
            zhcn: '东帝汶',
            zhtw: '東帝汶'
        },
        enabled: false, code: '+670',
        delegated: false,
    },
    {
        isoCode: 'LY',
        country: {
            en: 'Libya',
            zhcn: '利比亚',
            zhtw: '利比亞'
        },
        enabled: false, code: '+218',
        delegated: false,
    },
    {
        isoCode: 'RS',
        country: {
            en: 'Serbia',
            zhcn: '塞尔维亚',
            zhtw: '塞爾維亞'
        },
        enabled: false, code: '+381',
        delegated: false,
    },
    {
        isoCode: 'VA',
        country: {
            en: 'Vatican',
            zhcn: '梵蒂冈',
            zhtw: '梵蒂岡'
        },
        enabled: false, code: '+379',
        delegated: false,
    },
    {
        isoCode: 'RW',
        country: {
            en: 'Rwanda',
            zhcn: '卢旺达',
            zhtw: '盧旺達'
        },
        enabled: false, code: '+250',
        delegated: false,
    },
    {
        isoCode: 'VC',
        country: {
            en: 'Saint Vincent and the Grenadines',
            zhcn: '圣文森特和格林纳丁斯',
            zhtw: '聖文森特和格林納丁斯'
        },
        enabled: false, code: '+1-784',
        delegated: false,
    },
    {
        isoCode: 'RU',
        country: {
            en: 'Russia',
            zhcn: '俄罗斯',
            zhtw: '俄羅斯'
        },
        enabled: false, code: '+7',
        delegated: false,
    },
    {
        isoCode: 'AE',
        country: {
            en: 'United Arab Emirates',
            zhcn: '阿联酋',
            zhtw: '阿聯酋'
        },
        enabled: false, code: '+971',
        delegated: false,
    },
    {
        isoCode: 'BZ',
        country: {
            en: 'Belize',
            zhcn: '伯利兹',
            zhtw: '伯利茲'
        },
        enabled: false, code: '+501',
        delegated: false,
    },
    {
        isoCode: 'AD',
        country: {
            en: 'Andorra',
            zhcn: '安道尔',
            zhtw: '安道爾'
        },
        enabled: false, code: '+376',
        delegated: false,
    },
    {
        isoCode: 'BY',
        country: {
            en: 'Belarus',
            zhcn: '白俄罗斯',
            zhtw: '白俄羅斯'
        },
        enabled: false, code: '+375',
        delegated: false,
    },
    {
        isoCode: 'AG',
        country: {
            en: 'Antigua and Barbuda',
            zhcn: '安提瓜和巴布达',
            zhtw: '安提瓜和巴布達'
        },
        enabled: false, code: '+1-268',
        delegated: false,
    },
    {
        isoCode: 'JE',
        country: {
            en: 'Jersey',
            zhcn: '泽西岛',
            zhtw: '澤西'
        },
        enabled: false, code: '+44-1534',
        delegated: false,
    },
    {
        isoCode: 'AF',
        country: {
            en: 'Afghanistan',
            zhcn: '阿富汗',
            zhtw: '阿富汗'
        },
        enabled: false, code: '+93',
        delegated: false,
    },
    {
        isoCode: 'BS',
        country: {
            en: 'Bahamas',
            zhcn: '巴哈马',
            zhtw: '巴哈馬'
        },
        enabled: false, code: '+1-242',
        delegated: false,
    },
    {
        isoCode: 'AI',
        country: {
            en: 'Anguilla',
            zhcn: '安圭拉',
            zhtw: '安圭拉島'
        },
        enabled: false, code: '+1-264',
        delegated: false,
    },
    {
        isoCode: 'BR',
        country: {
            en: 'Brazil',
            zhcn: '巴西',
            zhtw: '巴西'
        },
        enabled: false, code: '+55',
        delegated: false,
    },
    {
        isoCode: 'VI',
        country: {
            en: 'U.S. Virgin Islands',
            zhcn: '美属维尔京群岛',
            zhtw: '美屬處女群島'
        },
        enabled: false, code: '+1-340',
        delegated: false,
    },
    {
        isoCode: 'BQ',
        country: {
            en: 'Bonaire, Saint Eustatius and Saba ',
            zhcn: '荷兰加勒比区',
            zhtw: '荷蘭加勒比區'
        },
        enabled: false, code: '+599',
        delegated: false,
    },
    {
        isoCode: 'IS',
        country: {
            en: 'Iceland',
            zhcn: '冰岛',
            zhtw: '冰島'
        },
        enabled: false, code: '+354',
        delegated: false,
    },
    {
        isoCode: 'WS',
        country: {
            en: 'Samoa',
            zhcn: '萨摩亚',
            zhtw: '薩摩亞'
        },
        enabled: false, code: '+685',
        delegated: false,
    },
    {
        isoCode: 'IR',
        country: {
            en: 'Iran',
            zhcn: '伊朗',
            zhtw: '伊朗'
        },
        enabled: false, code: '+98',
        delegated: false,
    },
    {
        isoCode: 'BW',
        country: {
            en: 'Botswana',
            zhcn: '博茨瓦纳',
            zhtw: '博茨瓦納'
        },
        enabled: false, code: '+267',
        delegated: false,
    },
    {
        isoCode: 'AM',
        country: {
            en: 'Armenia',
            zhcn: '亚美尼亚',
            zhtw: '亞美尼亞'
        },
        enabled: false, code: '+374',
        delegated: false,
    },
    // {
    //     isoCode: 'BV',
    //     country: {
    //         en: 'Bouvet Island',
    //         zhcn: '布韦岛',
    //         zhtw: '鮑威特島'
    //     },
    //     code: null,
    //     delegated: true,
    // },
    {
        isoCode: 'AL',
        country: {
            en: 'Albania',
            zhcn: '阿尔巴尼亚',
            zhtw: '阿爾巴尼亞'
        },
        enabled: false, code: '+355',
        delegated: false,
    },
    {
        isoCode: 'JM',
        country: {
            en: 'Jamaica',
            zhcn: '牙买加',
            zhtw: '牙買加'
        },
        enabled: false, code: '+1-876',
        delegated: false,
    },
    {
        isoCode: 'AO',
        country: {
            en: 'Angola',
            zhcn: '安哥拉',
            zhtw: '安哥拉'
        },
        enabled: false, code: '+244',
        delegated: false,
    },
    {
        isoCode: 'BT',
        country: {
            en: 'Bhutan',
            zhcn: '不丹',
            zhtw: '不丹'
        },
        enabled: false, code: '+975',
        delegated: false,
    },
    // {
    //     isoCode: 'AQ',
    //     country: {
    //         en: 'Antarctica',
    //         zhcn: '南极洲',
    //         zhtw: '南極洲'
    //     },
    //     code: null,
    //     delegated: true,
    // },
    {
        isoCode: 'BJ',
        country: {
            en: 'Benin',
            zhcn: '贝宁',
            zhtw: '貝寧'
        },
        enabled: false, code: '+229',
        delegated: false,
    },
    {
        isoCode: 'AS',
        country: {
            en: 'American Samoa',
            zhcn: '美属萨摩亚',
            zhtw: '美屬薩摩亞'
        },
        enabled: false, code: '+1-684',
        delegated: false,
    },
    {
        isoCode: 'BI',
        country: {
            en: 'Burundi',
            zhcn: '布隆迪',
            zhtw: '布隆迪'
        },
        enabled: false, code: '+257',
        delegated: false,
    },
    {
        isoCode: 'AR',
        country: {
            en: 'Argentina',
            zhcn: '阿根廷',
            zhtw: '阿根廷'
        },
        enabled: false, code: '+54',
        delegated: false,
    },
    {
        isoCode: 'BH',
        country: {
            en: 'Bahrain',
            zhcn: '巴林',
            zhtw: '巴林'
        },
        enabled: false, code: '+973',
        delegated: false,
    },
    {
        isoCode: 'AU',
        country: {
            en: 'Australia',
            zhcn: '澳大利亚',
            zhtw: '澳洲'
        },
        enabled: false, code: '+61',
        delegated: false,
    },
    {
        isoCode: 'BO',
        country: {
            en: 'Bolivia',
            zhcn: '玻利维亚',
            zhtw: '玻利維亞'
        },
        enabled: false, code: '+591',
        delegated: false,
    },
    {
        isoCode: 'AT',
        country: {
            en: 'Austria',
            zhcn: '奥地利',
            zhtw: '奧地利'
        },
        enabled: false, code: '+43',
        delegated: false,
    },
    {
        isoCode: 'BN',
        country: {
            en: 'Brunei',
            zhcn: '文莱',
            zhtw: '汶萊'
        },
        enabled: false, code: '+673',
        delegated: false,
    },
    {
        isoCode: 'AW',
        country: {
            en: 'Aruba',
            zhcn: '阿鲁巴',
            zhtw: '阿魯巴'
        },
        enabled: false, code: '+297',
        delegated: false,
    },
    {
        isoCode: 'BM',
        country: {
            en: 'Bermuda',
            zhcn: '百慕大',
            zhtw: '百慕達'
        },
        enabled: false, code: '+1-441',
        delegated: false,
    },
    {
        isoCode: 'IN',
        country: {
            en: 'India',
            zhcn: '印度',
            zhtw: '印度'
        },
        enabled: false, code: '+91',
        delegated: false,
    },
    {
        isoCode: 'BL',
        country: {
            en: 'Saint Barthelemy',
            zhcn: '圣巴泰勒米岛',
            zhtw: '聖巴托洛繆島'
        },
        enabled: false, code: '+590',
        delegated: false,
    },
    {
        isoCode: 'AX',
        country: {
            en: 'Aland Islands',
            zhcn: '奥兰群岛',
            zhtw: '亞蘭群島'
        },
        enabled: false, code: '+358-18',
        delegated: false,
    },
    {
        isoCode: 'WF',
        country: {
            en: 'Wallis and Futuna',
            zhcn: '瓦利斯和富图纳',
            zhtw: '瓦利斯群島和富圖納群島'
        },
        enabled: false, code: '+681',
        delegated: false,
    },
    {
        isoCode: 'AZ',
        country: {
            en: 'Azerbaijan',
            zhcn: '阿塞拜疆',
            zhtw: '阿塞拜疆'
        },
        enabled: false, code: '+994',
        delegated: false,
    },
    {
        isoCode: 'BB',
        country: {
            en: 'Barbados',
            zhcn: '巴巴多斯',
            zhtw: '巴巴多斯'
        },
        enabled: false, code: '+1-246',
        delegated: false,
    },
    {
        isoCode: 'IE',
        country: {
            en: 'Ireland',
            zhcn: '爱尔兰',
            zhtw: '愛爾蘭'
        },
        enabled: false, code: '+353',
        delegated: false,
    },
    {
        isoCode: 'BA',
        country: {
            en: 'Bosnia and Herzegovina',
            zhcn: '波黑',
            zhtw: '波黑'
        },
        enabled: false, code: '+387',
        delegated: false,
    },
    {
        isoCode: 'ID',
        country: {
            en: 'Indonesia',
            zhcn: '印尼',
            zhtw: '印尼'
        },
        enabled: false, code: '+62',
        delegated: false,
    },
    {
        isoCode: 'BG',
        country: {
            en: 'Bulgaria',
            zhcn: '保加利亚',
            zhtw: '保加利亞'
        },
        enabled: false, code: '+359',
        delegated: false,
    },
    {
        isoCode: 'UA',
        country: {
            en: 'Ukraine',
            zhcn: '乌克兰',
            zhtw: '烏克蘭'
        },
        enabled: false, code: '+380',
        delegated: false,
    },
    {
        isoCode: 'BF',
        country: {
            en: 'Burkina Faso',
            zhcn: '布基纳法索',
            zhtw: '布基納法索'
        },
        enabled: false, code: '+226',
        delegated: false,
    },
    {
        isoCode: 'QA',
        country: {
            en: 'Qatar',
            zhcn: '卡塔尔',
            zhtw: '卡塔爾'
        },
        enabled: false, code: '+974',
        delegated: false,
    },
    {
        isoCode: 'BE',
        country: {
            en: 'Belgium',
            zhcn: '比利时',
            zhtw: '比利時'
        },
        enabled: false, code: '+32',
        delegated: false,
    },
    {
        isoCode: 'MZ',
        country: {
            en: 'Mozambique',
            zhcn: '莫桑比克',
            zhtw: '莫桑比克'
        },
        enabled: false, code: '+258',
        delegated: false,
    },
    {
        isoCode: 'SH',
        country: {
            en: 'Saint Helena',
            zhcn: '圣赫勒拿',
            zhtw: '聖赫勒拿'
        },
        enabled: false, code: '+290',
        delegated: false,
    }
];


const createDelegatedCountry = async (node, model) => {
    try {
        let delegated = await model.findOne({ delegated: true });
        if (!delegated) {

            const multilingual = node.get('localization');

            const createDelegatedCountryTasks = _map(delegatedCountry, async countryInfo => {
                if (!multilingual) {
                    countryInfo.country = countryInfo[node.get('locale')];
                };
                return await new model(countryInfo).save();
            });

            const result = await Promise.all([...createDelegatedCountryTasks]);
            _map(result, delegated => {
                console.log(`> [Country List] Create a delegated country: ${delegated.isoCode} - ${delegated.code}`);
            })

            // delegated = await new model(delegatedCountry[0]).save(); 
            // console.log(`> [Country List] Create a delegated country: ${delegated.code}`);
        } else {
            console.log('> [Country List] Delegated country and no need to create');
        }
    } catch (err) {
        console.log('> [Country List] Cannot create a delegated country entry.');
        console.log(err);
        process.exit(1);
    }
};

function createCountryModel () {
    const nextNode = this;
    const Types = nextNode.Field.Types;
    const advancedModels = nextNode.get('advanced country model') || {};

    const multilingual = nextNode.get('localization');

    const { list = {}, field = {}, advancePlugin } = typeof advancedModels === 'function' ? 
    advancedModels(this) : advancedModels;
    // if (multilingual) {
    //     delegatedCountry = {
    //         ...delegatedCountry,
    //         country: {
    //             [nextNode.get('locale')]: 'Hong Kong',
    //         }
    //     }
    // }
    // delegatedCountry = {
    //     ...delegatedCountry,
    //     _id: nextNode.mongoose.Types.ObjectId('5c7ce286d080dd49e0a8f02c'),
    // };
    const CountryList = new nextNode.List('CountryCode', {
        track: true,
        noscale: true,
        // nodelete: true,
        // nocreate: true,
        // nodownload: true,
        multilingual,
        map: {
            name: 'code',
        },
        isCore: true,
        searchFields: 'country, code',
        defaultColumns: 'country, code, updatedAt',
        defaultSort: '-country',
        ...list,
    });

    /*
    ** Addon for the customized options from client
    ** Central initialization in this delegated method
    ** Terry Chan
    ** 09/04/2019
    */
    const extraFields = declareCustomizedOption(nextNode, field);

    CountryList.add(
        "Basic Information",
        {
            enabled: {
                type: Types.Boolean,
                initial: true,
                default: true,
                restrictDelegated: true,
                multilingual: false,
            },
            country: {
                type: Types.Text,
                required: true,
                restrictDelegated: true,
                initial: true,
                multilingual: true,
            },
            ordering: {
                type: Types.Number,
                default: 1,
            },
            ...extraFields,
            delegated: { 
                restrictDelegated: true,
                type: Types.Boolean,
                noedit: true,
                hidden: true, 
            },
        },
        "Code Information",
        {
            isoCode: {
                type: Types.Text,
                required: true,
                multilingual: false,
                restrictDelegated: true,
                initial: true,
            },
            code: {
                type: Types.Text,
                initial: true,
                restrictDelegated: true,
                multilingual: false,
            },
        },
    );

    let options = {};
    if (advancePlugin) {
        options = {
            ...options,
            plugin: [
                advancePlugin,
            ],
        };
    }

    CountryList.register(options);

    return createDelegatedCountry(nextNode, CountryList.model);
}

module.exports = createCountryModel;