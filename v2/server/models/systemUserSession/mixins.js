const nextnode                  = require('./../../../../');

const {
    Field: {
        Types,
    },
    List,
} = nextnode;

const SystemUserSessionMixins = ({
    userFieldName,
    modelName,
    listOptions={},
    config,
    statics,
    methods,
}) => {

    if (!userFieldName) {
        throw new Error('Missing Taget User field name');
    }
    if (!modelName) {
        throw new Error('Missing User Session model name');
    }
    if (!config) {
        throw new Error('Missing User Session Configuration');
    }
    if (!statics) {
        throw new Error('Missing User Session Statics Handler');
    }

    const {
        userSession={},
    } = config;

    const UserSessionList = new List(modelName, {
        track: true,
        nodownload: true,   // no need to export
        noscale: true,
        nocreate: true,
        noedit: true,
        searchFields: 'sessionToken, refreshToken',
        defaultColumns: 'targetUser, sessionToken, refreshToken, expiredAt',
        defaultSort: '-expiredAt',
        ...listOptions,
    });

    UserSessionList.add({
        targetUser: {
            type: Types.Relationship,
            ref: userFieldName,
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
    UserSessionList.schema.index({
        expiredAt: 1,
    }, {
        // if the expiredAt is reached, then remove immediately
        expireAfterSeconds: userSession.expireAfterSeconds || 86400,
    });

    UserSessionList.schema.pre('find', function() {
        this.populate('targetUser');
    });

    // assign the statics and methods handler
    statics(UserSessionList.schema, config);
    methods(nextnode, UserSessionList.schema, config);
    
    // register by callee
    return UserSessionList;  
};

module.exports = SystemUserSessionMixins;
