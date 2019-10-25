export default {
	common: {
		greeding: 'Welcome You',
		dashboard: 'Dashboard',
		changeUILanguageLabel: 'Switch the screen language',
	},
	paging: {
		"previous": "Previous Page",
		"next": "Next Page",
		"perPage": "Display {{name}}(s) information per page: ",
		"info": "{{from}} to {{to}} of {{count}}"
	},
	footer: {
		copyright: 'All rights reserved.',
	},
	account: {
		nonameRole: 'No role name', 
		delegatedUser: 'System Assigned User',
	},
	login: {
		email: 'Email Address',
		password: 'Password',
		label: 'Sign In',
		signout: 'Sign Out',
		profile: 'My Account',
		processing: 'Signing in the account and please wait...',
		toggle: 'toggle password visibility',
	},
	message: {
      noItemMerchantId: 'No item matching id',
      goBackTo: 'Go back to',
      operationError: 'Operation Error! Please contact the Service Administrator.',
      successSave: 'The content has been saved.',
      validationTitle: 'There were {{errorCount}} errors saving the information',
      required: '{{field}} is required field',
      itemCreate: 'Item Created',
      connectionFail: 'Connection Failed',
      copySuccess: 'The content is copied to clipboard',
      invalid: '{{field}} content is incorrect. Please check it.',
      unknownError: 'An unknown error has ocurred, please refresh.',
      networkError: 'There is a problem with the network. Please make sure your network is worked and refresh the page to try again.',
   },
	filter:{
		loadingRecord: 'Loading the {{name}} information',
		control: '{{name}} Display Tools',
		errorMessage: 'Column {{name}} has no filter function.',
      label:'Filter {{name}}(s)',
      filterLabel: 'Filter',
      apply:'Apply',
      column: 'Display Column(s)',
      cancel:'Cancel',
      back: 'Back to Field List',
      clearAll: 'Clear All',
      editFilter: 'Edit Filter',
      placeholder:'Find a filter...',
      contains: 'Contains',
      filter: '* filter{postfix}',
      noresult: 'No any {{name}} result',
      exactly: 'Exactly',
      matching: 'found matching',
      beginsWith: 'Begins With',
      endsWith: 'Ends with',
      doesNotMatch: 'Does NOT Match',
      doesNotBeginWith: 'does NOT begin with',
      doesNotEndWith: 'does NOT begin with',
      isNotExactly: 'is NOT exactly',
      doesNotContains: 'does NOT contains',
      doNotBeginWith: 'do NOT begin with',
      doNotEndWith: 'do NOT begin with',
      doNotContains: 'do NOT contain',
      isExactly: 'is exactly',
      areNotExactly: 'are exactly',
      linkedTo: 'Linked To',
      notLinkedTo: 'Linked To',
      matches: 'Matches',
      some: 'At least one element',
      none: 'No element',
      loading: 'Loading',
      finding: 'Find a {{listName}}',
      cross: 'x',
      are: 'are',
      items: 'Options',
      check: 'check',
      selected: 'Selected',
      isWithIn: 'is within',
      isAtLeast: 'is at least',
      of: 'of',
      all: 'All',
      nothing: 'None',
      and: 'and',
      no: 'no',
      or: 'or',
      is: 'is',
      isNot: 'is not',
      isSet: 'Is set',
      isNotSet: 'Is not set',
      gt: 'Greater Than',
      lt: 'Less Than',
      equals: 'Exactly',
      hasValues: 'Has Values',
      isEmpty: 'Is Empty',
      between: 'Between',
      address: 'Address',
      city: 'City',
      state: 'State',
      postCode: 'Postcode',
      country: 'Country',
      max: 'Max distance (km)',
      min: 'Min distance (km)',
      minimum: 'Minimum distance from point',
      maximum: 'Maximum distance from point',
      latitude: 'Latitude',
      longitude: 'Longitude',
      on: 'On',
      after: 'After',
      before: 'Before',
      from: 'From',
      to: 'To',
      isChecked: 'Yes',
      not: 'Not',
      isNotChecked: 'No',
   },
   sort:{  
      label:'Sort',
      sortBy:'sorted by',
      placeholder:'Find a filter...',
      decendingOrder:'Decending',
      acendingOrder:'Acending',
      hold:'Hold',
      alt:'alt',
      msg:'to toggle ascending/descending',
      multiMsg: 'to select multiple options',
   },
	// overrided from the server appLanguage pack
	menu: {},
	// overrided from the server menuLanguage pack
	list: {
		selected: 'Selected',
		selectAll: 'Select All',
		descending: 'Sorted Descending',
		ascending: 'Sorted Ascending',
		'day-picker-weekshort': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
		'day-picker-weeklong': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		'day-picker-labels': {
			nextMonth: 'Next',
			previousMonth: 'Previous',
		},
		change: 'Change File',
		edit: 'Edit',
		view: 'View Details',
		upload: 'Upload File',
		'day-picker-month': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		relationship: 'Relationships',
		createANew:'Create a new {{listName}}',
		create:'Create',
		dropdown: 'Select',
		select: 'Please select...',
		selectWithListname: 'Please select {{listName}}...',
		fileReaderNotSupport:'File reader not supported by browser.',
		fileFormatNotSupport:'Unsupported file type. Supported formats are: GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD, SVG',
		cancel:'Cancel',
		removeImage:'Remove Image',
		today:'Today',
		title:'Title',
		profileSuccessMsg:'Your profile have been changed successfully. You are able to get the latest profile in the next login.',
		search:'Search',
		searchPlaceholder:'Search Keyword for {{name}}(s)',
		contentVersion:'Content Language Version',
		description:'Description',
		saveToUpload:'Save to Upload',
		undoRemove:'Undo Remove',
		cancelUpload:'Cancel Upload',
		deleteFile:'Delete File',
		deleteSelected: 'Remove selected {{name}}(s)',
		removeFile:'Remove File',
		latitude:'Latitude',
		longitude:'Longitude',
		atLeast:'At Least {{qty}} {{listName}}{{postfix}}',
		atMost:'At Most {{qty}} {{listName}}{{postfix}}',
		addItem:'Add Item',
		add:'Add',
		addWithList: 'Add {{listName}}',
		saveToDelete:'Save to Delete',
		undo:'Undo',
		remove:'Remove',
		showMoreFields: 'Show More Fields',
		clearUpload:'Clear Uploads',
		uploadTo:'Upload',
		clickToUpload:'Click to upload',
		suburb:'Suburb',
		state:'State',
		postCode:'Post Code',
		country:'Country',
		replaceExistingData:'Replace existing data',
		autoAndImprove:'Autodetect and improve location on save',
		locationCheck:'When checked, this will attempt to fill missing fields. It will also get the lat/long',
		number:'number',
		poBoxShop:'PO Box / Shop',
		name:'name',
		buildingName:'Building Name',
		street1:'street1',
		streetAddress1:'Street Address',
		street2:'strret2',
		streetAddress2:'Street Address 2',
		confirm: 'Confirm',
		nowLabel: 'Now',
		first:'first',
		last:'last',
		firstName:'First name',
		lastName:'Last name',
		passwordSet:'Password Set',
		newPassword:'New password',
		confirmPwd:'Confirm new password',
		changePwd:'Change Password',
		setPassword:'Set Password',
		editMsg:'Your changes have been saved successfully',
		altRevealTitle:'Press <alt> to reveal the ID',
		noNameLabel:'no name',
		resetChanges:'Reset Changes',
		delete:'Delete',
		deleteWithList:'Delete this {{listName}}',
		reset:"Reset",
		createdAt:'First Created On',
		updatedBy:'Last Updated By',
		createdBy:'First Created By',
		updatedAt:'Last Updated',
		meta:'Meta Info',
		delegatedMsg:'This is a System Delegated Record, the contents cannot be fully modified.',
		resetTo:'Reset your changes to',
		deleteAskMsg:'Are you sure to delete the {{num}} chosen item(s)?',
		deleteAskTitle: 'Delete Records',
		cencelAskMsg:'Are you sure to cancel',
		saveAskMsg: 'Are you sure you want to save those items?',
		cannotUndo:'The cannot be undo.',
		saving:'Saving the changes',
		save:'Update',
		keyPlaceholder: 'Key Label',
		copy: 'Copy {{target}}',
		text: 'Content',
		'field-id': 'ID',
		'field-_id': 'ID',
		'field-createdAt':'First Created On',
		'field-updatedBy':'Last Updated By',
		'field-createdBy':'First Created By',
		'field-updatedAt':'Last Updated',
		'field-updatedFrom': 'Updated From',
		'heading-meta':'Meta Info',
		'field-delegated': 'Delegated',
	},
};
