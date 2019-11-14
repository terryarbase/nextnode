export default {
	common: {
		greeding: '歡迎您',
		dashboard: '主控制台',
		changeUILanguageLabel: '切換屏幕語言',
		changeContentLanguageLabel: '編輯內容語言版本',
		error404: "找不到網頁",
	},
	footer: {
		copyright: '保留所有權利。',
	},
	paging: {
		"previous": "上一頁",
		"next": "下一頁",
		"perPage": "每頁顯示{{name}}資料: ",
		"info": "第{{from}}至第{{to}} (總數: {{count}})"
	},
	account: {
		nonameRole: '沒有身份名稱', 
		delegatedUser: '系統委派用戶',
	},
	login: {
		email: '電郵地址',
		password: '密碼',
		label: '立即登入',
		signout: '登出',
		profile: '我的帳戶',
		processing: '登入帳戶中！請稍候...',
		toggle: '切換密碼可見性',
	},
	sort:{  
      label:'排序',
      sortBy:'排序',
      decendingOrder:'倒序',
      acendingOrder:'順序',
      placeholder:'關鍵字',
      hold:'按住',
      alt:'Alt鍵',
      msg:'切換倒序或順序',
      multiMsg: '選擇多個選項',

   },
   message: {
      noItemMerchantId: '没有项目匹配ID',
      goBackHome: '返回主頁',
      goBackTo: '回去',
      error404: '哎呀! 看起來您要查找的頁面不再存在',
      itemCreate: '項目已創建',
      connectionFail: '連接失敗',
      operationError: '操作错误！ 请联系服务管理员。',
      successSave: '内容已成功保存',
      copySuccess: '內容已複製到剪貼板',
      validationTitle: '儲存這個資訊時發生{{errorCount}}個錯誤',
      required: '{{field}}是必須填寫',
      invalid: '請檢查一下{{field}}的内容並不正確',
      unknownError: '發生了未知錯誤，請刷新頁面以重新連接!',
      networkError: '網絡存在問題，請檢查網絡並嘗試刷新頁面以重新連接!',
   },
	filter:{ 
		loadingRecord: '正在加載{{name}}信息', 
		control: '{{name}}顯示工具',
      label:'{{name}}篩選器',
      errorMessage: '欄目{{name}}沒有篩選器界面',
      filterLabel: '篩選器',
      filter: '* 篩選',
      column: '顯示欄目',
      editFilter: '編輯篩選器',
      clearAll: '全部清除',
      apply:'提交',
      of: '的',
      cancel:'取消',
      back: '返回欄目清單',
      noresult: '沒有任何{{name}}結果',
      placeholder:'關鍵字',
      matching: '找到匹配',
      contains: '包含',
      exactly: '完全相同',
      beginsWith: '開始於',
      endsWith: '結束於',
      doesNotMatch: '不匹配',
      doesNotBeginWith: '開首不是以',
      doesNotEndWith: '結尾不是以',
      isNotExactly: '不完全是',
      areNotExactly: '不完全是',
      doesNotContains: '不包含',
      doNotContains: '不包含',
      doNotBeginWith: '開首不是以',
      doNotEndWith: '結尾不是以',
      matches: '匹配',
      linkedTo: '已連接到',
      notLinkedTo: '沒有連接到',
      some: '至少有一个',
      not: '非',
      none: '沒有',
      and: '和',
      is: '是',
      no: '不是',
      isNot: '不是',
      are: '是',
      or: '或',
      all: '全部',
      isWithIn: '在內',
      isAtLeast: '至少是',
      cross: 'x',
      check: '已選',
      nothing: '沒有',
      items: '選項',
      selected: '已選',
      finding: '正在找尋{{listName}}',
      loading: '載入中',
      isSet: '已設定',
      hasValues: '存在已选项目',
      isEmpty: '沒有已选项目',
      isNotSet: '尚未設定',
      gt: '大於',
      lt: '小於',
      equals: '相等於',
      between: '之間',
      address: '地址',
      city: '城市',
      state: '州',
      postCode: '郵政編碼',
      country: '國家',
      max: '最遠距離（公里）',
      min: '最短距離（公里）',
      minimum: '最短的距離',
      maximum: '最遠的距離',
      latitude: '經度',
      longitude: '緯度',
      on: '在',
      after: '之後',
      before: '之前',
      from: '由',
      to: '到',
      isChecked: '是',
      isNotChecked: '否',
   },
	// overrided from the server appLanguage pack
	menu: {},
	// overrided from the server menuLanguage pack
	list: {
		invalidType: '{{path}}的欄目{{type}}無效',
		addedAndRemoved: "添加了{{uploadCount}}，刪除了{{deleteCount}}",
		addedOnly: "添加了{{uploadCount}}個圖片",
		removedOnly: "{{{deleteCount}}}張圖片已刪除",
		selected: '已選',
		selectAll: '全選',
		downloadCode: '下載代碼文件',
		noFile: '沒有文件',
		edit: '編輯',
		view: '查看詳細信息',
		descending: '降序排序',
		ascending: '升序排序',
		placeholder: '請輸入{{field}}',
		'day-picker-weekshort': ['日', '一', '二', '三', '四', '五', '六'],
		'day-picker-weeklong': ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
		'day-picker-labels': {
			nextMonth: '下個月',
			previousMonth: '上個月',
		},
		downloadImage: '下載原圖',
		'day-picker-month': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		change: '更改文件',
		changeTo: '更換',
		note: '備註',
		upload: '上傳文件',
		createANew:'新增一個新的{{listName}}',
		create:'新增',
		dropdown: '選擇',
		relationship: '關聯連結',
		select: '請選擇...',
		selectWithListname: '請選擇{{listName}}...',
		fileReaderNotSupport:'瀏覽器不支援文件讀取器',
		fileFormatNotSupport:'不支援的文件類型。支援的格式有:GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD, SVG',
		cancel:'取消',
		deleteSelected: '刪除已選擇的{{name}}',
		removeImage:'刪除圖片',
		image: '圖片',
		profileSuccessMsg:'您的個人資料已成功更改。 您可以在下次登錄時獲取最新的個人資料。',
		today:'今天',
		title:'標題',
		description:'描述',
		search:'搜尋',
		saveToUpload:'保存並上傳',
		contentVersion:'內容語言版本',
		undoRemove:'撤消刪除',
		cancelUpload:'取消上傳',
		deleteFile:'刪除文件',
		removeFile:'移除文件',
		latitude:'緯度',
		longitude:'經度',
		'__default__': '基本信息',
		searchPlaceholder:'{{name}}關鍵字',
		key:'序號',
		defaultLang: '預設',
		keyPlaceholder: '識別文字',
		text: '內容',
		atLeast:'最少{{qty}}个{{listName}}',
		atMost:'最多{{qty}}个{{listName}}',
		addItem:'新增項目',
		add:'新增',
		addWithList: '新增{{listName}}',
		saveToDelete:'保存並刪除',
		undo:'復原',
		remove:'移除',
		clearUpload:'清除上傳',
		uploadTo:'上傳',
		clickToUpload:'點擊並上傳',
		suburb:'市',
		state:'省',
		postCode:'郵政編碼',
		country:'國家',
		saveAskMsg: '您確定要保存這些嗎？',
		replaceExistingData:'覆蓋現有數據',
		autoAndImprove:'自動偵測',
		locationCheck:'勾選後，將嘗試填充缺少的字段。 它也會得到緯度/經度',
		number:'號碼',
		poBoxShop:'郵政信箱/商店',
		name:'名稱',
		buildingName:'建築名稱',
		street1:'街道1',
		streetAddress1:'街道地址',
		showMoreFields: '顯示更多內容',
		street2:'街道2',
		streetAddress2:'街道地址2',
		first:'最初',
		last:'最後',
		confirm: '確認',
		firstName:'名字',
		lastName:'姓',
		passwordSet:'密碼設置',
		newPassword:'新密碼',
		confirmPwd:'確認新密碼',
		changePwd:'更改密碼',
		setPassword:'設置密碼',
		editMsg:'您的更改已成功保存',
		altRevealTitle:'按<alt>鍵顯示ID',
		noNameLabel:'沒有可顯示的名稱',
		resetChanges:'重置更改',
		delete:'删除',
		deleteWithList:'删除此{{listName}}',
		reset:'重置',
		nowLabel: '現在',
		saveToConfirm: '保存以確認',
		uploadImages: '上傳圖片',
		clearSelection: '清除選擇',
		createdAt:'首次創建於',
		updatedBy:'最後更新者',
		createdBy:'首次創建者',
		downloadPicture: '下載圖片',
		meta:'資訊內容',
		updatedAt:'最後更新於',
		delegatedMsg:'這是系統預設內容，所以不能被完全更改。',
		resetTo:'重置更改的內容至',
		deleteAskMsg:'你確定要刪除{{num}}個已選的內容',
		deleteAskTitle: '刪除内容',
		searchMenuItem: '搜尋選單關鍵字',
		cencelAskMsg:'你確定要取消',
		cannotUndo:'這不能被撤消更改',
		copy: '複製{{target}}',
		saving:'正在儲存更改',
		save:'更改',
		'field-id': '編號',
		'field-_id': '編號',
		'field-createdAt':'首次創建於',
		'field-updatedBy':'最後更新者',
		'field-createdBy':'首次創建者',
		'field-updatedAt':'最後更新於',
		'heading-meta':'資訊內容',
		'field-updatedFrom': '更新來自',
		'field-delegated': '系統預設',
	},
};