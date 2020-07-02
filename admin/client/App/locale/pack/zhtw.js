const locales = {  
   nav:{  
      ...{
         welcome:'你好:',
         frontPage:'首頁 - ',
         signOut:'登出',
         language:'語言',
         cancel:'取消',
      },
      ...((Keystone.menuLanguage && Keystone.menuLanguage.zhtw) || {}),
   },
   footer:{  
      company:'四方創意',
      // copyright: '版权所有2018-2022'
   },
   landing: {
      item: '項資訊',
      other: '其他',
   },
   setting:{  
      accountSetting:'修改我的個人資料',
      updateMyAccount:'更新我的個人資料',
      updating:'更新中...',
      cancel:'取消',
      newPassword:'新密碼',
      confirmPwd:'確認新密碼',
      msg: '您的個人資料已成功更改。您可以在下次登錄時獲取最新的個人資料。',
   },
   message: {
      noItemMerchantId: '没有项目匹配ID',
      goBackTo: '回去',
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
   // createForm:{  
   //    createANew:'新增一個新的{{listName}}',
   //    create:'新增',
   //    cancel:'取消',
   //    language:'內容語言版本',

   // },
   headerToolBar:{  
      createButton:'新增{{listName}}',
      placeholder:'搜尋',

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
   filter:{  
      label:'篩選器',
      filter: '* 篩選',
      editFilter: '編輯篩選器',
      clearAll: '全部清除',
      apply:'提交',
      of: '的',
      cancel:'取消',
      noresult: '沒有任何結果',
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
   column:{  
      label:'欄位',
      apply:'提交',
      cancel:'取消',
      placeholder:'關鍵字',

   },
   download:{  
      label:'下載',
      item: '下載{{name}}',
      fileFormat:'文件格式:',
      column:'欄位:',
      useCrrentSelect:'使用現在已選取的欄位',
      cancel:'取消',
      selectAll:'全部選取',
      selectNone:'取消選取',

   },
   import:{  
      label:'匯入',
      fileUpload:'CSV :',
      upload:'上載',
      change:'更改文件',
      cancel:'取消',
   },
   manage:{  
      label:'管理',
      page:'頁面 ',
      all:'全部 ',
      none:'取消',
      delete:'刪除',
      selected:'{{count}} 已選取',
      saveAll:'全部儲存',
      show:'顯示{{count}}個{{collection}}',
      pageShow:'顯示總數:{{total}} ({{start}}至{{end}})',
      selectAllRows: '選擇所有行',
      disselectAllRows: '取消選擇所有行',
      nolistHeader: '立即建立一個{{listName}}',
      nolistDesc: '{{listName}}頁面只能創建一個項目，您可以立刻創建這個唯一{{listName}}項目。創建第一條記錄後，頁面將重定向到這個項目。',
   },
   form:{  
      ...{
         'day-picker-weekshort': ['日', '一', '二', '三', '四', '五', '六'],
         'day-picker-weeklong': ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
         'day-picker-labels': {
            nextMonth: '下個月',
            previousMonth: '上個月',
         },
         'day-picker-month': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
         change: '更改文件',
         upload: '上傳文件',
         createANew:'新增一個新的{{listName}}',
         create:'新增',
         relationship: '關聯連結',
         select: '請選擇...',
         downloadCode: '下載代碼文件',
         downloadItem: '下载{{name}}',
         selectWithListname: '請選擇{{listName}}...',
         fileReaderNotSupport:'瀏覽器不支援文件讀取器',
         fileFormatNotSupport:'不支援的文件類型。支援的格式有:GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD, SVG',
         cancel:'取消',
         removeImage:'刪除相片',
         profileSuccessMsg:'您的個人資料已成功更改。 您可以在下次登錄時獲取最新的個人資料。',
         today:'今天',
         title:'標題',
         description:'描述',
         downloadqrCode: '下載二維碼',
         search:'搜尋',
         saveToUpload:'保存並上傳',
         contentVersion:'內容語言版本',
         undoRemove:'撤消刪除',
         cancelUpload:'取消上傳',
         deleteFile:'刪除文件',
         removeFile:'移除文件',
         latitude:'緯度',
         longitude:'經度',
         searchPlaceholder:'關鍵字',
         key:'序號',
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
         upload:'上傳',
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
         dropdown: '選擇',
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
         createdAt:'首次創建於',
         updatedBy:'最後更新者',
         createdBy:'首次創建者',
         meta:'資訊內容',
         updatedAt:'最後更新於',
         delegatedMsg:'這是系統預設內容，所以不能被完全更改。',
         resetTo:'重置更改的內容至',
         deleteAskMsg:'你確定要刪除',
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
         'field-delegated': '系統預設',
      },
      ...((Keystone.appLanguage && Keystone.appLanguage.zhtw) || {}),
   },
   // list: {
   //    ...{
   //       'field-createdAt':'首次創建於',
   //       'field-updatedBy':'最後更新者',
   //       'field-createdBy':'首次創建者',
   //       'field-updatedAt':'最後更新於',
   //       'field-meta':'資訊內容',
   //    },
   //    ...(Keystone.appLanguage && Keystone.appLanguage.zhtw) || {},
   // }
   v2: {
      page: {
         media: {
            center: {
               title: '媒體中心',
            },
         },
      },
   },
};

export default locales;
