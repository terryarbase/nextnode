const _                 = require('lodash');

const APIInterface      = require('./../interface');
/*
** Basic System User Account behavior
** Terry Chan
** 13/09/2019
*/
class AccountHandler extends APIInterface{
    constructor(config) {
        super(config);
        this.extractFields = [
            'name',
            'password',
            'password_confirm',
            // no matter whether it is well multilingual supported
            'language',
            'contentLanguage',
        ];
    }

    // remove any secret field
    getUserInfo(data) {
        return _.omit(data, [
            'password',
            'password_confirm',
        ]);
    }

    extractFieldsToBeUpdated() {
        return _.pick(this.req.body, this.extractFields);
    }

    async execute() {
        let {
            user,
        } = this.req;
        const data = this.extractFieldsToBeUpdated();
        try {
            const execution = await this.executeByNative({
                list: this.userList,
                model: user,
                data,
                options: {
                    user,
                },
            });

            if (execution) {
               return this.res.apiError(execution.status, execution.error); 
            }
        } catch (err) {
            return this.res.apiError(500, err);
        }

        return this.res.json({
            data: this.getUserInfo(data),
        });
    }
}

module.exports = AccountHandler;
