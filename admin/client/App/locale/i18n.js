import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(LanguageDetector).init({
// we init with resources
	resources: {
		en: {
			nav: {
				welcome: 'Welcome:',
				frontPage: 'Front page - ',
				signOut: 'Sign Out',
				language: 'Language',
			},
		    footer: {
				company: 'Four Directions',
		    },
		    setting: {
			    accountSetting: 'Change My Account Setting',
			    updateMyAccount: 'Update My Account',
			    updating: 'Updating...',
			    cancel: 'Cancel',
		    },
		    createForm: {
			    createANew: 'Create a new',
			    create: 'Create',
			    cancel: 'Cancel',
			    language: 'Language',
		    },
		    headerToolBar: {
			    createButton: 'Create {{listName}}',
			    placeholder: 'Search',
		    },
		    sort: {
			    label: 'Sort',
		    },
		    filter: {
			    label: 'Filter',
			    apply: 'Apply',
			    cancel: 'Cancel',
		    },
		    column: {
			    label: 'Columns',
			    apply: 'Apply',
			    cancel: 'Cancel',
		    },
		    download: {
			    label: 'Download',
			    fileFormat: 'File format:',
			    column: 'Columns:',
			    useCrrentSelect: 'Use currently selected',
			    cancel: 'Cancel',
			    selectAll: 'Select All',
			    selectNone: 'Select None',
		    },
		    manage: {
			    label: 'Manage',
			    page: 'Page ',
			    all: 'All ',
			    none: 'None',
			    delete: 'Delete',
			    selected: '{{count}} selected',
			    saveAll: 'Save All',
			    show: 'Showing {{count}} {{collection}}',
		    },
		},
		zhtw: {
			nav: {
				welcome: '你好:',
				frontPage: '首頁 - ',
				signOut: '登出',
				language: '語言',
			},
		    footer: {
				company: '四方創意',
		    },
		    setting: {
			    accountSetting: '修改我的個人資料',
			    updateMyAccount: '更新我的個人資料',
			    updating: '更新中...',
			    cancel: '取消',
		    },
		    createForm: {
			    createANew: '新增一個新的',
			    create: '新增',
			    cancel: '取消',
			    language: '語言',
		    },
		    headerToolBar: {
			    createButton: '新增 {{listName}}',
			    placeholder: '搜尋',
		    },
		    sort: {
			    label: '排序',
		    },
		    filter: {
			    label: '篩選器',
			    apply: '提交',
			    cancel: '取消',
		    },
		    column: {
			    label: '欄位',
			    apply: '提交',
			    cancel: '取消',
		    },
		    download: {
			    label: '下載',
			    fileFormat: '文件格式:',
			    column: '欄位:',
			    useCrrentSelect: '使用現在已選取的欄位',
			    cancel: '取消',
			    selectAll: '全部選取',
			    selectNone: '取消選取',
		    },
		    manage: {
			    label: '管理',
			    page: '頁面 ',
			    all: '全部 ',
			    none: '取消',
			    delete: '刪除',
			    selected: '{{count}} 已選取',
			    saveAll: '全部儲存',
			    show: '顯示 {{count}} {{collection}}',
		    },
		},
		zhcn: {
			nav: {
				welcome: '你好:',
				frontPage: '首页 - ',
				signOut: '登出',
				language: '语言',
			},
		    footer: {
				company: '四方创意',
		    },
		    setting: {
			    accountSetting: '修改我的个人资料',
			    updateMyAccount: '更新我的个人资料',
			    updating: '更新中...',
			    cancel: '取消',
		    },
		    createForm: {
			    createANew: '新增一个新的',
			    create: '新增',
			    cancel: '取消',
			    language: '语言',
		    },
		    headerToolBar: {
			    createButton: '新增 {{listName}}',
			    placeholder: '搜寻',
		    },
		    sort: {
			    label: '排序',
		    },
		    filter: {
			    label: '筛选器',
			    apply: '提交',
			    cancel: '取消',
		    },
		    column: {
			    label: '栏位',
			    apply: '提交',
			    cancel: '取消',
		    },
		    download: {
			    label: '下载',
			    fileFormat: '文件格式:',
			    column: '栏位:',
			    useCrrentSelect: '使用现在已选取的栏位',
			    cancel: '取消',
			    selectAll: '全部选取',
			    selectNone: '取消选取',
		    },
		    manage: {
			    label: '管理',
			    page: '页面 ',
			    all: '全部 ',
			    none: '取消',
			    delete: '删除',
			    selected: '{{count}} 已选取',
			    saveAll: '全部储存',
			    show: '显示 {{count}} {{collection}}',
		    },
		},
	},
	// direct use server cookie 
	lng: Keystone.currentUILanguage,
	fallbackLng: Keystone.currentUILanguage,
	debug: true,
	
	// have a common namespace used around the full app
	ns: ["translations"],
	defaultNS: "translations",
	
	keySeparator: false, // we use content as keys
	
	interpolation: {
		escapeValue: false, // not needed for react!!
		formatSeparator: ","
	},
	
	react: {
		wait: true
	}
});

export default i18n;
