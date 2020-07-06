List.register({
    plugin,
    hooks: {
        // common save hook for both create and update
        beforeSave: async (doc, data, { req }) => {
            console.log('[beforeSave]')
            data.text = 'override text'
            // return Error to reject process
            // return new Error('create error');
        },
        afterSave: async (doc, { req }) => {
            console.log('[afterSave]')
            // do something before api response
        },
        // similar beforeSave/afterSave, but work in create only
        beforeCreate: async (doc, data, { req }) => {
            console.log('[beforeCreate]')
            data.text = 'override text at create only'
            // return new Error('create error');
        },
        afterCreate: async (doc, { req }) => {
            console.log('[afterCreate]')
            // do something before api response
        },
         // similar beforeSave/afterSave, but work in update only
        beforeUpdate: async (doc, data, { req }) => {
            console.log('[beforeUpdate]')
            data.text = 'override text at update only'
        },
        afterUpdate: async (doc, { req }) => {
            console.log('[afterUpdate]')
        },
        /*
        ** future hooks
        ** - beforeImport
        ** - afterImport
        */
    }
});