const _ = require('lodash');
/*
** CMS Account Manipulations
** Terry Chan @ 18/10/2018
** Last Update @ 18/10/2018
** 
** Specifications
** void: updatePassword 
*/

class Account {
	constructor(req, res) {
		this.updateMyProfile = this.updateMyProfile.bind(this);
        this.req = req;
        this.res = res;
        this.keystone = req.keystone;
        this.preRequired();
    }

    securityRequired() {
    	if (!this.keystone.security.csrf.validate(this.req)) {
			return this.res.apiError(403, this.req.t.__('msg_invalid_csrf'));
		}
    }

    async userAccountRequired() {
    	const { 
	    	req: {
	    		list: { model },
	    		user: { _id: id },
	    	},
	    	res
	    } = this;
    	try {
	    	const item = await model.findById(id);
			if (!item) return res.apiError(404, this.req.t.__('msg_user_notfound'));
			this.item = item;
	    } catch (err) {
	    	return res.apiError(500, err);
	    }
    }

    async preRequired() {
    	this.securityRequired();
    }

    extractFieldSpecicaition(spec) {
    	const { body } = this.req;
    	return _.pick(body, spec);
    }

    async updateMyProfile() {
    	await this.userAccountRequired();
    	if (this.item) {
	    	const body = this.extractFieldSpecicaition(['password', 'password_confirm', 'language']);
	    	this.executeUpdate(body);
	    }
    }

    // async findLanguage(info) {
    //     const { language } = info;
    //     const localeModel = this.keystone.list('Locale').model;
    //     const currentLanguage = await localeModel.findOne({
    //         identify: language || this.keystone.get('locale'),
    //     }).exec();
    //     if (currentLanguage) {
    //         info.language = currentLanguage._id;
    //     }
    // }

    async executeUpdate(info) {
    	const { 
    		req: {
    			list,
    			user,
    			body
    		},
    		item,
    		res,
    	} = this;
        // if (info.language) {
        //     await this.findLanguage(info);
        // }
    	// console.log(this.item, info, user, list);
    	list.updateItem(item, info, { user }, err => {
    		// console.log('>>>>>>>>', err);
			if (err) {
                var status = err.error === 'validation errors' ? 400 : 500;
                var error = err.error === 'database error' ? err.detail : err;
                return res.apiError(status, err);
            }
			res.json(list.getData(item));
		});
    }
}

module.exports = Account;
