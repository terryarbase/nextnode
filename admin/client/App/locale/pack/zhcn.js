const locales = {  
   nav:{  
      ...{
         welcome:'你好:',
         frontPage:'首页 - ',
         signOut:'登出',
         language:'语言',
         cancel:'取消',
      },
      ...((Keystone.menuLanguage && Keystone.menuLanguage.zhcn) || {}),
   },
   footer:{  
      company:'四方创意',
      // copyright: '版權所有2018-2022'
   },
   landing: {
      item: '项资讯',
      other: '其他',
   },
   setting:{  
      accountSetting:'修改我的个人资料',
      updateMyAccount:'更新我的个人资料',
      updating:'更新中...',
      cancel:'取消',
      newPassword:'新密码',
      confirmPwd:'确认新密码',
      msg:'您的个人资料已成功更改。 您可以在下次登录时获取最新的个人资料。',

   },
   message: {
      noItemMerchantId: '沒有項目匹配ID',
      goBackTo: '回去',
      operationError: '操作錯誤！ 請聯繫服務管理員。',
      successSave: '內容已成功保存',
      validationTitle: '储存这个资讯时发生{{errorCount}}个错误',
      required: '{{field}}是必须填写',
      itemCreate: '项目已创建',
      connectionFail: '连接失败',
      invalid: '请检查一下{{field}}的内容並不正确',
      unknownError: '发生了未知错误，请刷新页面以重新连接!',
      networkError: '网络存在问题，请检查网络并尝试刷新页面以重新连接！',
   },
   // createForm:{  
   //    createANew:'新增一个新的{{listName}}',
   //    create:'新增',
   //    cancel:'取消',
   //    language:'內容语言版本',
   // },
   headerToolBar:{  
      createButton:'新增{{listName}}',
      placeholder:'搜寻',

   },
   sort:{  
      label:'排序',
      sortBy:'排序',
      placeholder:'关键字',
      decendingOrder:'倒序',
      acendingOrder:'順序',
      hold:'按住',
      alt:'Alt鍵',
      msg:'切換倒序或順序',
      multiMsg: '选择多个选项',

   },
   filter:{  
      label:'筛选器',
      apply:'提交',
      filter: '* 筛选',
      editFilter: '编辑筛选器',
      clearAll: '全部清除',
      cancel:'取消',
      placeholder:'关键字',
      contains: '包含',
      exactly: '完全相同',
      beginsWith: '开始于',
      endsWith: '结束于',
      doesNotMatch: '不匹配',
      of: '的',
      matches: '匹配',
      linkedTo: '已连接到',
      notLinkedTo: '沒有连接到',
      some: '至少有一个',
      loading: '载入中',
      matching: '找到匹配',
      finding: '正在寻找{{listName}}',
      doesNotBeginWith: '开首不是以',
      doesNotEndWith: '结尾不是以',
      isNotExactly: '不完全是',
      doesNotContains: '不包含',
      areNotExactly: '不完全是',
      doNotContains: '不包含',
      doNotBeginWith: '开首不是以',
      doNotEndWith: '结尾不是以',
      none: '沒有',
      all: '全部',
      cross: 'x',
      check: '已选',
      items: '选项',
      selected: '已选',
      nothing: '沒有',
      isSet: '已设定',
      noresult: '没有任何结果',
      hasValues: '存在已選項目',
      isEmpty: '沒有已選項目',
      isNotSet: '尚未设定',
      gt: '大于',
      no: '不是',
      isNot: '不是',
      or: '或',
      equals: '相等于',
      lt: '小于',
      between: '之间',
      address: '地址',
      city: '城市',
      not: '非',
      and: '和',
      is: '是',
      are: '是',
      isWithIn: '在內',
      isAtLeast: '至少是',
      state: '州',
      postCode: '邮政编码',
      country: '国家',
      max: '最远距离（公里）',
      min: '最短距离 (公里)',
      minimum: '最短的距离',
      maximum: '最远的距离',
      latitude: '经度',
      longitude: '纬度',
      on: '在',
      after: '之后',
      before: '之前',
      from: '由',
      to: '到',
      isChecked: '是',
      isNotChecked: '否',
   },
   column:{  
      label:'栏位',
      apply:'提交',
      cancel:'取消',
      placeholder:'关键字',

   },
   download:{  
      label:'下载',
      fileFormat:'文件格式:',
      column:'栏位:',
      useCrrentSelect:'使用现在已选取的栏位',
      cancel:'取消',
      selectAll:'全部选取',
      selectNone:'取消选取',

   },
   manage:{  
      label:'管理',
      page:'页面 ',
      all:'全部 ',
      none:'取消',
      delete:'删除',
      selected:'{{count}} 已选取',
      saveAll:'全部储存',
      show:'显示{{count}}個{{collection}}',
      pageShow:'显示总数: {{total}} ({{start}}至{{end}})',
      selectAllRows: '选择所有行',
      disselectAllRows: '取消选择所有行',
      nolistHeader: '立即建立一个{{listName}}',
      nolistDesc: '{{listName}}页面只能创建一个项目，您可以立刻创建这个唯一{{listName}}项目。创建第一条记录后，页面将重定向到这个项目。',
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
         upload: '上传文件',
         createANew:'新增一个新的{{listName}}',
         create:'新增',
         select: '请选择...',
         relationship: '关联连结',
         selectWithListname: '请选择{{listName}}...',
         fileReaderNotSupport:'浏览器不支援文件读取器',
         fileFormatNotSupport:'不支援的文件类型支援的格式有:GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD, SVG',
         cancel:'取消',
         profileSuccessMsg:'您的个人资料已成功更改。 您可以在下次登录时获取最新的个人资料。',
         removeImage:'删除相片',
         today:'今天',
         title:'标题',
         nowLabel: '现在',
         searchPlaceholder:'关键字',
         search:'搜查',
         contentVersion:'内容语言版本',
         description:'描述',
         saveToUpload:'保存并上传',
         undoRemove:'撤消删除',
         cancelUpload:'取消上传',
         deleteFile:'删除文件',
         removeFile:'移除文件',
         latitude:'纬度',
         longitude:'经度',
         atLeast:'最少{{qty}}個{{listName}}',
         atMost:'最多{{qty}}個{{listName}}',
         addItem:'新增项目',
         add:'新增',
         addWithList: '新增{{listName}}',
         saveToDelete:'保存并删除',
         undo:'复原',
         remove:'移除',
         clearUploade:'清除上传',
         upload:'上传',
         clickToUpload:'点击并上传',
         suburb:'市',
         state:'省',
         postCode:'邮政编码',
         country:'国家',
         showMoreFields: '显示更多内容',
         replaceExistingData:'覆盖现有数据',
         autoAndImprove:'自动侦测',
         locationCheck:'勾选后，将尝试填充缺少的字段。 它也会得到纬度/经度',
         number:'号码',
         poBoxShop:'邮政信箱/商店',
         name:'名称',
         buildingName:'建筑名称',
         street1:'街道1',
         streetAddress1:'街道地址',
         street2:'街道2',
         streetAddress2:'街道地址2',
         first:'最初',
         last:'最后',
         firstName:'名字',
         lastName:'姓',
         passwordSet:'密码设置',
         newPassword:'新密码',
         confirmPwd:'确认新密码',
         changePwd:'更改密码',
         setPassword:'设置密码',
         editMsg:'您的更改已成功保存',
         saveAskMsg: '您确定要保存这些吗？',
         altRevealTitle:'按<alt>键显示ID',
         noNameLabel:'沒有可顯示的名稱',
         resetChanges:'重置更改',
         delete:'删除',
         deleteWithList:'删除此{{listName}}',
         reset:'重置',
         createdAt:'首次创建於',
         updatedBy:'最后更新者',
         createdBy:'首次创建者',
         meta:'资讯内容',
         confirm: '确认',
         updatedAt:'最后更新於',
         delegatedMsg:'这是系统预设内容，所以不能被完全更改。',
         resetTo:'重置更改的內容至',
         deleteAskMsg:'你确定要删除',
         cannotUndo:'这不能被撤消更改',
         saving:'正在储存更改',
         save:'更改',
         keyPlaceholder: '识别文字',
         text: '內容',
         'field-id': '编号',
         'field-_id': '编号',

         'field-createdAt':'首次创建於',
         'field-updatedBy':'最后更新者',
         'field-createdBy':'首次创建者',
         'field-updatedAt':'最后更新於',
         'heading-meta':'资讯内容',
         'field-delegated': '系统预设',
      },
      ...((Keystone.appLanguage && Keystone.appLanguage.zhcn) || {}),
   },
   // list: {
   //    ...{
   //       'field-createdAt':'首次创建於',
   //       'field-updatedBy':'最后更新者',
   //       'field-createdBy':'首次创建者',
   //       'field-updatedAt':'最后更新於',
   //       'field-meta':'资讯内容',
   //    },
   //    ...(Keystone.appLanguage && Keystone.appLanguage.zhcn) || {},
   // }
};

export default locales;
