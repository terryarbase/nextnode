const options = keystone => {
	/*
	** Delegated Types.Select options
	** Support Multilingual Value
	** Terry Chan
	** 27/09/2019
	*/
	return {
		get permission () { return require('./../static/types/permission')(keystone).fullSet; },
		get cloudMessageState () { return require('./../static/types/messageState')(keystone).fullSet; },
		get section () { return require('./../static/types/section')(keystone).fullSet; },
		get gender () { return require('./../static/types/gender')(keystone).fullSet; },
		get appellation () { return require('./../static/types/appellation')(keystone).fullSet; },
		get activate () { return require('./../static/types/activate')(keystone).fullSet; },
		get status () { return require('./../static/types/status')(keystone).fullSet; },
		get environment () { return require('./../static/types/environment')(keystone).fullSet; },
		get question () { return require('./../static/types/question')(keystone).fullSet; },
		get device () { return require('./../static/types/device')(keystone).fullSet; },
		get nextnodeType () { return require('./../static/types/nextnodeType')(keystone).fullSet; },
		get notification () { 
			return {
				status: require('./../static/types/notification/status')(keystone).fullSet,
			};
		},
		get region () { 
			return {
				hk: require('./../static/types/region/hongkong')(keystone).fullSet,
			};
		},
		get customized () { return require('./../static/types/customized'); },
	};
};

module.exports = options;
