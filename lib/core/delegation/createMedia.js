// // const keystone = require('keystone');
// // const PermissionType = require('./../enum/PermissionType');
// // const Types = keystone.Field.Types;
// const _find = require('lodash/find');
// const _keys = require('lodash/keys');
// const _map = require('lodash/map');
// const _forOwn = require('lodash/forOwn');
// /**
// * Media Model
// * ==========
// */


// function createMediaModel () {
//     const advancedList = this.get('advanced media') || {};
//     const multilingual = this.get('localization');
//     var MediaList = this.lists['Media'];

//     if (!MediaList) {
//         MediaList = new this.List('Media', {
//             track: true,
//             noscale: true,
//             multilingual,
//             isCore: true,
//             searchFields: 'source',
//             defaultColumns: 'source, remarks',
//             defaultSort: '-createdAt',
//         });
//     }

//     const nextnode = this;
//     const Types = this.Field.Types;
//     MediaList.add({
//         source: {
//             type: Types.File,
//             storage: fileStorage({ type: 'misc' }),
//             initial: true,
//             multilingual: false,
//             note: imageMineTypeAllowed.join(', '),
//         },
//         remark: {
//             type: Types.Text,
//             initial: true,
//         },
//     });
//     MediaList.register();
//     // else {
//     //     Object.keys(permissionSchema).forEach(function(s) {
//     //         if (!MediaList.get(s)) {
//     //             MediaList.set(s, permissionSchema[s]);
//     //         }
//     //     });
//     // }
//     // MediaList.register();
//     return createDelegatedMedia(MediaList, nextnode, MediaList.model, permissionSchema);
// }

// module.exports = createMediaModel;
