Ext.define('Aenis.controller.workflow.onlineApplications.View', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.onlineApplications.View'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.onlineApplications.View',
        'BestSoft.mixin.Localized'
    ],

    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.control({
                '[name=message]': {
                    specialkey: this.onTextFieldSpecialKey
                },
                '[ref=transactionStatuses]':{
                    beforerender: this.onBeforeRenderTransactionStatusesCombo,
                    change: this.onChangeTransactionStatusesCombo
                },
                '[ref=viewAction]':{
                    click: {fn: this.onclickViewAction, buffer:BestSoft.eventDelay}
                },
                '[ref=onlineApplicationsGrid]':{
                    itemdblclick: {fn: this.onclickViewAction, buffer:BestSoft.eventDelay},
                    selectionchange: this.onSelectionChangeAction
                },
                '[ref=saveAction]':{
                    click: {fn: this.onclickSaveAction, buffer:BestSoft.eventDelay}
                },
                '[ref=onlineApplicationPanelForm]':{
                    beforeaction: this.onFormBeforeAction,
                    actioncomplete: this.onFormActionComplete,
                    actionfailed: this.onFormActionFailed
                },
                '[ref=resetAction]':{
                    click:this.onclickResetOnlineApplicationPanelFormBtn
                },
                '[ref=confirmed]':{
                    change: this.onChangeConfirm
                },
                '[ref=viewTransactionAction]': {
                    click: this.onclickViewTransactionAction
                },
                '[ref=addMessageAction]':{
                    click: {fn: this.onclickAddMessageAction, buffer:BestSoft.eventDelay}
                },
                '[ref=viewPrevious]':{
                    click: {fn: this.onclickViewPreviousAction, buffer:BestSoft.eventDelay}
                },
                '.': {
                    afterrender: this.onAfterRenderView
                }

            }, null, this);
        });
    },

    onclickViewPreviousAction: function(){
        var oGrid = this.getOnlineApplicationMessagesGrid();
        var data = [];
        oGrid.getStore().each(function(record){
            data.push(record);
        });

        var message_id = data[0].getId();
        oGrid.loadStore(
            {
                params:{
                    message_id: message_id
                },
                callback: function(records/*, operation, success*/) {
                    //oGrid.freeStore();
                    var array = records.concat(data);
                    oGrid.getStore().loadData(array);
                }
            }
        );
    },

    onTextFieldSpecialKey: function(field, event) {
        console.log("poghos");
        if(event.getKey() == event.ENTER) {
            this.onclickAddMessageAction();
        }
    },

    onclickViewTransactionAction: function(){
        var selection = this.getOnlineApplicationsGrid().getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            console.log(selection[0]);
            var oController = this.application.loadController('Aenis.controller.workflow.'+selection[0].get('ui_type')+'.Manage');
            oController.openTab({trModel:selection[0]});
        }

    },

    onChangeTransactionStatusesCombo: function(oList){

        var selectedStatusId = parseInt(oList.getValue());
        this.getOnlineApplicationsGrid().loadStore({
            params: {tr_status_id: selectedStatusId},
            callback: function(/*records*/) {
            },
            scope:this
        });
    },

    onChangeConfirm: function(){
        if(true === this.getConfirmed().getValue())
        {
            this.getMeetingDateForm().show();
        }
        else
        {
            this.getMeetingDateForm().hide();
        }
    },

    onFormBeforeAction: function(oForm, action){
        var oPanel,
            panels = Ext.ComponentQuery.query("[partyTypeCode]", this.getOnlineApplicationPartiesPanel());

        var data = {
            parties: [],
            objects: null,
            documents: null
        };

        for(var i=0; i<panels.length; ++i)
        {
            oPanel = panels[i]
            data.parties.push({
                party_type_code: oPanel.partyTypeCode,
                data: oPanel.getSubjectRecords()
            });
        }

        var objectsPanel = Ext.ComponentQuery.query("[dataType]", this.getOnlineApplicationObjectsPanel());
        data.objects = objectsPanel[0].getObjectRecords();

        var documentsPanel = Ext.ComponentQuery.query("[dataType]", this.getOnlineApplicationDocumentsPanel());
        data.relationship_documents = documentsPanel[0].getFileRecords();

        data.tr_type_id = this.getOnlineApplicationsGrid().transactionModel.get('tr_type_id');
        data.notary_id = this.getOnlineApplicationsGrid().transactionModel.get('notary_id');
        data.notary = this.getOnlineApplicationsGrid().transactionModel.get('notary');
        data.customer = this.getOnlineApplicationsGrid().transactionModel.get('customer');
        data.app_id = this.getOnlineApplicationsGrid().transactionModel.get('app_id');


        action.params['data'] = Ext.JSON.encode(data);
        return true;
    },

    onFormActionComplete: function(oForm, action){
        if(action instanceof Ext.form.action.Submit)
        {
           // console.log(this.getOnlineApplicationsGrid().transactionModel);
           // this.onclickResetOnlineApplicationPanelFormBtn();
            this.getOnlineApplicationPanelForm().getForm().reset();
           this.getOnlineApplicationTabPanel().hide();
            var msg;
            if(null == this.getOnlineApplicationPanelForm().transactionModel)
            {
                msg = 'updateSuccess';
            }

            Ext.Msg.show({
                title: this.application.title,
                msg: this.getOnlineApplicationPanelForm().messages[msg],
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
        }

        this.getOnlineApplicationsGrid().getStore().reload();

    },

    onFormActionFailed: function(oForm, action){

    },

    onAfterRenderView: function(){
        //this.getOnlineApplicationPanelForm().down('toolbar').hide();
        //this.getOnlineApplicationMessagesGrid().setReadOnly(true);
    },

    onclickResetOnlineApplicationPanelFormBtn: function(){
        this.getOnlineApplicationPartiesPanel().removeAll(true);
        this.getOnlineApplicationObjectsPanel().removeAll(true);
        this.getOnlineApplicationDocumentsPanel().removeAll(true);
    },

    onBeforeRenderTransactionStatusesCombo: function(oList){

        var oStore = oList.getStore();

        oStore.load({
                //params:{mode: 1},
                scope:this,
                callback: function(records) {
                    this.getTransactionStatuses().setValue(records[0]);
                }
            }
        );
    },

    onclickViewAction: function(){
        var selection = this.getOnlineApplicationsGrid().getSelectionModel().getSelection();
        var me = this;
        if(selection.length > 0)
        {
             me.onclickResetOnlineApplicationPanelFormBtn();
            Ext.create('Aenis.model.workflow.Transaction',{id:selection[0].getId()}).reload(
                {
                    params: {
                        info: 'relationships,relationship_documents,relationship_document_files,' +
                            'parties,' +
                            'subjects,subject_documents,subject_document_files,' +
                            'objects,object_documents,object_document_files'
                    }
                },
                function(record, operation/*, success*/){

                    if(operation.wasSuccessful())
                    {
                        me.getOnlineApplicationsGrid().transactionModel = record;
                        Ext.suspendLayouts();
                        var partiesPanel = me.getOnlineApplicationPartiesPanel();
                        var partiesStore = record.relationships().first().parties();

                        var item;
                        partiesStore.each(function(record){
                           var cfg = {
                               xtype: 'mainContactSelectionGrid',
                               margin: '5 4',
                               resizeHandles: 'w e',
                               width: 400,
                               height: 150,
                               title: record.get('party_type_label'),
                               partyTypeCode: record.get('party_type_code')
                           };
                           item = Ext.ComponentManager.create(cfg);
                           partiesPanel.add(item);

                           me.getOnlineApplicationPartiesPanel().down('[partyTypeCode='+record.get('party_type_code')+']').loadFromSubjectsStore(record.subjects());
                        });



                        var objectsPanel = me.getOnlineApplicationObjectsPanel();

                        var relationshipStore = record.relationships();

                        var cfg = {
                            xtype: 'workflowObjectSelectionGrid',
                            ref:'objectsGrid',
                            margin: '5 4',
                            resizeHandles: 'w e',
                            width: 400,
                            height:150,
                            dataType:record.getId(),
                            title: me.T('objects')
                        };
                        item = Ext.ComponentManager.create(cfg);
                        objectsPanel.add(item);
                        me.getOnlineApplicationObjectsPanel().down('[dataType='+record.getId()+']').loadFromObjectsStore(relationshipStore.first().objects());

                        var documentsPanel = me.getOnlineApplicationDocumentsPanel();
                            var cfg = {
                                xtype: 'workflowFileSelectionGrid',
                                ref:'documentsGrid',
                                margin: '5 4',
                                resizeHandles: 'w e',
                                width: 400,
                                height: 150,
                                dataType:record.getId(),
                                title: me.T('documents')
                            };
                            item = Ext.ComponentManager.create(cfg);
                            documentsPanel.add(item);
                            me.getOnlineApplicationDocumentsPanel().down('[dataType='+record.getId()+']').loadFromDocumentsStore(relationshipStore.first().documents());
                        me.getOnlineApplicationTabPanel().show();
                        me.getSaveAction().enable();
                        me.getOnlineApplicationMessagesGrid().loadStore({params:{app_id: selection[0].get('app_id')}});
                        Ext.resumeLayouts(true);
                    }
                });
        }
    },

    onSelectionChangeAction: function(){
        var selection = this.getOnlineApplicationsGrid().getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            this.getApproveRejectApplicationTab().unmask();
            this.getViewAction().enable();
            this.getViewTransactionAction().hide();
            if(selection[0].get('tr_status_code') == 'submitted')
            {
                this.getApproveRejectApplicationTab().mask();
                this.getViewTransactionAction().show();
            }
        }
    },

    onclickSaveAction: function(){
        var oForm = this.getOnlineApplicationPanelForm();
       // this.getMessageContentEditor().triggerSave();
        oForm.submit({params:{
            id: this.getOnlineApplicationsGrid().transactionModel.getId()
        }});
    },

    onclickAddMessageAction: function(){
        var oForm = this.getMessageForm().getForm();
        if(oForm.isValid())
            this.submitModel('create');
       // this.getOnlineApplicationMessagesGrid().getStore().sort('id', 'DESC');
       // this.onclickViewPreviousAction();
       // this.getOnlineApplicationMessagesGrid().getStore().sort('id', 'ASC');
        this.getOnlineApplicationMessagesGrid().getStore().reload();


    },


    modelSyncHandler: function(record, operation) {
        if(!operation.wasSuccessful()) return;
        if(operation.action == 'create')
        {
            this.getOnlineApplicationMessagesGrid().getStore().reload();
        }
        this.getMessageForm().getForm().reset()
    },

    submitModel: function(mode, values) {

        var selection = this.getOnlineApplicationsGrid().getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            var modelName = 'Aenis.model.workflow.application.Messages';
            var operationConfig = {
                scope: this,
                callback: this.modelSyncHandler
            };
            var oForm = this.getMessageForm().getForm();
            values = oForm.getValues();
            values.app_id = selection[0].get('app_id');
            values.notary_id = selection[0].get('notary_id');
            Ext.create(modelName, values).save(operationConfig);
        }
    }

});