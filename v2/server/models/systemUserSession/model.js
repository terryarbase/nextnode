const nextnode                  = require('./../../../../');
// Configuration
const config                    = require('./../../config');
const {
    userSession: {
        modelName,
    },
} = config;
const SystemUserSessionMixins   = require('./mixins');
const statics                   = require('./statics');
const methods                   = require('./methods');

const SystemUserSession = SystemUserSessionMixins({
    userFieldName: nextnode.get('user model'),
    modelName,
    listOptions: {
        isCore: true,     // discard the reverse checking / any core related checking 
        multilingual: false,    // no need to support multi language anymore
    },
    config,
    methods,
    statics,
});

// register the model
SystemUserSession.register({});

// keeps the Model standing at the client side
module.exports = SystemUserSession;
