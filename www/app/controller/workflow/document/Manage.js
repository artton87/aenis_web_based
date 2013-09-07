Ext.define('Aenis.controller.workflow.document.Manage', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.document.Manage'
    ],

	mixins: [
		'Locale.hy_AM.Common',
		'Locale.hy_AM.workflow.document.Manage',
		'BestSoft.mixin.Localized'
	],

    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.control({
                'textfield': {
                    specialkey: {fn: this.onTextFieldSpecialKey, buffer:BestSoft.eventDelay}
                },
				'[ref=docTypeSelectAction]': {
					click: this.onclickSelectDocTypeBtn
				},
				'[ref=searchCaseAction]': {
					click: this.searchCase
				},
				'[ref=addCase]': {
					click: {fn: this.onclickAddCaseBtn, buffer:BestSoft.eventDelay}
				},
                '[action=reset]': {
                    click: this.onclickResetBtn
                },
				'[ref=docReset]': {
					click: this.onclickResetDocBtn
				},
				'[ref=pageReset]': {
					click: this.onclickResetPageBtn
				},
				'[ref=addDocAction]': {
					click: {fn: this.onclickAddBtn, buffer:BestSoft.eventDelay}
				},
				'[ref=editDocAction]': {
					//click: {fn: this.onclickEditBtn, buffer:BestSoft.eventDelay}
				},
				'[ref=saveDocAction]': {
					click: {fn: this.onclickSaveBtn, buffer:BestSoft.eventDelay}
				},
				'[ref=deleteDocAction]': {
					click: {fn: this.onclickDeleteBtn, buffer:BestSoft.eventDelay}
				},

				'[ref=addPageAction]': {
					click: {fn: this.onclickAddPageBtn, buffer:BestSoft.eventDelay}
				},
				'[ref=savePageAction]': {
					click: {fn: this.onclickSavePageBtn, buffer:BestSoft.eventDelay}
				},
                /*'[ref=applicantItemSelectAction]': {
					click:this.onclickSelectApplicantBtn
                },*/
				'[ref=caseGrid]': {
					selectionchange: this.onSelectionChangeCase
					//beforerender: this.onBeforeRenderItemsTree
				},
				'[ref=documentsGrid]': {
					selectionchange: this.onSelectionChangeDocument
				},
				'[ref=scanned]': {
					click: this.scanCase
				},
				'[ref=not_scanned]': {
					click: this.unscanCase
				},
				'[ref=pageSizeCombo]': {
					change: this.comboChange
				},
				'[ref=pagesGrid]': {
					selectionchange: this.onSelectionChangePage
				},
				'[ref=addPageForm]': {
					beforeaction: this.onPageFormBeforeAction,
					actioncomplete: this.onPageFormActionComplete,
					actionfailed: this.onPageFormActionFailed
				},
				'[ref=viewFile]':{
					click:this.onclickViewPageFile
				},
                '.': {
                    afterrender: {fn: this.onAfterRenderMainView, single:true}
                }
            }, null, this);
        });
    },

    onTextFieldSpecialKey: function(field, event) {
        if(event.getKey() == event.ENTER) {
            var oForm = this.getDetailsForm().getForm();
            var oRecord = oForm.getRecord();
            if(oRecord)
            {
                this.onclickSaveBtn();
            }
            else
            {
                this.onclickAddBtn();
            }
        }
    },

    onAfterRenderMainView: function() {
		this.getCaseNotariesCombo().getStore().load({
			params: {
				default_language_only: 1,
				merge_content_data: 1,
				is_notary: 1,
				show_all: 1
			}
		});
    },

	/*onclickSelectApplicantBtn: function(){
		var oController = this.application.loadController('main.contact.natural.SelectDlg');
		oController.showDialog().on({
			itemSelected: function(model) {
				this.getApplicantItemField().setValue(model.getName());
				this.getApplicantItemField().parentId = model.getId();
			},
			scope: this
		});
	},*/

    onclickResetBtn: function() {
        this.getDetailsForm().getForm().reset();
        //this.getEditAction().disable();
        //this.getTemplatesGrid().getSelectionModel().deselectAll();
    },

	onclickResetDocBtn: function() {
		this.getAddDocumentForm().getForm().reset();
		//this.getDocumentsGrid().getSelectionModel().clearSelections();
		this.getSaveDocAction().disable();
		this.getDeleteDocAction().disable();
	},

	onclickResetPageBtn: function() {
		this.getAddPageForm().getForm().reset();
		this.getSavePageAction().disable();
	},

	searchCase: function(){
		var oForm = this.getDetailsForm().getForm();
		var values = oForm.getValues();
		//console.log(values);
		this.getAddCaseForm().enable();
		var myGrid = this.getCaseGrid();
		//var params = {is_all_scanned: 1};
        myGrid.loadStore({
			params: values
		});
	},

	onclickSelectDocTypeBtn: function() {
		var oController = this.application.loadController('workflow.document.type.SelectDlg');
		oController.showDialog().on({
			itemSelected: function(model) {
				this.getDocTypeField().setValue(model.get('label'));
				//this.getDocDescription().setValue(model.get('label'));
				this.getDocTypeFieldId().setValue(model.getId());
				this.getDetailsForm().enable();
			},
			scope: this
		});
	},

	onSelectionChangeCase: function(model, selected) {
		if (selected.length > 0){
			var case_model = selected[0];
			var documents_store = case_model.documents();
			var myGrid = this.getDocumentsGrid();
            myGrid.reconfigure(documents_store);
            myGrid.loadStore();
            myGrid.store.sort([
				{ property: 'doc_num_in_case',  direction: 'ASC' }
			]);
            myGrid.case_id = case_model.getId();
		}
		else {

		}
		this.getAddDocumentForm().enable();
		this.getAddPageForm().disable();
	},

	modelSyncHandler: function(record, operation) {
		if(!operation.wasSuccessful()) return;
		if(operation.action == 'create' || operation.action == 'update')
		{
			Ext.Msg.show({
				title: this.application.title,
				msg: this.getAddDocumentForm().messages[operation.action+'Success'],
				icon: Ext.MessageBox.INFO,
				buttons: Ext.MessageBox.OK
			});
		}
		this.getDocumentsGrid().getStore().reload();
		this.onclickResetDocBtn();
	},

	onclickAddCaseBtn: function() {
		//var oGrid = this.getCaseGrid();
		var oForm = this.getAddCaseForm().getForm();
		//var selection = oGrid.getSelectionModel().getSelection();
		if(oForm.isValid()){
			this.submitCaseModel('create');
		}
	},

	onclickAddBtn: function() {
		var oForm = this.getAddDocumentForm().getForm();
		//console.log(oForm);
		if(oForm.isValid()){
			this.submitModel('create');
		}
	},

	onclickSaveBtn: function() {
		var oForm = this.getAddDocumentForm().getForm();
		if(oForm.isValid())
			this.submitModel('update');
	},

	onclickDeleteBtn: function() {
		var oGrid = this.getDocumentsGrid();
		var selection = oGrid.getSelectionModel().getSelection();
		var me = this;
		if(selection.length > 0)
		{
			Ext.Msg.confirm({
				title: this.application.title,
				msg: this.T("are_you_sure"),
				buttons: Ext.Msg.OKCANCEL,
				icon: Ext.Msg.WARNING,
				fn: function(btn) {
					if(btn == 'ok'){
						me.submitModel('destroy', {
							id: selection[0].data.id
						});
					}
				}
			});

		}
		this.getAddPageForm().disable();
	},

	/**
	 * Create and submit a model to server
	 * @param {String} mode    Either 'create', 'update' or 'destroy'
	 * @param {Object} [values]     Optional. Values for the model
	 */
	submitModel: function(mode, values) {
		var modelName = 'Aenis.model.workflow.Document';
		var operationConfig = {
			scope: this,
			callback: this.modelSyncHandler
		};
		if(mode == 'destroy')
		{
			Ext.create(modelName, values).destroy(operationConfig);
		}
		else
		{
			var oForm = this.getAddDocumentForm().getForm();
			values = oForm.getValues();
			values.id = (mode=='create') ? 0 : oForm.getRecord().get('id');
			values.case_id = this.getDocumentsGrid().case_id;
			//values.doc_type_id = this.getDocTypeFieldId().value;
			if(oForm.isValid())
				Ext.create(modelName, values).save(operationConfig);
		}
	},

	caseModelSyncHandler: function(record, operation) {
		if(!operation.wasSuccessful()) return;
		if(operation.action == 'create' || operation.action == 'update')
		{
			Ext.Msg.show({
				title: this.application.title,
				msg: this.getDetailsForm().messages[operation.action+'Success'],
				icon: Ext.MessageBox.INFO,
				buttons: Ext.MessageBox.OK
			});
		}
		this.getCaseGrid().getStore().reload();
		//this.onclickResetDocBtn();
	},

	caseModelUpdateSyncHandler: function(record, operation) {
		if(!operation.wasSuccessful())
		{
			this.getCaseGrid().getStore().rejectChanges();
		}
	},

	/**
	 * Create and submit a model to server
	 * @param {String} mode    Either 'create', 'update' or 'destroy'
	 * @param {Object} [values]     Optional. Values for the model
	 */
	submitCaseModel: function(mode, values) {
		var modelName = 'Aenis.model.workflow.Case';
		var operationConfig = {
			scope: this,
			callback: this.caseModelSyncHandler
		};
		if(mode == 'destroy')
		{
			Ext.create(modelName, values).destroy(operationConfig);
		}
		else
		{
			var oForm = this.getDetailsForm().getForm();
			if(!values)
				values = oForm.getValues();
			//console.log(mode);
			values.id = (mode=='create') ? 0 : values.id;
			values.notary_id = parseInt(this.getNotariesCombo().getValue());

			Ext.create(modelName, values).save(operationConfig);
		}
	},

	onSelectionChangeDocument: function(model, selected) {
		var oForm = this.getAddDocumentForm().getForm();
		this.getAddPageForm().enable();


		if (selected.length > 0){
			var document_model = selected[0];
			var pages_store = document_model.pages();
			var mygrid = this.getPagesGrid();
			mygrid.reconfigure(pages_store);

			/*pages_store.on('load', function(){
				//console.log(arguments);
			})*/
			mygrid.loadStore();
			mygrid.store.sort([
				{ property: 'page_number_in_document',  direction: 'ASC' }
			]);
			mygrid.doc_id = document_model.getId();

			//console.log(document_model);
			this.getSaveDocAction().enable();
			this.getDeleteDocAction().enable();
			if (document_model.get('has_file') == 1){
				this.getAddPageAction().disable();
			} else
				this.getAddPageAction().enable();
			oForm.loadRecord(document_model);
			this.onclickResetPageBtn();
		}
		else {

		}
	},

	scanCase: function() {
		var oGrid = this.getCaseGrid();
		var selection = oGrid.getSelectionModel().getSelection();
		if(selection.length > 0){
			//console.log(selection[0].data.id);
			selection[0].set("is_all_scanned", 1);
			selection[0].save({
				scope: this,
				callback: this.caseModelUpdateSyncHandler
			});
			/*this.submitCaseModel('update', {
				id: selection[0].data.id,
				is_all_scanned: 1
			});*/
		}
	},

	unscanCase: function() {
		var oGrid = this.getCaseGrid();
		var selection = oGrid.getSelectionModel().getSelection();
		if(selection.length > 0){
			selection[0].set("is_all_scanned", 0);
			selection[0].save({
				scope: this,
				callback: this.caseModelUpdateSyncHandler
			});
		}
	},

	onclickAddPageBtn: function() {
		/*var oForm = this.getAddPageForm().getForm();
		var doc_id = this.getPagesGrid().doc_id;
		var document = this.getDocumentsGrid().getStore().getById(doc_id);
		var count = this.getPagesGrid().getStore().getCount();

		//console.log(count);
		//console.log(oForm);
		if(oForm.isValid()){
			if(document.data.page_count > count){
				this.submitPageModel('create');
			} else {
				Ext.Msg.show({
					title: this.application.title,
					msg: this.T("too_many_pages"),
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.WARNING
				});
			}
		}*/

		var oForm = this.getAddPageForm().getForm();
			oForm.submit({params:{}});
	},

	onclickSavePageBtn: function() {
		var oForm = this.getAddPageForm().getForm();
		//console.log(oForm.getRecord().get('page_id'));
		oForm.submit({
			params: {
				id: oForm.getRecord().getId(),
				page_id: oForm.getRecord().get('page_id')
			}
		});
	},



	/*submitPageModel: function(mode) {
		var modelName = 'Aenis.model.workflow.Page';
		if (mode != 'destroy') {


		} else {
			Ext.create(modelName, values).destroy(operationConfig);
		}
	},*/




	/*pageModelSyncHandler: function(record, operation) {
		if(!operation.wasSuccessful()) return;
		console.log(operation.action);
		if(operation.action == 'create' || operation.action == 'update')
		{
			Ext.Msg.show({
				title: this.application.title,
				msg: this.getAddPageForm().messages[operation.action+'Success'],
				icon: Ext.MessageBox.INFO,
				buttons: Ext.MessageBox.OK
			});
		}
		this.getPagesGrid().getStore().reload();
		this.onclickResetPageBtn();
	},*/

	comboChange: function(obj, value){
		//console.log(this.getPagesGrid().getStore());
		this.getPageFormatId().setValue(value);
	},

	onSelectionChangePage: function(model, selected) {
		var oForm = this.getAddPageForm().getForm();

		if (selected.length > 0){
			var page_model = selected[0];
			this.getSavePageAction().enable();
			//this.getDeleteDocAction().enable();
			oForm.loadRecord(page_model);
		}
	},

	onPageFormBeforeAction: function(oForm, action){
		//var oForm = this.getAddPageForm().getForm();

		var oForm = this.getAddPageForm().getForm();
		var doc_id = this.getPagesGrid().doc_id;
		var document = this.getDocumentsGrid().getStore().getById(doc_id);
		var count = this.getPagesGrid().getStore().getCount();

		console.log(document.get('page_count'));

		if(document.get('page_count') <= count){
			Ext.Msg.show({
				title: this.application.title,
				msg: this.T("too_many_pages"),
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING
			});
			return false;
		}

		var	values = oForm.getValues();
		//values.id = 0; //(action=='create') ? 0 : oForm.getRecord().get('id');
		var data =  {
			'doc_id' : this.getPagesGrid().doc_id,
			'page_id': this.getPagesGrid().page_id,
			'id': values.id
		};
		action.params['data'] = Ext.JSON.encode(data);
		return true;
		/*{
		 waitMsg: this.T("wait_message"),
		 success: function () {
		 Ext.Msg.show({
		 title: me.application.title,
		 msg: me.T("file_uploaded"),
		 buttons: Ext.Msg.OK,
		 icon: Ext.Msg.INFO
		 });
		 }
		 }*/
	},

	onPageFormActionComplete: function(oForm, action){
		this.getPagesGrid().getStore().reload();

		var selection = this.getDocumentsGrid().getSelectionModel().getSelection();
		var document = selection[0];
		//var docId = this.getPagesGrid().getStore().first().get('doc_id');
		var docId = document.get('id');

		var docModel = Ext.create('Aenis.model.workflow.Document',{id:docId});
		var me = this;
		docModel.reload({},function(record){

			var docRecord = me.getDocumentsGrid().getStore().findRecord( 'id', record.getId(), 0, false, false, true);
			//console.log(docRecord);

			docRecord.set('attached',record.get('attached'));
			docRecord.commit();

		});

		if(action instanceof Ext.form.action.Submit)
		{
			Ext.Msg.show({
				title: this.application.title,
				msg: this.getAddPageForm().messages['createSuccess'],
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.INFO
			});
			this.onclickResetPageBtn();
		}
	},

	onPageFormActionFailed: function(oForm, action) {
		if(action instanceof Ext.form.action.Submit)
		{
			if(action.failureType == Ext.form.action.Action.SERVER_INVALID)
			{
				var obj = Ext.JSON.decode(action.response.responseText);
				Ext.Msg.show({
					title: this.application.title,
					msg: obj.errors.reason,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.WARNING
				});
			}
		}
	},


	onclickViewPageFile: function(){
		//TODO
		/*var oController = this.application.loadController('Aenis.controller.workflow.document.ViewDlg');
		oController.showDialog({docModel:model});*/
	}
});
