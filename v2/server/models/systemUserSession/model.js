const nextnode                  = require('./../../../../');
// Configuration
const {
    userSession: {
        expireAfterSeconds,
        modelName,
    },
} = require('./../../config');

const statics                   = require('./statics');
const methods                   = require('./methods');

// const CreateSystemUserSession = nextnode => {
const {
    Field: {
        Types,
    },
    List,
} = nextnode;

const SystemUserSession = new List(modelName, {
    track: true,
    nodownload: true,   // no need to export
    noscale: true,
    nocreate: true,
    noedit: true,
    isCore: true,     // discard the reverse checking / any core related checking 
    multilingual: false,    // no need to support multi language anymore
    searchFields: 'sessionToken, refreshToken',
    defaultColumns: 'systemUser, sessionToken, refreshToken, expiredAt',
    defaultSort: '-expiredAt',
});

SystemUserSession.add({
    systemUser: {
        type: Types.Relationship,
        ref: 'User',
        required: true,
        initial: true,
    },
    sessionToken: {
        type: Types.Text,
        required: true,
        initial: true,
    },
    refreshToken: {
        type: Types.Text,
        required: true,
        initial: true,
    },
    expiredAt: {
        type: Types.Datetime,
        required: true,
        initial: true,
    },
});
// auto delete for the TTL index
SystemUserSession.schema.index({
    expiredAt: 1,
}, {
    // if the expiredAt is reached, then remove immediately
    expireAfterSeconds,
});

SystemUserSession.schema.pre('find', function() {
    this.populate('systemUser');
});

// assign the statics and methods handler
statics(SystemUserSession.schema);
methods(SystemUserSession.schema);
// register the model
SystemUserSession.register({});
//     return SystemUserSession;
// }
// keeps the Model standing at the client side
module.exports = SystemUserSession;
