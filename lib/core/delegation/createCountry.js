// const nextnode = require('next-nodecms');
// const PermissionType = require('./../enum/PermissionType');
// const Types = keystone.Field.Types;
const _find = require('lodash/find');
const _keys = require('lodash/keys');
const _map = require('lodash/map');
const _forOwn = require('lodash/forOwn');

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
        isoCode: 'BD',
        country: {
            en: 'Bangladesh',
            zhcn: '孟加拉国',
            zhtw: '孟加拉'
        },
        code: '+880',
        delegated: true,
    },
    {
        isoCode: 'MX',
        country: {
            en: 'Mexico',
            zhcn: '墨西哥',
            zhtw: '墨西哥'
        },
        code: '+52',
        delegated: true,
    },
    {
        isoCode: 'IL',
        country: {
            en: 'Israel',
            zhcn: '以色列',
            zhtw: '以色列'
        },
        code: '+972',
        delegated: true,
    },
    {
        isoCode: 'FR',
        country: {
            en: 'France',
            zhcn: '法国',
            zhtw: '法國'
        },
        code: '+33',
        delegated: true,
    },
    {
        isoCode: 'IO',
        country: {
            en: 'British Indian Ocean Territory',
            zhcn: '英属印度洋领地',
            zhtw: '英屬印度洋地區'
        },
        code: '+246',
        delegated: true,
    },
    {
        isoCode: 'MY',
        country: {
            en: 'Malaysia',
            zhcn: '马来西亚',
            zhtw: '馬來西亞'
        },
        code: '+60',
        delegated: true,
    },
    {
        isoCode: 'FI',
        country: {
            en: 'Finland',
            zhcn: '芬兰',
            zhtw: '芬蘭'
        },
        code: '+358',
        delegated: true,
    },
    {
        isoCode: 'FJ',
        country: {
            en: 'Fiji',
            zhcn: '斐济群岛',
            zhtw: '斐濟'
        },
        code: '+679',
        delegated: true,
    },
    {
        isoCode: 'FK',
        country: {
            en: 'Falkland Islands',
            zhcn: '马尔维纳斯群岛（福克兰）',
            zhtw: '福克蘭群島（馬爾維納斯）'
        },
        code: '+500',
        delegated: true,
    },
    {
        isoCode: 'FM',
        country: {
            en: 'Micronesia',
            zhcn: '密克罗尼西亚联邦',
            zhtw: '密克羅尼西亞'
        },
        code: '+691',
        delegated: true,
    },
    {
        isoCode: 'FO',
        country: {
            en: 'Faroe Islands',
            zhcn: '法罗群岛',
            zhtw: '法羅群島'
        },
        code: '+298',
        delegated: true,
    },
    {
        isoCode: 'TZ',
        country: {
            en: 'Tanzania',
            zhcn: '坦桑尼亚',
            zhtw: '坦桑尼亞'
        },
        code: '+255',
        delegated: true,
    },
    {
        isoCode: 'NI',
        country: {
            en: 'Nicaragua',
            zhcn: '尼加拉瓜',
            zhtw: '尼加拉瓜'
        },
        code: '+505',
        delegated: true,
    },
    {
        isoCode: 'UG',
        country: {
            en: 'Uganda',
            zhcn: '乌干达',
            zhtw: '烏干達'
        },
        code: '+256',
        delegated: true,
    },
    {
        isoCode: 'NL',
        country: {
            en: 'Netherlands',
            zhcn: '荷兰',
            zhtw: '荷蘭'
        },
        code: '+31',
        delegated: true,
    },
    {
        isoCode: 'IM',
        country: {
            en: 'Isle of Man',
            zhcn: '马恩岛',
            zhtw: '萌島'
        },
        code: '+44-1624',
        delegated: true,
    },
    {
        isoCode: 'NO',
        country: {
            en: 'Norway',
            zhcn: '挪威',
            zhtw: '挪威'
        },
        code: '+47',
        delegated: true,
    },
    {
        isoCode: 'MR',
        country: {
            en: 'Mauritania',
            zhcn: '毛里塔尼亚',
            zhtw: '毛里塔尼亞'
        },
        code: '+222',
        delegated: true,
    },
    {
        isoCode: 'NA',
        country: {
            en: 'Namibia',
            zhcn: '纳米比亚',
            zhtw: '納米比亞'
        },
        code: '+264',
        delegated: true,
    },
    {
        isoCode: 'MS',
        country: {
            en: 'Montserrat',
            zhcn: '蒙塞拉特岛',
            zhtw: '蒙塞拉特島'
        },
        code: '+1-664',
        delegated: true,
    },
    {
        isoCode: 'VU',
        country: {
            en: 'Vanuatu',
            zhcn: '瓦努阿图',
            zhtw: '瓦努阿圖'
        },
        code: '+678',
        delegated: true,
    },
    {
        isoCode: 'MP',
        country: {
            en: 'Northern Mariana Islands',
            zhcn: '北马里亚纳群岛',
            zhtw: '北馬里亞納群島'
        },
        code: '+1-670',
        delegated: true,
    },
    {
        isoCode: 'NC',
        country: {
            en: 'New Caledonia',
            zhcn: '新喀里多尼亚',
            zhtw: '新喀里多尼亞'
        },
        code: '+687',
        delegated: true,
    },
    {
        isoCode: 'MQ',
        country: {
            en: 'Martinique',
            zhcn: '马提尼克',
            zhtw: '馬提尼克'
        },
        code: '+596',
        delegated: true,
    },
    {
        isoCode: 'NE',
        country: {
            en: 'Niger',
            zhcn: '尼日尔',
            zhtw: '尼日爾'
        },
        code: '+227',
        delegated: true,
    },
    {
        isoCode: 'MV',
        country: {
            en: 'Maldives',
            zhcn: '马尔代夫',
            zhtw: '馬爾代夫'
        },
        code: '+960',
        delegated: true,
    },
    {
        isoCode: 'NF',
        country: {
            en: 'Norfolk Island',
            zhcn: '诺福克岛',
            zhtw: '諾福克島'
        },
        code: '+672',
        delegated: true,
    },
    {
        isoCode: 'MW',
        country: {
            en: 'Malawi',
            zhcn: '马拉维',
            zhtw: '馬拉維'
        },
        code: '+265',
        delegated: true,
    },
    {
        isoCode: 'NG',
        country: {
            en: 'Nigeria',
            zhcn: '尼日利亚',
            zhtw: '尼日利亞'
        },
        code: '+234',
        delegated: true,
    },
    {
        isoCode: 'MT',
        country: {
            en: 'Malta',
            zhcn: '马耳他',
            zhtw: '馬爾他'
        },
        code: '+356',
        delegated: true,
    },
    {
        isoCode: 'NZ',
        country: {
            en: 'New Zealand',
            zhcn: '新西兰',
            zhtw: '新西蘭'
        },
        code: '+64',
        delegated: true,
    },
    {
        isoCode: 'MU',
        country: {
            en: 'Mauritius',
            zhcn: '毛里求斯',
            zhtw: '毛里求斯'
        },
        code: '+230',
        delegated: true,
    },
    {
        isoCode: 'NP',
        country: {
            en: 'Nepal',
            zhcn: '尼泊尔',
            zhtw: '尼泊爾'
        },
        code: '+977',
        delegated: true,
    },
    {
        isoCode: 'MK',
        country: {
            en: 'Macedonia',
            zhcn: '马其顿',
            zhtw: '馬其頓'
        },
        code: '+389',
        delegated: true,
    },
    {
        isoCode: 'NR',
        country: {
            en: 'Nauru',
            zhcn: '瑙鲁',
            zhtw: '瑙魯'
        },
        code: '+674',
        delegated: true,
    },
    {
        isoCode: 'MH',
        country: {
            en: 'Marshall Islands',
            zhcn: '马绍尔群岛',
            zhtw: '馬紹爾群島'
        },
        code: '+692',
        delegated: true,
    },
    {
        isoCode: 'NU',
        country: {
            en: 'Niue',
            zhcn: '纽埃',
            zhtw: '紐埃'
        },
        code: '+683',
        delegated: true,
    },
    {
        isoCode: 'MN',
        country: {
            en: 'Mongolia',
            zhcn: '蒙古国；蒙古',
            zhtw: '蒙古國'
        },
        code: '+976',
        delegated: true,
    },
    {
        isoCode: 'CK',
        country: {
            en: 'Cook Islands',
            zhcn: '库克群岛',
            zhtw: '庫克群島'
        },
        code: '+682',
        delegated: true,
    },
    {
        isoCode: 'MO',
        country: {
            en: 'Macao',
            zhcn: '澳门',
            zhtw: '澳門'
        },
        code: '+853',
        delegated: true,
    },
    {
        isoCode: 'ML',
        country: {
            en: 'Mali',
            zhcn: '马里',
            zhtw: '馬里'
        },
        code: '+223',
        delegated: true,
    },
    {
        isoCode: 'CI',
        country: {
            en: 'Ivory Coast',
            zhcn: '科特迪瓦',
            zhtw: '科特迪瓦'
        },
        code: '+225',
        delegated: true,
    },
    {
        isoCode: 'MM',
        country: {
            en: 'Myanmar',
            zhcn: '缅甸',
            zhtw: '緬甸'
        },
        code: '+95',
        delegated: true,
    },
    {
        isoCode: 'CH',
        country: {
            en: 'Switzerland',
            zhcn: '瑞士',
            zhtw: '瑞士'
        },
        code: '+41',
        delegated: true,
    },
    {
        isoCode: 'UZ',
        country: {
            en: 'Uzbekistan',
            zhcn: '乌兹别克斯坦',
            zhtw: '烏茲別克'
        },
        code: '+998',
        delegated: true,
    },
    {
        isoCode: 'CO',
        country: {
            en: 'Colombia',
            zhcn: '哥伦比亚',
            zhtw: '哥倫比亞'
        },
        code: '+57',
        delegated: true,
    },
    {
        isoCode: 'MC',
        country: {
            en: 'Monaco',
            zhcn: '摩纳哥',
            zhtw: '摩納哥'
        },
        code: '+377',
        delegated: true,
    },
    {
        isoCode: 'CN',
        country: {
            en: 'China',
            zhcn: '中国',
            zhtw: '中國'
        },
        code: '+86',
        delegated: true,
    },
    {
        isoCode: 'MA',
        country: {
            en: 'Morocco',
            zhcn: '摩洛哥',
            zhtw: '摩洛哥'
        },
        code: '+212',
        delegated: true,
    },
    {
        isoCode: 'CM',
        country: {
            en: 'Cameroon',
            zhcn: '喀麦隆',
            zhtw: '喀麥隆'
        },
        code: '+237',
        delegated: true,
    },
    {
        isoCode: 'MF',
        country: {
            en: 'Saint Martin',
            zhcn: '法属圣马丁',
            zhtw: '法屬聖馬丁'
        },
        code: '+590',
        delegated: true,
    },
    {
        isoCode: 'CL',
        country: {
            en: 'Chile',
            zhcn: '智利',
            zhtw: '智利'
        },
        code: '+56',
        delegated: true,
    },
    {
        isoCode: 'MG',
        country: {
            en: 'Madagascar',
            zhcn: '马达加斯加',
            zhtw: '馬達加斯加'
        },
        code: '+261',
        delegated: true,
    },
    {
        isoCode: 'CC',
        country: {
            en: 'Cocos Islands',
            zhcn: '科科斯群岛',
            zhtw: '科科斯群島'
        },
        code: '+61',
        delegated: true,
    },
    {
        isoCode: 'MD',
        country: {
            en: 'Moldova',
            zhcn: '摩尔多瓦',
            zhtw: '摩爾多瓦'
        },
        code: '+373',
        delegated: true,
    },
    {
        isoCode: 'CA',
        country: {
            en: 'Canada',
            zhcn: '加拿大',
            zhtw: '加拿大'
        },
        code: '+1',
        delegated: true,
    },
    {
        isoCode: 'ME',
        country: {
            en: 'Montenegro',
            zhcn: '黑山',
            zhtw: '黑山'
        },
        code: '+382',
        delegated: true,
    },
    {
        isoCode: 'CG',
        country: {
            en: 'Republic of the Congo',
            zhcn: '刚果（布）',
            zhtw: '剛果'
        },
        code: '+242',
        delegated: true,
    },
    {
        isoCode: 'ER',
        country: {
            en: 'Eritrea',
            zhcn: '厄立特里亚',
            zhtw: '厄立特里亞'
        },
        code: '+291',
        delegated: true,
    },
    {
        isoCode: 'CF',
        country: {
            en: 'Central African Republic',
            zhcn: '中非',
            zhtw: '中非'
        },
        code: '+236',
        delegated: true,
    },
    {
        isoCode: 'ES',
        country: {
            en: 'Spain',
            zhcn: '西班牙',
            zhtw: '西班牙'
        },
        code: '+34',
        delegated: true,
    },
    {
        isoCode: 'CD',
        country: {
            en: 'Democratic Republic of the Congo',
            zhcn: '刚果（金）',
            zhtw: '民主剛果'
        },
        code: '+243',
        delegated: true,
    },
    {
        isoCode: 'SA',
        country: {
            en: 'Saudi Arabia',
            zhcn: '沙特阿拉伯',
            zhtw: '沙特阿拉伯'
        },
        code: '+966',
        delegated: true,
    },
    {
        isoCode: 'CZ',
        country: {
            en: 'Czech Republic',
            zhcn: '捷克',
            zhtw: '捷克'
        },
        code: '+420',
        delegated: true,
    },
    {
        isoCode: 'ZW',
        country: {
            en: 'Zimbabwe',
            zhcn: '津巴布韦',
            zhtw: '津巴布韋'
        },
        code: '+263',
        delegated: true,
    },
    {
        isoCode: 'CY',
        country: {
            en: 'Cyprus',
            zhcn: '塞浦路斯',
            zhtw: '塞浦路斯'
        },
        code: '+357',
        delegated: true,
    },
    {
        isoCode: 'SO',
        country: {
            en: 'Somalia',
            zhcn: '索马里',
            zhtw: '索馬里'
        },
        code: '+252',
        delegated: true,
    },
    {
        isoCode: 'CX',
        country: {
            en: 'Christmas Island',
            zhcn: '圣诞岛',
            zhtw: '聖誕島'
        },
        code: '+61',
        delegated: true,
    },
    {
        isoCode: 'ET',
        country: {
            en: 'Ethiopia',
            zhcn: '埃塞俄比亚',
            zhtw: '埃塞俄比亞'
        },
        code: '+251',
        delegated: true,
    },
    {
        isoCode: 'CR',
        country: {
            en: 'Costa Rica',
            zhcn: '哥斯达黎加',
            zhtw: '哥斯達黎加'
        },
        code: '+506',
        delegated: true,
    },
    {
        isoCode: 'SB',
        country: {
            en: 'Solomon Islands',
            zhcn: '所罗门群岛',
            zhtw: '所羅門群島'
        },
        code: '+677',
        delegated: true,
    },
    {
        isoCode: 'CW',
        country: {
            en: 'Curacao',
            zhcn: '库拉索',
            zhtw: '庫拉索'
        },
        code: '+599',
        delegated: true,
    },
    {
        isoCode: 'VN',
        country: {
            en: 'Vietnam',
            zhcn: '越南',
            zhtw: '越南'
        },
        code: '+84',
        delegated: true,
    },
    {
        isoCode: 'CV',
        country: {
            en: 'Cape Verde',
            zhcn: '佛得角',
            zhtw: '佛得角'
        },
        code: '+238',
        delegated: true,
    },
    {
        isoCode: 'IT',
        country: {
            en: 'Italy',
            zhcn: '意大利',
            zhtw: '意大利'
        },
        code: '+39',
        delegated: true,
    },
    {
        isoCode: 'CU',
        country: {
            en: 'Cuba',
            zhcn: '古巴',
            zhtw: '古巴'
        },
        code: '+53',
        delegated: true,
    },
    {
        isoCode: 'EC',
        country: {
            en: 'Ecuador',
            zhcn: '厄瓜多尔',
            zhtw: '厄瓜多爾'
        },
        code: '+593',
        delegated: true,
    },
    {
        isoCode: 'SZ',
        country: {
            en: 'Swaziland',
            zhcn: '斯威士兰',
            zhtw: '斯威士蘭'
        },
        code: '+268',
        delegated: true,
    },
    {
        isoCode: 'ZA',
        country: {
            en: 'South Africa',
            zhcn: '南非',
            zhtw: '南非'
        },
        code: '+27',
        delegated: true,
    },
    {
        isoCode: 'SY',
        country: {
            en: 'Syria',
            zhcn: '叙利亚',
            zhtw: '敘利亞'
        },
        code: '+963',
        delegated: true,
    },
    {
        isoCode: 'EG',
        country: {
            en: 'Egypt',
            zhcn: '埃及',
            zhtw: '埃及'
        },
        code: '+20',
        delegated: true,
    },
    {
        isoCode: 'SX',
        country: {
            en: 'Sint Maarten',
            zhcn: '荷属圣马丁',
            zhtw: '荷屬聖馬丁'
        },
        code: '+599',
        delegated: true,
    },
    {
        isoCode: 'EE',
        country: {
            en: 'Estonia',
            zhcn: '爱沙尼亚',
            zhtw: '愛沙尼亞'
        },
        code: '+372',
        delegated: true,
    },
    {
        isoCode: 'KG',
        country: {
            en: 'Kyrgyzstan',
            zhcn: '吉尔吉斯斯坦',
            zhtw: '吉爾吉斯'
        },
        code: '+996',
        delegated: true,
    },
    {
        isoCode: 'EH',
        country: {
            en: 'Western Sahara',
            zhcn: '西撒哈拉',
            zhtw: '西撒哈拉'
        },
        code: '+212',
        delegated: true,
    },
    {
        isoCode: 'KE',
        country: {
            en: 'Kenya',
            zhcn: '肯尼亚',
            zhtw: '肯尼亞'
        },
        code: '+254',
        delegated: true,
    },
    {
        isoCode: 'ZM',
        country: {
            en: 'Zambia',
            zhcn: '赞比亚',
            zhtw: '贊比亞'
        },
        code: '+260',
        delegated: true,
    },
    {
        isoCode: 'SS',
        country: {
            en: 'South Sudan',
            zhcn: '南苏丹',
            zhtw: '南蘇丹'
        },
        code: '+211',
        delegated: true,
    },
    {
        isoCode: 'PM',
        country: {
            en: 'Saint Pierre and Miquelon',
            zhcn: '圣皮埃尔和密克隆',
            zhtw: '聖皮埃爾島和密克隆島'
        },
        code: '+508',
        delegated: true,
    },
    {
        isoCode: 'SR',
        country: {
            en: 'Suriname',
            zhcn: '苏里南',
            zhtw: '蘇里南'
        },
        code: '+597',
        delegated: true,
    },
    {
        isoCode: 'PL',
        country: {
            en: 'Poland',
            zhcn: '波兰',
            zhtw: '波蘭'
        },
        code: '+48',
        delegated: true,
    },
    {
        isoCode: 'KI',
        country: {
            en: 'Kiribati',
            zhcn: '基里巴斯',
            zhtw: '基里巴斯'
        },
        code: '+686',
        delegated: true,
    },
    {
        isoCode: 'PN',
        country: {
            en: 'Pitcairn',
            zhcn: '皮特凯恩群岛',
            zhtw: '皮特凱恩群島'
        },
        code: '+870',
        delegated: true,
    },
    {
        isoCode: 'KH',
        country: {
            en: 'Cambodia',
            zhcn: '柬埔寨',
            zhtw: '柬埔寨'
        },
        code: '+855',
        delegated: true,
    },
    {
        isoCode: 'PH',
        country: {
            en: 'Philippines',
            zhcn: '菲律宾',
            zhtw: '菲律賓'
        },
        code: '+63',
        delegated: true,
    },
    {
        isoCode: 'KN',
        country: {
            en: 'Saint Kitts and Nevis',
            zhcn: '圣基茨和尼维斯',
            zhtw: '聖基茨和尼維斯'
        },
        code: '+1-869',
        delegated: true,
    },
    {
        isoCode: 'PK',
        country: {
            en: 'Pakistan',
            zhcn: '巴基斯坦',
            zhtw: '巴基斯坦'
        },
        code: '+92',
        delegated: true,
    },
    {
        isoCode: 'KM',
        country: {
            en: 'Comoros',
            zhcn: '科摩罗',
            zhtw: '科摩羅'
        },
        code: '+269',
        delegated: true,
    },
    {
        isoCode: 'PE',
        country: {
            en: 'Peru',
            zhcn: '秘鲁',
            zhtw: '秘魯'
        },
        code: '+51',
        delegated: true,
    },
    {
        isoCode: 'ST',
        country: {
            en: 'Sao Tome and Principe',
            zhcn: '圣多美和普林西比',
            zhtw: '聖多美及普林西比'
        },
        code: '+239',
        delegated: true,
    },
    {
        isoCode: 'PG',
        country: {
            en: 'Papua New Guinea',
            zhcn: '巴布亚新几内亚',
            zhtw: '巴布亞新幾內亞'
        },
        code: '+675',
        delegated: true,
    },
    {
        isoCode: 'SK',
        country: {
            en: 'Slovakia',
            zhcn: '斯洛伐克',
            zhtw: '斯洛伐克'
        },
        code: '+421',
        delegated: true,
    },
    {
        isoCode: 'PF',
        country: {
            en: 'French Polynesia',
            zhcn: '法属波利尼西亚',
            zhtw: '法屬波利尼西亞'
        },
        code: '+689',
        delegated: true,
    },
    {
        isoCode: 'KR',
        country: {
            en: 'South Korea',
            zhcn: '韩国；南朝鲜',
            zhtw: '韓國；南韓'
        },
        code: '+82',
        delegated: true,
    },
    {
        isoCode: 'PA',
        country: {
            en: 'Panama',
            zhcn: '巴拿马',
            zhtw: '巴拿馬'
        },
        code: '+507',
        delegated: true,
    },
    {
        isoCode: 'SI',
        country: {
            en: 'Slovenia',
            zhcn: '斯洛文尼亚',
            zhtw: '斯洛文尼亞'
        },
        code: '+386',
        delegated: true,
    },
    {
        isoCode: 'IQ',
        country: {
            en: 'Iraq',
            zhcn: '伊拉克',
            zhtw: '伊拉克'
        },
        code: '+964',
        delegated: true,
    },
    {
        isoCode: 'KP',
        country: {
            en: 'North Korea',
            zhcn: '朝鲜；北朝鲜',
            zhtw: '朝鲜；北韓'
        },
        code: '+850',
        delegated: true,
    },
    {
        isoCode: 'PY',
        country: {
            en: 'Paraguay',
            zhcn: '巴拉圭',
            zhtw: '巴拉圭'
        },
        code: '+595',
        delegated: true,
    },
    {
        isoCode: 'KW',
        country: {
            en: 'Kuwait',
            zhcn: '科威特',
            zhtw: '科威特'
        },
        code: '+965',
        delegated: true,
    },
    {
        isoCode: 'SJ',
        country: {
            en: 'Svalbard and Jan Mayen',
            zhcn: '斯瓦尔巴群岛和扬马延岛',
            zhtw: '斯瓦爾巴特群島'
        },
        code: '+47',
        delegated: true,
    },
    {
        isoCode: 'SN',
        country: {
            en: 'Senegal',
            zhcn: '塞内加尔',
            zhtw: '塞內加爾'
        },
        code: '+221',
        delegated: true,
    },
    {
        isoCode: 'PT',
        country: {
            en: 'Portugal',
            zhcn: '葡萄牙',
            zhtw: '葡萄牙'
        },
        code: '+351',
        delegated: true,
    },
    {
        isoCode: 'SM',
        country: {
            en: 'San Marino',
            zhcn: '圣马力诺',
            zhtw: '聖馬力諾'
        },
        code: '+378',
        delegated: true,
    },
    {
        isoCode: 'PW',
        country: {
            en: 'Palau',
            zhcn: '帕劳',
            zhtw: '帕勞；帛琉'
        },
        code: '+680',
        delegated: true,
    },
    {
        isoCode: 'SL',
        country: {
            en: 'Sierra Leone',
            zhcn: '塞拉利昂',
            zhtw: '塞拉利昂'
        },
        code: '+232',
        delegated: true,
    },
    {
        isoCode: 'PS',
        country: {
            en: 'Palestinian Territory',
            zhcn: '巴勒斯坦',
            zhtw: '巴勒斯坦'
        },
        code: '+970',
        delegated: true,
    },
    {
        isoCode: 'SC',
        country: {
            en: 'Seychelles',
            zhcn: '塞舌尔',
            zhtw: '塞舌爾'
        },
        code: '+248',
        delegated: true,
    },
    {
        isoCode: 'PR',
        country: {
            en: 'Puerto Rico',
            zhcn: '波多黎各',
            zhtw: '波多黎各'
        },
        code: '+1-787 and 1-939',
        delegated: true,
    },
    {
        isoCode: 'KZ',
        country: {
            en: 'Kazakhstan',
            zhcn: '哈萨克斯坦',
            zhtw: '哈薩克'
        },
        code: '+7',
        delegated: true,
    },
    {
        isoCode: 'VE',
        country: {
            en: 'Venezuela',
            zhcn: '委内瑞拉',
            zhtw: '委內瑞拉'
        },
        code: '+58',
        delegated: true,
    },
    {
        isoCode: 'KY',
        country: {
            en: 'Cayman Islands',
            zhcn: '开曼群岛',
            zhtw: '開曼群島'
        },
        code: '+1-345',
        delegated: true,
    },
    {
        isoCode: 'HM',
        country: {
            en: 'Heard Island and McDonald Islands',
            zhcn: '赫德岛和麦克唐纳群岛',
            zhtw: '赫德島和麥克唐納群島'
        },
        code: '+ ',
        delegated: true,
    },
    {
        isoCode: 'SG',
        country: {
            en: 'Singapore',
            zhcn: '新加坡',
            zhtw: '新加坡；星加坡'
        },
        code: '+65',
        delegated: true,
    },
    {
        isoCode: 'HN',
        country: {
            en: 'Honduras',
            zhcn: '洪都拉斯',
            zhtw: '宏都拉斯'
        },
        code: '+504',
        delegated: true,
    },
    {
        isoCode: 'SE',
        country: {
            en: 'Sweden',
            zhcn: '瑞典',
            zhtw: '瑞典'
        },
        code: '+46',
        delegated: true,
    },
    {
        isoCode: 'HK',
        country: {
            en: 'Hong Kong',
            zhcn: '香港',
            zhtw: '香港'
        },
        code: '+852',
        delegated: true,
    },
    {
        isoCode: 'SD',
        country: {
            en: 'Sudan',
            zhcn: '苏丹',
            zhtw: '蘇丹'
        },
        code: '+249',
        delegated: true,
    },
    {
        isoCode: 'HU',
        country: {
            en: 'Hungary',
            zhcn: '匈牙利',
            zhtw: '匈牙利'
        },
        code: '+36',
        delegated: true,
    },
    {
        isoCode: 'DO',
        country: {
            en: 'Dominican Republic',
            zhcn: '多米尼加',
            zhtw: '多明尼加'
        },
        code: '+1-809 and 1-829',
        delegated: true,
    },
    {
        isoCode: 'HT',
        country: {
            en: 'Haiti',
            zhcn: '海地',
            zhtw: '海地'
        },
        code: '+509',
        delegated: true,
    },
    {
        isoCode: 'DM',
        country: {
            en: 'Dominica',
            zhcn: '多米尼克',
            zhtw: '多米尼克'
        },
        code: '+1-767',
        delegated: true,
    },
    {
        isoCode: 'HR',
        country: {
            en: 'Croatia',
            zhcn: '克罗地亚',
            zhtw: '克羅地亞'
        },
        code: '+385',
        delegated: true,
    },
    {
        isoCode: 'DJ',
        country: {
            en: 'Djibouti',
            zhcn: '吉布提',
            zhtw: '吉布提'
        },
        code: '+253',
        delegated: true,
    },
    {
        isoCode: 'JO',
        country: {
            en: 'Jordan',
            zhcn: '约旦',
            zhtw: '約旦'
        },
        code: '+962',
        delegated: true,
    },
    {
        isoCode: 'DK',
        country: {
            en: 'Denmark',
            zhcn: '丹麦',
            zhtw: '丹麥'
        },
        code: '+45',
        delegated: true,
    },
    {
        isoCode: 'TN',
        country: {
            en: 'Tunisia',
            zhcn: '突尼斯',
            zhtw: '突尼斯'
        },
        code: '+216',
        delegated: true,
    },
    {
        isoCode: 'VG',
        country: {
            en: 'British Virgin Islands',
            zhcn: '英属维尔京群岛',
            zhtw: '英屬處女群島'
        },
        code: '+1-284',
        delegated: true,
    },
    {
        isoCode: 'OM',
        country: {
            en: 'Oman',
            zhcn: '阿曼',
            zhtw: '阿曼'
        },
        code: '+968',
        delegated: true,
    },
    {
        isoCode: 'DE',
        country: {
            en: 'Germany',
            zhcn: '德国',
            zhtw: '德國'
        },
        code: '+49',
        delegated: true,
    },
    {
        isoCode: 'GH',
        country: {
            en: 'Ghana',
            zhcn: '加纳',
            zhtw: '加納'
        },
        code: '+233',
        delegated: true,
    },
    {
        isoCode: 'YE',
        country: {
            en: 'Yemen',
            zhcn: '也门',
            zhtw: '也門'
        },
        code: '+967',
        delegated: true,
    },
    {
        isoCode: 'GI',
        country: {
            en: 'Gibraltar',
            zhcn: '直布罗陀',
            zhtw: '直布羅陀'
        },
        code: '+350',
        delegated: true,
    },
    {
        isoCode: 'DZ',
        country: {
            en: 'Algeria',
            zhcn: '阿尔及利亚',
            zhtw: '阿爾及利亞'
        },
        code: '+213',
        delegated: true,
    },
    {
        isoCode: 'GL',
        country: {
            en: 'Greenland',
            zhcn: '格陵兰',
            zhtw: '格陵蘭'
        },
        code: '+299',
        delegated: true,
    },
    {
        isoCode: 'US',
        country: {
            en: 'United States',
            zhcn: '美国',
            zhtw: '美國'
        },
        code: '+1',
        delegated: true,
    },
    {
        isoCode: 'GM',
        country: {
            en: 'Gambia',
            zhcn: '冈比亚',
            zhtw: '岡比亞'
        },
        code: '+220',
        delegated: true,
    },
    {
        isoCode: 'UY',
        country: {
            en: 'Uruguay',
            zhcn: '乌拉圭',
            zhtw: '烏拉圭'
        },
        code: '+598',
        delegated: true,
    },
    {
        isoCode: 'GN',
        country: {
            en: 'Guinea',
            zhcn: '几内亚',
            zhtw: '幾內亞'
        },
        code: '+224',
        delegated: true,
    },
    {
        isoCode: 'YT',
        country: {
            en: 'Mayotte',
            zhcn: '马约特',
            zhtw: '馬約特'
        },
        code: '+262',
        delegated: true,
    },
    {
        isoCode: 'SV',
        country: {
            en: 'El Salvador',
            zhcn: '萨尔瓦多',
            zhtw: '薩爾瓦多'
        },
        code: '+503',
        delegated: true,
    },
    {
        isoCode: 'UM',
        country: {
            en: 'United States Minor Outlying Islands',
            zhcn: '美国本土外小岛屿',
            zhtw: '美國海外小島'
        },
        code: '+1',
        delegated: true,
    },
    {
        isoCode: 'GA',
        country: {
            en: 'Gabon',
            zhcn: '加蓬',
            zhtw: '加蓬'
        },
        code: '+241',
        delegated: true,
    },
    {
        isoCode: 'LB',
        country: {
            en: 'Lebanon',
            zhcn: '黎巴嫩',
            zhtw: '黎巴嫩'
        },
        code: '+961',
        delegated: true,
    },
    {
        isoCode: 'GB',
        country: {
            en: 'United Kingdom',
            zhcn: '英国',
            zhtw: '英國'
        },
        code: '+44',
        delegated: true,
    },
    {
        isoCode: 'LC',
        country: {
            en: 'Saint Lucia',
            zhcn: '圣卢西亚',
            zhtw: '聖盧西亞'
        },
        code: '+1-758',
        delegated: true,
    },
    {
        isoCode: 'GD',
        country: {
            en: 'Grenada',
            zhcn: '格林纳达',
            zhtw: '格林納達'
        },
        code: '+1-473',
        delegated: true,
    },
    {
        isoCode: 'LA',
        country: {
            en: 'Laos',
            zhcn: '老挝',
            zhtw: '老挝'
        },
        code: '+856',
        delegated: true,
    },
    {
        isoCode: 'GE',
        country: {
            en: 'Georgia',
            zhcn: '格鲁吉亚',
            zhtw: '格魯吉亞'
        },
        code: '+995',
        delegated: true,
    },
    {
        isoCode: 'TV',
        country: {
            en: 'Tuvalu',
            zhcn: '图瓦卢',
            zhtw: '圖瓦盧'
        },
        code: '+688',
        delegated: true,
    },
    {
        isoCode: 'GF',
        country: {
            en: 'French Guiana',
            zhcn: '法属圭亚那',
            zhtw: '法屬圭亞那'
        },
        code: '+594',
        delegated: true,
    },
    {
        isoCode: 'TW',
        country: {
            en: 'Taiwan',
            zhcn: '台湾',
            zhtw: '台湾；臺灣'
        },
        code: '+886',
        delegated: true,
    },
    {
        isoCode: 'GG',
        country: {
            en: 'Guernsey',
            zhcn: '根西岛',
            zhtw: '根西島'
        },
        code: '+44-1481',
        delegated: true,
    },
    {
        isoCode: 'TT',
        country: {
            en: 'Trinidad and Tobago',
            zhcn: '特立尼达和多巴哥',
            zhtw: '千里達和多巴哥'
        },
        code: '+1-868',
        delegated: true,
    },
    {
        isoCode: 'GY',
        country: {
            en: 'Guyana',
            zhcn: '圭亚那',
            zhtw: '圭亞那'
        },
        code: '+592',
        delegated: true,
    },
    {
        isoCode: 'TR',
        country: {
            en: 'Turkey',
            zhcn: '土耳其',
            zhtw: '土耳其'
        },
        code: '+90',
        delegated: true,
    },
    {
        isoCode: 'JP',
        country: {
            en: 'Japan',
            zhcn: '日本',
            zhtw: '日本'
        },
        code: '+81',
        delegated: true,
    },
    {
        isoCode: 'LK',
        country: {
            en: 'Sri Lanka',
            zhcn: '斯里兰卡',
            zhtw: '斯里蘭卡'
        },
        code: '+94',
        delegated: true,
    },
    {
        isoCode: 'GP',
        country: {
            en: 'Guadeloupe',
            zhcn: '瓜德罗普',
            zhtw: '瓜德魯普島'
        },
        code: '+590',
        delegated: true,
    },
    {
        isoCode: 'LI',
        country: {
            en: 'Liechtenstein',
            zhcn: '列支敦士登',
            zhtw: '列支敦士登'
        },
        code: '+423',
        delegated: true,
    },
    {
        isoCode: 'GQ',
        country: {
            en: 'Equatorial Guinea',
            zhcn: '赤道几内亚',
            zhtw: '赤道幾內亞'
        },
        code: '+240',
        delegated: true,
    },
    {
        isoCode: 'LV',
        country: {
            en: 'Latvia',
            zhcn: '拉脱维亚',
            zhtw: '拉脫維亞'
        },
        code: '+371',
        delegated: true,
    },
    {
        isoCode: 'GR',
        country: {
            en: 'Greece',
            zhcn: '希腊',
            zhtw: '希臘'
        },
        code: '+30',
        delegated: true,
    },
    {
        isoCode: 'TO',
        country: {
            en: 'Tonga',
            zhcn: '汤加',
            zhtw: '湯加'
        },
        code: '+676',
        delegated: true,
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
        code: '+370',
        delegated: true,
    },
    {
        isoCode: 'GT',
        country: {
            en: 'Guatemala',
            zhcn: '危地马拉',
            zhtw: '危地馬拉'
        },
        code: '+502',
        delegated: true,
    },
    {
        isoCode: 'LU',
        country: {
            en: 'Luxembourg',
            zhcn: '卢森堡',
            zhtw: '盧森堡'
        },
        code: '+352',
        delegated: true,
    },
    {
        isoCode: 'GU',
        country: {
            en: 'Guam',
            zhcn: '关岛',
            zhtw: '關島'
        },
        code: '+1-671',
        delegated: true,
    },
    {
        isoCode: 'LR',
        country: {
            en: 'Liberia',
            zhcn: '利比里亚',
            zhtw: '利比里亞'
        },
        code: '+231',
        delegated: true,
    },
    {
        isoCode: 'GW',
        country: {
            en: 'Guinea-Bissau',
            zhcn: '几内亚比绍',
            zhtw: '幾內亞比紹'
        },
        code: '+245',
        delegated: true,
    },
    {
        isoCode: 'LS',
        country: {
            en: 'Lesotho',
            zhcn: '莱索托',
            zhtw: '萊索托'
        },
        code: '+266',
        delegated: true,
    },
    {
        isoCode: 'TK',
        country: {
            en: 'Tokelau',
            zhcn: '托克劳',
            zhtw: '托克勞群島'
        },
        code: '+690',
        delegated: true,
    },
    {
        isoCode: 'TH',
        country: {
            en: 'Thailand',
            zhcn: '泰国',
            zhtw: '泰國'
        },
        code: '+66',
        delegated: true,
    },
    {
        isoCode: 'RO',
        country: {
            en: 'Romania',
            zhcn: '罗马尼亚',
            zhtw: '羅馬尼亞'
        },
        code: '+40',
        delegated: true,
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
        code: '+992',
        delegated: true,
    },
    {
        isoCode: 'TG',
        country: {
            en: 'Togo',
            zhcn: '多哥',
            zhtw: '多哥'
        },
        code: '+228',
        delegated: true,
    },
    {
        isoCode: 'TM',
        country: {
            en: 'Turkmenistan',
            zhcn: '土库曼斯坦',
            zhtw: '土庫曼'
        },
        code: '+993',
        delegated: true,
    },
    {
        isoCode: 'TD',
        country: {
            en: 'Chad',
            zhcn: '乍得',
            zhtw: '乍得'
        },
        code: '+235',
        delegated: true,
    },
    {
        isoCode: 'RE',
        country: {
            en: 'Reunion',
            zhcn: '留尼汪',
            zhtw: '留尼汪'
        },
        code: '+262',
        delegated: true,
    },
    {
        isoCode: 'TC',
        country: {
            en: 'Turks and Caicos Islands',
            zhcn: '特克斯和凯科斯群岛',
            zhtw: '特克斯和凱科斯群島'
        },
        code: '+1-649',
        delegated: true,
    },
    {
        isoCode: 'TL',
        country: {
            en: 'East Timor',
            zhcn: '东帝汶',
            zhtw: '東帝汶'
        },
        code: '+670',
        delegated: true,
    },
    {
        isoCode: 'LY',
        country: {
            en: 'Libya',
            zhcn: '利比亚',
            zhtw: '利比亞'
        },
        code: '+218',
        delegated: true,
    },
    {
        isoCode: 'RS',
        country: {
            en: 'Serbia',
            zhcn: '塞尔维亚',
            zhtw: '塞爾維亞'
        },
        code: '+381',
        delegated: true,
    },
    {
        isoCode: 'VA',
        country: {
            en: 'Vatican',
            zhcn: '梵蒂冈',
            zhtw: '梵蒂岡'
        },
        code: '+379',
        delegated: true,
    },
    {
        isoCode: 'RW',
        country: {
            en: 'Rwanda',
            zhcn: '卢旺达',
            zhtw: '盧旺達'
        },
        code: '+250',
        delegated: true,
    },
    {
        isoCode: 'VC',
        country: {
            en: 'Saint Vincent and the Grenadines',
            zhcn: '圣文森特和格林纳丁斯',
            zhtw: '聖文森特和格林納丁斯'
        },
        code: '+1-784',
        delegated: true,
    },
    {
        isoCode: 'RU',
        country: {
            en: 'Russia',
            zhcn: '俄罗斯',
            zhtw: '俄羅斯'
        },
        code: '+7',
        delegated: true,
    },
    {
        isoCode: 'AE',
        country: {
            en: 'United Arab Emirates',
            zhcn: '阿联酋',
            zhtw: '阿聯酋'
        },
        code: '+971',
        delegated: true,
    },
    {
        isoCode: 'BZ',
        country: {
            en: 'Belize',
            zhcn: '伯利兹',
            zhtw: '伯利茲'
        },
        code: '+501',
        delegated: true,
    },
    {
        isoCode: 'AD',
        country: {
            en: 'Andorra',
            zhcn: '安道尔',
            zhtw: '安道爾'
        },
        code: '+376',
        delegated: true,
    },
    {
        isoCode: 'BY',
        country: {
            en: 'Belarus',
            zhcn: '白俄罗斯',
            zhtw: '白俄羅斯'
        },
        code: '+375',
        delegated: true,
    },
    {
        isoCode: 'AG',
        country: {
            en: 'Antigua and Barbuda',
            zhcn: '安提瓜和巴布达',
            zhtw: '安提瓜和巴布達'
        },
        code: '+1-268',
        delegated: true,
    },
    {
        isoCode: 'JE',
        country: {
            en: 'Jersey',
            zhcn: '泽西岛',
            zhtw: '澤西'
        },
        code: '+44-1534',
        delegated: true,
    },
    {
        isoCode: 'AF',
        country: {
            en: 'Afghanistan',
            zhcn: '阿富汗',
            zhtw: '阿富汗'
        },
        code: '+93',
        delegated: true,
    },
    {
        isoCode: 'BS',
        country: {
            en: 'Bahamas',
            zhcn: '巴哈马',
            zhtw: '巴哈馬'
        },
        code: '+1-242',
        delegated: true,
    },
    {
        isoCode: 'AI',
        country: {
            en: 'Anguilla',
            zhcn: '安圭拉',
            zhtw: '安圭拉島'
        },
        code: '+1-264',
        delegated: true,
    },
    {
        isoCode: 'BR',
        country: {
            en: 'Brazil',
            zhcn: '巴西',
            zhtw: '巴西'
        },
        code: '+55',
        delegated: true,
    },
    {
        isoCode: 'VI',
        country: {
            en: 'U.S. Virgin Islands',
            zhcn: '美属维尔京群岛',
            zhtw: '美屬處女群島'
        },
        code: '+1-340',
        delegated: true,
    },
    {
        isoCode: 'BQ',
        country: {
            en: 'Bonaire, Saint Eustatius and Saba ',
            zhcn: '荷兰加勒比区',
            zhtw: '荷蘭加勒比區'
        },
        code: '+599',
        delegated: true,
    },
    {
        isoCode: 'IS',
        country: {
            en: 'Iceland',
            zhcn: '冰岛',
            zhtw: '冰島'
        },
        code: '+354',
        delegated: true,
    },
    {
        isoCode: 'WS',
        country: {
            en: 'Samoa',
            zhcn: '萨摩亚',
            zhtw: '薩摩亞'
        },
        code: '+685',
        delegated: true,
    },
    {
        isoCode: 'IR',
        country: {
            en: 'Iran',
            zhcn: '伊朗',
            zhtw: '伊朗'
        },
        code: '+98',
        delegated: true,
    },
    {
        isoCode: 'BW',
        country: {
            en: 'Botswana',
            zhcn: '博茨瓦纳',
            zhtw: '博茨瓦納'
        },
        code: '+267',
        delegated: true,
    },
    {
        isoCode: 'AM',
        country: {
            en: 'Armenia',
            zhcn: '亚美尼亚',
            zhtw: '亞美尼亞'
        },
        code: '+374',
        delegated: true,
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
        code: '+355',
        delegated: true,
    },
    {
        isoCode: 'JM',
        country: {
            en: 'Jamaica',
            zhcn: '牙买加',
            zhtw: '牙買加'
        },
        code: '+1-876',
        delegated: true,
    },
    {
        isoCode: 'AO',
        country: {
            en: 'Angola',
            zhcn: '安哥拉',
            zhtw: '安哥拉'
        },
        code: '+244',
        delegated: true,
    },
    {
        isoCode: 'BT',
        country: {
            en: 'Bhutan',
            zhcn: '不丹',
            zhtw: '不丹'
        },
        code: '+975',
        delegated: true,
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
        code: '+229',
        delegated: true,
    },
    {
        isoCode: 'AS',
        country: {
            en: 'American Samoa',
            zhcn: '美属萨摩亚',
            zhtw: '美屬薩摩亞'
        },
        code: '+1-684',
        delegated: true,
    },
    {
        isoCode: 'BI',
        country: {
            en: 'Burundi',
            zhcn: '布隆迪',
            zhtw: '布隆迪'
        },
        code: '+257',
        delegated: true,
    },
    {
        isoCode: 'AR',
        country: {
            en: 'Argentina',
            zhcn: '阿根廷',
            zhtw: '阿根廷'
        },
        code: '+54',
        delegated: true,
    },
    {
        isoCode: 'BH',
        country: {
            en: 'Bahrain',
            zhcn: '巴林',
            zhtw: '巴林'
        },
        code: '+973',
        delegated: true,
    },
    {
        isoCode: 'AU',
        country: {
            en: 'Australia',
            zhcn: '澳大利亚',
            zhtw: '澳洲'
        },
        code: '+61',
        delegated: true,
    },
    {
        isoCode: 'BO',
        country: {
            en: 'Bolivia',
            zhcn: '玻利维亚',
            zhtw: '玻利維亞'
        },
        code: '+591',
        delegated: true,
    },
    {
        isoCode: 'AT',
        country: {
            en: 'Austria',
            zhcn: '奥地利',
            zhtw: '奧地利'
        },
        code: '+43',
        delegated: true,
    },
    {
        isoCode: 'BN',
        country: {
            en: 'Brunei',
            zhcn: '文莱',
            zhtw: '汶萊'
        },
        code: '+673',
        delegated: true,
    },
    {
        isoCode: 'AW',
        country: {
            en: 'Aruba',
            zhcn: '阿鲁巴',
            zhtw: '阿魯巴'
        },
        code: '+297',
        delegated: true,
    },
    {
        isoCode: 'BM',
        country: {
            en: 'Bermuda',
            zhcn: '百慕大',
            zhtw: '百慕達'
        },
        code: '+1-441',
        delegated: true,
    },
    {
        isoCode: 'IN',
        country: {
            en: 'India',
            zhcn: '印度',
            zhtw: '印度'
        },
        code: '+91',
        delegated: true,
    },
    {
        isoCode: 'BL',
        country: {
            en: 'Saint Barthelemy',
            zhcn: '圣巴泰勒米岛',
            zhtw: '聖巴托洛繆島'
        },
        code: '+590',
        delegated: true,
    },
    {
        isoCode: 'AX',
        country: {
            en: 'Aland Islands',
            zhcn: '奥兰群岛',
            zhtw: '亞蘭群島'
        },
        code: '+358-18',
        delegated: true,
    },
    {
        isoCode: 'WF',
        country: {
            en: 'Wallis and Futuna',
            zhcn: '瓦利斯和富图纳',
            zhtw: '瓦利斯群島和富圖納群島'
        },
        code: '+681',
        delegated: true,
    },
    {
        isoCode: 'AZ',
        country: {
            en: 'Azerbaijan',
            zhcn: '阿塞拜疆',
            zhtw: '阿塞拜疆'
        },
        code: '+994',
        delegated: true,
    },
    {
        isoCode: 'BB',
        country: {
            en: 'Barbados',
            zhcn: '巴巴多斯',
            zhtw: '巴巴多斯'
        },
        code: '+1-246',
        delegated: true,
    },
    {
        isoCode: 'IE',
        country: {
            en: 'Ireland',
            zhcn: '爱尔兰',
            zhtw: '愛爾蘭'
        },
        code: '+353',
        delegated: true,
    },
    {
        isoCode: 'BA',
        country: {
            en: 'Bosnia and Herzegovina',
            zhcn: '波黑',
            zhtw: '波黑'
        },
        code: '+387',
        delegated: true,
    },
    {
        isoCode: 'ID',
        country: {
            en: 'Indonesia',
            zhcn: '印尼',
            zhtw: '印尼'
        },
        code: '+62',
        delegated: true,
    },
    {
        isoCode: 'BG',
        country: {
            en: 'Bulgaria',
            zhcn: '保加利亚',
            zhtw: '保加利亞'
        },
        code: '+359',
        delegated: true,
    },
    {
        isoCode: 'UA',
        country: {
            en: 'Ukraine',
            zhcn: '乌克兰',
            zhtw: '烏克蘭'
        },
        code: '+380',
        delegated: true,
    },
    {
        isoCode: 'BF',
        country: {
            en: 'Burkina Faso',
            zhcn: '布基纳法索',
            zhtw: '布基納法索'
        },
        code: '+226',
        delegated: true,
    },
    {
        isoCode: 'QA',
        country: {
            en: 'Qatar',
            zhcn: '卡塔尔',
            zhtw: '卡塔爾'
        },
        code: '+974',
        delegated: true,
    },
    {
        isoCode: 'BE',
        country: {
            en: 'Belgium',
            zhcn: '比利时',
            zhtw: '比利時'
        },
        code: '+32',
        delegated: true,
    },
    {
        isoCode: 'MZ',
        country: {
            en: 'Mozambique',
            zhcn: '莫桑比克',
            zhtw: '莫桑比克'
        },
        code: '+258',
        delegated: true,
    },
    {
        isoCode: 'SH',
        country: {
            en: 'Saint Helena',
            zhcn: '圣赫勒拿',
            zhtw: '聖赫勒拿'
        },
        code: '+290',
        delegated: true,
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

function createCountryModel (countryModelName) {
    const nextNode = this;
    const Types = nextNode.Field.Types;
    
    const multilingual = nextNode.get('localization');
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
    const CountryList = new nextNode.List(countryModelName, {
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
        defaultSort: '-updatedAt',
    });

    CountryList.add({
        isoCode: {
            type: Types.Text,
            required: true,
            restrictDelegated: true,
            initial: true,
        },
        country: {
            type: Types.Text,
            required: true,
            restrictDelegated: true,
            initial: true,
            multilingual: true,
        },
        code: {
            type: Types.Text,
            initial: true,
            restrictDelegated: true,
            multilingual: false,
        },
        delegated: { 
            restrictDelegated: true,
            type: Types.Boolean,
            noedit: true,
            hidden: true, 
        },
    });

    CountryList.register();

    return createDelegatedCountry(nextNode, CountryList.model);
}

module.exports = createCountryModel;