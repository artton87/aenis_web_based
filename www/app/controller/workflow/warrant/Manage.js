Ext.define('Aenis.controller.workflow.warrant.Manage', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.warrant.Manage',
        'Aenis.model.workflow.Transaction',
        'Aenis.model.workflow.transaction.Type'
    ],


    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.control({
                '[ref=selectTransactionTypeAction]': {
                    click: this.onClickSelectTransactionType
                },
                '[ref=warrantsGrid]': {
                    selectionchange: this.onSelectionChangeWarrantsGrid
                },
                '[action=create_party_by_type]': {
                    click: this.onCreatePartyByTypeAction
                },
                '[ref=objectsGrid]': {
                    validateSelection: this.onValidateObjectSelection
                },
                '[ref=docContentEditor]': {
                    afterrender: this.onAfterRenderDocContentEditor
                },
                '[ref=resetAction]': {
                    click: this.onResetAction
                },
                '[ref=addAction]': {
                    click: {fn: this.onAddAction, buffer:BestSoft.eventDelay}
                },
                '[ref=saveAction]': {
                    click: {fn: this.onSaveAction, buffer:BestSoft.eventDelay}
                },
                '[ref=editAction]': {
                    click: {fn: this.onEditAction, buffer:BestSoft.eventDelay}
                },
                '[ref=approveAction]':{
                    click:this.onClickApproveAction
                },
                '[ref=viewAction]':{
                    click:this.onclickViewActionBtn
                },
                '[ref=viewCompleteAction]':{
                    click:this.onclickViewCompleteAction
                },
                '[ref=detailsForm]': {
                    afterrender: this.onAfterRenderDetailsForm,
                    beforeaction: this.onFormBeforeAction,
                    actioncomplete: this.onFormActionComplete,
                    actionfailed: this.onFormActionFailed
                },
                '[action=selectPartyRight]':{
                    click:this.selectPartyRight
                },
                '[ref=partyRights]':{
                    selectionchange:this.onSelectChangePartyRights
                },
                '[ref=deletePartyRight]':{
                    click:this.deletePartyRight
                },
                '[ref=editPartyRight]':{
                    click:this.editPartyRight
                },
                '[ref=setRelationAction]':{
                    click: this.onSelectSubjectRelationAction
                },
                '[ref=deleteRelationAction]':{
                    click: this.deleteSubjectRelation
                },
                '[ref=setInheritanceRelationAction]':{
                    click: this.onSelectInheritanceRelationAction
                },
                '[ref=isPaidAction]':{
                    click: this.onClickIsPaidAction
                },
                '.':{
                    afterrender: this.onAfterRenderAction
                }
            }, null, this);

        });
    },


    onAfterRenderAction: function(){

    },

    onClickIsPaidAction: function(){
        var selection = this.getWarrantsGrid().getSelectionModel().getSelection();
        var me=this;
        if(selection.length > 0)
        {
            if(selection[0].get('tr_status_code') == "approved" && selection[0].get('is_paid') == false )
            {
                Ext.Ajax.request({
                    url: 'workflow/transaction/is_paid.php',
                    method: 'POST',
                    params: {
                        transaction_id: selection[0].getId()
                    },
                    callback: function(options, success, response) {
                        if(me.application.handleAjaxResponse(response))
                        {
                            response = Ext.JSON.decode(response.responseText);
                            if(response.success)
                            {
                                selection[0].set('is_paid',1);
                                selection[0].commit();
                                Ext.MessageBox.alert({
                                    title: me.application.title,
                                    msg: me.getDetailsForm().messages.transaction_is_paid,
                                    icon: Ext.MessageBox.INFO, buttons: Ext.MessageBox.OK
                                });
                            }
                        }
                    }
                });
            }

        }
    },


    onAfterRenderDocContentEditor: function(editor) {
        editor.setVariableSubstituteConfig({
            scope: this,
            fn: this.variableSubstituteFn
        });
    },


    onclickViewCompleteAction: function(){
        var selection = this.getWarrantsGrid().getSelectionModel().getSelection();
        var me = this;
        if(selection.length > 0)
        {
            Ext.create('Aenis.model.workflow.Transaction',{id:selection[0].getId()}).reload(
                {
                    params: {
                        info: 'relationships,relationship_documents,relationship_document_files,'
                    }
                },
                function(record, operation/*, success*/){
                    var trTypeModel = me.getTransactionTypeField().transactionModel;
                    var docModel = record.relationships().first().documents().findRecord('tr_type_id',trTypeModel.getId(), false, false, false, true);
                    var oController = me.application.loadController('Aenis.controller.workflow.document.ViewDlg');
                    oController.showDialog({docModel:docModel});
                }
            );
        }
    },

    onclickViewActionBtn: function(){

        this.getPartiesPanel().actionMode = 'view';

        this.getViewCompleteAction().show();
        var selection = this.getWarrantsGrid().getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            var me = this,
                transactionId = selection[0].get('id');
            Ext.create('Aenis.model.workflow.Transaction', {id:transactionId}).reload(
                {
                    params: {
                        info: 'properties,' +
                            'relationships,relationship_documents,relationship_document_files,' +
                            'parties,party_rights,' +
                            'subjects,subject_documents,subject_document_files,subject_relations,' +
                            'objects,object_documents,object_document_files'
                    }
                },
                function(record, operation/*, success*/) {
                    if(operation.wasSuccessful())
                    {
                            me.getSaveAction().disable();
                            me.getAddAction().disable();
                            me.getDetailsForm().transactionModel = record;

                            var trTypeModel = Ext.create('Aenis.model.workflow.transaction.Type', {id:selection[0].get('tr_type_id')});

                            me.getTransactionTypeField().setValue(record.get('tr_type_label'));
                            me.getTransactionTypeField().transactionModel = trTypeModel;
                            me.getSelectTransactionTypeAction().disable();
                            var partyAgentRecord = record.relationships().first().parties().findRecord('party_type_code','agent', 0, false, false, true);
                            me.getPartyRights().reconfigure(partyAgentRecord.rights());

                            me.initWithTransactionType(trTypeModel);

                        Ext.suspendLayouts();

                         var subjectRelationPanel = me.getSubjectRelationPanel();
                         var relationStore = record.relations();

                         var item;
                         relationStore.each(function(rec){
                         var date = new Date().getTime();

                         var cfg = {
                             xtype: 'bsgrid',
                             title: rec.get('label'),
                             autoLoadStore: false,
                             hideHeaders:true,
                             resizable: true,
                             resizeHandles: 's e se',
                             tools: [],
                             store: Ext.create('Aenis.store.workflow.subject.Relations'),
                             relTypeId: rec.get('rel_type_id'),
                             subjectRelCode: rec.get('subject_relation_id'),
                             passingCode:'relations'+date,
                             flex: 1,
                             margin: '5 4',
                             closable:  true,
                             columns: [
                             {
                                 flex:1,
                                 dataIndex:'contactName'
                             }]
                         };
                         item = Ext.ComponentManager.create(cfg);
                         subjectRelationPanel.add(item);
                         me.getSubjectRelationPanel().down('[subjectRelCode='+rec.get('subject_relation_id')+']').getStore().loadData(rec.get('data'));
                         });

                         Ext.resumeLayouts(true);

                    }
                }
            );
        }
    },


    variableSubstituteFn: function(editor, templateVariableModel, args/*, data*/) {
        var code = templateVariableModel.get('code');
        if(code == 'notary_name_full' || code == 'notary_name_initials')
        {
            var notaryId = this.getNotariesCombo().getValue();
            var notariesStore = this.getNotariesCombo().getStore();
            var notaryModel = notariesStore.getById(parseInt(notaryId));
            if(code == 'notary_name_full')
                return notaryModel.getFullName();
            if(code == 'notary_name_initials')
                return notaryModel.getInitialsName();
        }
        else if(code == 'transaction_party')
        {
            var partyTypeId = args['party'];
            var partiesPanel = this.getPartiesPanel();
            var oPartyGrid = partiesPanel.down('[partyTypeId='+partyTypeId+']');
            if(oPartyGrid)
            {
                var subjects = oPartyGrid.getStore().getFieldData('contactName');
                console.log(subjects);
                return subjects.join(', ');
            }
        }
        else if(code == 'transaction_property')
        {
            var propertyTypeId = parseInt(args['property']);
            var oPropertiesGrid = this.getPropertiesGrid();
            var propertyModel = oPropertiesGrid.getStore().getById(propertyTypeId);
            if(propertyModel)
                return propertyModel.getDisplayValue();
        }
        else if(Ext.Array.contains(['vehicleObjects', 'shareObjects', 'stockObjects', 'realtyObjects', 'otherObjects'], code))
        {
            var singleCode = code.split("Objects");
            singleCode = singleCode[0];
            var text = "";
            this.getObjectsGrid().getStore().each(function(model){
                if(model.get('objectType') == singleCode)
                {
                    text += editor.parse(templateVariableModel.get('content'), {objectModel:model});
                }
            });
            return text;
        }
        else if(Ext.Array.contains(['vehicle', 'share', 'stock', 'realty', 'other'], code))
        {
            return this.getObjectVariableValue(code, editor, templateVariableModel, args);
        }
        return null;
    },

    getObjectVariableValue: function(objectType, editor, templateVariableModel, args/*, data*/) {
        var objectModel = null;
        this.getObjectsGrid().getStore().each(function(model){
            if(model.get('objectType') == objectType)
            {
                objectModel = model;
                return false;
            }
            return true;
        });
        return objectModel ? objectModel.get('objectData')[args.property] : '';
    },


    onClickSelectTransactionType: function() {
        var oController = this.application.loadController('workflow.transaction.type.SelectDlg');
        oController.showDialog({uiType: 'warrant'}).on({
            itemSelected: function(model) {
                this.getTransactionTypeField().setValue(model.getTitle());
                this.getTransactionTypeField().transactionModel = model;
                this.initWithTransactionType(model);
            },
            scope: this
        });
    },

    onResetAction: function() {
        Ext.suspendLayouts();
        var trTypeModel = this.getTransactionTypeField().transactionModel;
        if(trTypeModel)
        {
            this.removePartyPanels();
            var partyTypesStore = trTypeModel.partyTypes();
            if(partyTypesStore.isLoaded())
                this.createPartyPanels(partyTypesStore);

            var propertyTypesStore = trTypeModel.propertyTypes();
            if(propertyTypesStore.isLoaded())
                this.getPropertiesGrid().resetStore();
        }
        this.getDetailsForm().getForm().reset();
        this.getObjectsGrid().freeStore();
        this.getRelationshipDocumentsGrid().freeStore();
        this.getPartyRights().freeStore();
        this.getSubjectRelationPanel().removeAll(true);
        this.getSaveAction().disable();
        this.getAddAction().enable();
        this.getViewAction().hide();
        this.getViewCompleteAction().hide();
        Ext.resumeLayouts(true);
    },


    onAddAction: function() {
        this.getDocContentEditor().triggerSave();
        var oForm = this.getDetailsForm().getForm();
        oForm.submit({params:{}});
    },


    onSaveAction: function() {
        this.getDocContentEditor().triggerSave();
        var oFormCmp = this.getDetailsForm();
        oFormCmp.getForm().submit({
            params: {
                id: oFormCmp.transactionModel.getId()
            }
        });
    },


    onFormBeforeAction: function(oForm, action) {
        var oFormCmp = this.getDetailsForm();
        if(this.getDocContentEditor().getValue() == "") {
            Ext.Msg.alert(
                this.application.title,
                oFormCmp.messages["doc_content_empty"]
            );
            return false;
        }

        var data = {
            notary_id: parseInt(this.getNotariesCombo().getValue()),
            tr_type_id: this.getTransactionTypeField().transactionModel.getId(),
            party_rights: this.getPartyRightsId(),
            parties: [],
            subject_relations: [],
            objects: null,
            properties: null
        };

        //collect parties
        var oPanel, partyTypeModel,
            oPartiesStore = this.getPartyTypesCombo().getStore(),
            panels = Ext.ComponentQuery.query("[partyTypeId]", this.getPartiesPanel());
        for(var i=0; i<panels.length; ++i)
        {
            oPanel = panels[i];
            partyTypeModel = oPartiesStore.getById(parseInt(oPanel.partyTypeId));
            if(partyTypeModel.get('is_required') && oPanel.isEmpty())
            {
                Ext.Msg.alert(
                    this.application.title,
                    Ext.String.format(
                        oFormCmp.messages["party_subjects_empty"],
                        Ext.String.capitalize(partyTypeModel.get('party_type_label'))
                    )
                );
                return false;
            }
            if(!oPanel.isValid()) //panel is not empty, but may contain invalid records
            {
                Ext.Msg.alert(
                    this.application.title,
                    Ext.String.format(
                        oFormCmp.messages["party_subjects_invalid"],
                        Ext.String.capitalize(partyTypeModel.get('party_type_label'))
                    )
                );
                return false;
            }
            data.parties.push({
                party_type_id: oPanel.partyTypeId,
                party_type_code: oPanel.partyTypeCode,
                data: oPanel.getSubjectRecords()
            });
        }


        var subjectRelationPanel = Ext.ComponentQuery.query("[passingCode]", this.getSubjectRelationPanel()),
            oSubjectRelationPanel;

        for(var i=0; i<subjectRelationPanel.length; ++i)
        {
            oSubjectRelationPanel = subjectRelationPanel[i];

            data.subject_relations.push({
                rel_type_id: oSubjectRelationPanel.relTypeId,
                subject_rel_id: oSubjectRelationPanel.subjectRelCode,
                data: this.getSubjectRelationData(oSubjectRelationPanel)
            });
        }


        //collect objects
        if(this.getObjectsGrid().isEmpty())
        {
            Ext.Msg.alert(this.application.title, oFormCmp.messages["objects_empty"]);
            return false;
        }
        if(!this.getObjectsGrid().isValid()) //objects list is not empty, but may contain invalid records
        {
            Ext.Msg.alert(this.application.title, oFormCmp.messages["objects_invalid"]);
            return false;
        }
        data.objects = this.getObjectsGrid().getObjectRecords();

        //collect properties
        var failedRecord = this.getPropertiesGrid().getFirstFailedRecord();
        if(failedRecord)
        {
            Ext.Msg.alert(
                this.application.title,
                Ext.String.format(
                    oFormCmp.messages["required_property_missing"],
                    failedRecord.get('label')
                )
            );
            return false;
        }
        data.properties = this.getPropertiesGrid().getRecords();

        //collect relationship documents
        if(!this.getRelationshipDocumentsGrid().isValid()) //relationship document list may contain invalid records
        {
            Ext.Msg.alert(this.application.title, oFormCmp.messages["relationship_documents_invalid"]);
            return false;
        }
        data.relationship_documents = this.getRelationshipDocumentsGrid().getFileRecords();

        action.params['data'] = Ext.JSON.encode(data);
        return true;
    },


    onFormActionComplete: function(oForm, action) {
        if(action instanceof Ext.form.action.Submit)
        {
            this.onResetAction();
            var msg;
            if(null == this.getDetailsForm().transactionModel) //adding completed
            {
                msg = 'createSuccess';
            }
            else //editing completed
            {
                msg = 'updateSuccess';
                this.onUnlockActionUpdateControls();
                this.resetTransactionType();
            }
            Ext.Msg.show({
                title: this.application.title,
                msg: this.getDetailsForm().messages[msg],
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            this.getWarrantsGrid().getStore().reload();
        }
    },

    onFormActionFailed: function(oForm, action) {
        if(action instanceof Ext.form.action.Submit)
        {
            if(action.failureType == Ext.form.action.Action.SERVER_INVALID)
            {
                var obj = Ext.JSON.decode(action.response.responseText);
                Ext.Msg.alert(this.application.title, obj.errors.reason);


            }
            var panels = Ext.ComponentQuery.query("[partyTypeId]", this.getPartiesPanel());
            for(var i=0; i<panels.length; ++i)
            {
                panels[i].resetFileFields();
            }

            this.getObjectsGrid().resetFileFields();
            this.getRelationshipDocumentsGrid().resetFileFields();
        }
    },


    onAfterRenderDetailsForm: function(oForm) {
        oForm.loadingProgressStore.on('add', this.onAddDetailsFormLoadingProgressStore, this);
    },


    onAddDetailsFormLoadingProgressStore: function(loadingProgressStore) {
        var shouldBeLoaded = ['parties', 'properties'];
        for(var i=shouldBeLoaded.length-1; i>=0; --i) //check if all items which should be loaded are loaded
        {
            if(null == loadingProgressStore.findRecord('loaded_item', shouldBeLoaded[i], false, true, true))
            {
                return; //i-th item is not loaded yet, do not continue
            }
        }

        //if we are here, all items were loaded
        this.getDetailsForm().setLoading(false); //enable the form
        loadingProgressStore.removeAll(); //empty the progress store for future use

        //we have completed loading
        this.initWithTransactionTypeCompleted();
    },


    initWithTransactionTypeCompleted: function() {
        var oForm = this.getDetailsForm();
        var transactionModel = oForm.transactionModel;
        if(transactionModel) //we are in editing mode
        {
            //ensure, that a party panel is created for each party
            var relModel = transactionModel.relationships().first();
            var partyStore = relModel.parties();
            partyStore.each(function(partyModel) {
                var partyTypeId = partyModel.get('party_type_id');
                var partiesPanel = this.getPartiesPanel();
                var partyCmp = partiesPanel.down('[partyTypeId='+partyTypeId+']');
                if(!partyCmp) //if party panel is not created yet
                {
                    partyCmp = this.createPartyByType(partyTypeId); //create it ????///review
                }
                partyCmp.loadFromSubjectsStore(partyModel.subjects()); //load subjects into panel
            }, this);

            //we finished adding party components for each needed type, now filter party types store
            this.filterPartyTypesStore();

            //load properties
            var propertiesStore = transactionModel.properties();
            var propertiesGrid = this.getPropertiesGrid();
            propertiesStore.each(function(propertyModel) {
                var propertyTypeId = propertyModel.getId();
                var el = oForm.down("[propertyTypeId="+propertyTypeId+"]");
                if(el)
                {
                    el.setValue(propertyModel.get('value'));
                }
                else
                {
                    propertiesGrid.setPropertyValue(propertyTypeId, propertyModel.get('value'));
                }
            }, this);

            //load objects
            this.getObjectsGrid().loadFromObjectsStore(relModel.objects()); //load objects into panel

            //load relationship documents
            this.getRelationshipDocumentsGrid().loadFromDocumentsStore(relModel.documents()); //load documents into panel
        }
    },


    onEditAction: function() {


        var oGrid = this.getWarrantsGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        //this.getSubjectRelationPanel().removeAll(true);
        if(selection.length > 0)
        {

            var me = this,
                transactionId = selection[0].get('id');
            var currentPage = this.getWarrantsGrid().getStore().currentPage;
            //this.getWarrantsGrid().getStore().load({start:0,limit:25});
            //this.getWarrantsGrid().getStore().loadPage(currentPage);

            Ext.create('Aenis.model.workflow.Transaction', {id:transactionId}).reload(
                {
                    params: {
                        info: 'properties,' +
                            'relationships,relationship_documents,relationship_document_files,' +
                            'parties,party_rights,' +
                            'subjects,subject_documents,subject_document_files,subject_relations,' +
                            'objects,object_documents,object_document_files',
                        lock: 1
                    }
                },
                function(record, operation/*, success*/) {
                    if(operation.wasSuccessful())
                    {
                        //selection[0].set('locked_user_id',0);
                        //selection[0].commit();
                        me.onResetAction();

                        var loggedInUserId = Ext.state.Manager.get('userId');
                        var lockedUserId = record.get('locked_user_id');

                        console.log("lock user id by server");
                        console.log(record.get('locked_user_id'));
                        console.log("lock user id by client");
                        console.log(selection[0].get('locked_user_id'));

                        if(loggedInUserId == lockedUserId) //we locked successfully
                        {
                            console.log("locked user came");
                            me.getSaveAction().enable();
                            me.getAddAction().disable();

                            me.getDetailsForm().transactionModel = record;

                            var trTypeModel = Ext.create('Aenis.model.workflow.transaction.Type', {id:selection[0].get('tr_type_id')});

                            me.getTransactionTypeField().setValue(record.get('tr_type_label'));
                            me.getTransactionTypeField().transactionModel = trTypeModel;
                            me.getSelectTransactionTypeAction().disable();
                            me.initWithTransactionType(trTypeModel);
                            var partyAgentRecord = record.relationships().first().parties().findRecord('party_type_code','agent', 0, false, false, true);
                            me.getPartyRights().reconfigure(partyAgentRecord.rights());

                            Ext.suspendLayouts();

                            var subjectRelationPanel = me.getSubjectRelationPanel();
                            var relationStore = record.relations();

                            var item;
                            relationStore.each(function(rec){
                                var date = new Date().getTime();

                                 var cfg = {
                                     xtype: 'bsgrid',
                                     title: rec.get('label'),
                                     autoLoadStore: false,
                                     hideHeaders:true,
                                     resizable: true,
                                     resizeHandles: 's e se',
                                     tools: [],
                                     store: Ext.create('Aenis.store.workflow.subject.Relations'),
                                     relTypeId: rec.get('rel_type_id'),
                                     subjectRelCode: rec.get('subject_relation_id'),
                                     passingCode:'relations'+date,
                                     flex: 1,
                                     margin: '5 4',
                                     closable:  true,
                                     columns: [
                                     {
                                         flex:1,
                                         dataIndex:'contactName'
                                     }]
                                 };
                                item = Ext.ComponentManager.create(cfg);
                                subjectRelationPanel.add(item);
                                me.getSubjectRelationPanel().down('[subjectRelCode='+rec.get('subject_relation_id')+']').getStore().loadData(rec.get('data'));
                            });

                            Ext.resumeLayouts(true);

                        }
                        else
                        {
                            Ext.Msg.alert(
                                me.application.title,
                                Ext.String.format(
                                    oGrid.messages["locked_by_user"],
                                    record.get('locked_user')
                                )
                            );
                            //selection[0].set('locked_user_id', lockedUserId);
                        }
                        selection[0].set('locked_user_id', lockedUserId);
                        selection[0].commit();
                    }
                }
            );
        }
    },


    onUnlockAction: function() {
        var oGrid = this.getWarrantsGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            var me = this, transactionId = selection[0].get('id');
            oGrid.setLoading(true);
            Ext.Ajax.request({
                url: 'workflow/transaction/unlock.php',
                method: 'POST',
                params: {
                    transaction_id: transactionId
                },
                callback: function(options, success, response) {
                    oGrid.setLoading(false);
                    if(me.application.handleAjaxResponse(response))
                    {
                        response = Ext.JSON.decode(response.responseText);
                        if(response.success)
                        {
                            selection[0].set('locked_user_id', 0);
                            selection[0].commit();
                            me.onResetAction();
                            me.onUnlockActionUpdateControls();
                            me.getDetailsForm().transactionModel = null;
                            me.resetTransactionType();
                        }
                    }
                }
            });
        }
    },

    onUnlockActionUpdateControls: function() {
        this.getWarrantsGrid().enable();
        this.getSaveAction().disable();
        this.getAddAction().enable();
    },

    resetTransactionType: function() {
        this.getTransactionTypeField().reset();
        this.getTransactionTypeField().transactionModel = null;
        this.getSelectTransactionTypeAction().enable();
        var oFormCmp = this.getDetailsForm();
        this.removePartyPanels();
        oFormCmp.down('tabpanel').setActiveTab(this.getPartiesPanel());
        oFormCmp.disable();
    },


    /**
     * Called when transaction type is being selected.
     * Initializes UI parts and loads all related stores.
     * @param {Aenis.model.workflow.transaction.Type} trTypeModel    Transaction type model
     */
    initWithTransactionType: function(trTypeModel) {
        var transactionTypeId = trTypeModel.getId();

        //init content editor
        var oEditor = this.getDocContentEditor();
        oEditor.setTransactionTypeId(transactionTypeId);

        // Enable transaction input/edit form and start loading.
        // When loading will be finished, form will enable automatically after calling setLoading(false)
        var oForm = this.getDetailsForm();
        oForm.enable();
        oForm.setLoading(true);

        //prepare parties UI
        var partyTypesStore = trTypeModel.partyTypes();
        this.removePartyPanels();
        partyTypesStore.on('load', this.partyTypesStoreLoaded, this, {single: true});
        partyTypesStore.load();

        //prepare properties UI
        var propertyTypesStore = trTypeModel.propertyTypes();
        propertyTypesStore.on('load', this.propertyTypesStoreLoaded, this, {single: true});
        propertyTypesStore.load();

    },


    partyTypesStoreLoaded: function(partyTypesStore) {
        this.createPartyPanels(partyTypesStore);
        this.getDetailsForm().loadingProgressStore.add({loaded_item: 'parties'});


        if(this.getPartiesPanel().actionMode)
        {
            if(this.getPartiesPanel().actionMode == 'view')
            {
                var panels = Ext.ComponentQuery.query("[partyTypeId]", this.getPartiesPanel());
                for(var i=0; i<panels.length; ++i)
                {
                    panels[i].down('toolbar').hide();
                }
                this.getObjectsGrid().down('toolbar').hide();
                this.getRelationshipDocumentsGrid().down('toolbar').hide();
                this.getPartyRights().down('toolbar').hide();
                this.getSetRelationAction().disable();
                this.getDocContentEditor().getEditor().setReadOnly(true);
                delete this.getPartiesPanel().actionMode;
            }
        }
    },

    propertyTypesStoreLoaded: function(store) {
        var oGrid = this.getPropertiesGrid(),
            oContainer = this.getDetailsForm(),
            uiRecords = [];
        store.each(function(record) {
            var code = record.get('property_type_code');
            var el = oContainer.down("[propertyTypeCode="+code+"]");
            if(code && el)
            {
                el.propertyTypeId = record.getId();
                uiRecords.push(record);
            }
        });
        store.suspendEvents();
        store.remove(uiRecords);
        store.resumeEvents();
        store.commitChanges();
        oGrid.setPropertyTypesStore(store);
        this.getDetailsForm().loadingProgressStore.add({loaded_item: 'properties'});
    },


    /**
     * Creates panel for each party type
     * @param {Ext.data.Store} store    A store of Aenis.model.workflow.transaction.type.party.Type models
     */
    createPartyPanels: function(store) {
        Ext.suspendLayouts();
        var me = this;
        store.each(function(record) {
            if(record.get('is_required'))
                me.createPartyByType(record);
        });
        var oCombo = this.getPartyTypesCombo();
        oCombo.bindStore(store);
        this.filterPartyTypesStore();
        Ext.resumeLayouts(true);
    },


    /**
     * Removes all party panels
     */
    removePartyPanels: function() {
        this.getPartiesTopBar().hide();
        this.getPartiesPanel().removeAll(true);
    },

    
    onCreatePartyByTypeAction: function() {
        this.createPartyByType(parseInt(this.getPartyTypesCombo().getValue()));
    },


    /**
     * Creates an UI block for party input
     * @param {Aenis.model.workflow.transaction.type.party.Type|Number} partyTypeModel    Either model or party type id
     * @return {Aenis.view.main.contact.components.SelectionGrid}    A created component for input of party subjects
     */
    createPartyByType: function(partyTypeModel) {
        if(Ext.isNumber(partyTypeModel))
        {
            var partyTypeId = partyTypeModel;
            partyTypeModel = this.getPartyTypesCombo().getStore().getById(parseInt(partyTypeId));
        }
        var partiesPanel = this.getPartiesPanel();
        var partyCmpCfg = Ext.clone(partiesPanel.partyComponentConfig);
        Ext.apply(partyCmpCfg, {
            title: partyTypeModel.get('party_type_label'),
            closable: partyTypeModel.get('is_required') ? false : true,
            partyTypeId: partyTypeModel.getId(),
            listeners: {
                destroy: {fn: this.filterPartyTypesStore, scope: this, single: true},
                render: {fn: this.filterPartyTypesStore, scope: this, single: true},
                validateSelection: {fn: this.onValidateContactSelection, scope: this}
            }
        });
        var partyCmp = Ext.ComponentManager.create(partyCmpCfg);
        partiesPanel.add(partyCmp);
        return partyCmp;
    },


    /**
     * Filters party types store by excluding items for which a party component is created
     */
    filterPartyTypesStore: function() {
        var partiesPanel = this.getPartiesPanel(),
            oCombo = this.getPartyTypesCombo();
        if(!oCombo) return;
        var partyTypesStore = oCombo.getStore();
        partyTypesStore.filterBy(function(record) {
            var id = record.getId();
            return (partiesPanel.down('[partyTypeId='+id+']')) ? false : true;
        }, partiesPanel);

        var firstItem = partyTypesStore.first();
        if(firstItem) //if after filtering there are items remaining, select the first one
        {
            oCombo.select(firstItem);
            this.getPartiesTopBar().show();
        }
        else //if all items are filtered out, completely disable top bar with combobox
        {
            this.getPartiesTopBar().hide();
        }
    },


    onValidateContactSelection: function(oGrid, mode, newRecord/*, oldRecord*/) {
        var bOk = true,
            me = this,
            partiesPanel = this.getPartiesPanel();
        partiesPanel.items.each(function(item) {
            if(item.contactExists(newRecord))
            {
                Ext.Msg.show({
                    title: me.application.title,
                    msg: partiesPanel.msgSubjectExists,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });
                bOk = false;
                return false;
            }
            return true;
        });
        return bOk;
    },


    onValidateObjectSelection: function(oGrid, mode, newRecord/*, oldRecord*/){
        if(oGrid.objectExists(newRecord))
        {
            Ext.Msg.show({
                title: this.application.title,
                msg: oGrid.msgObjectExists,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return false;
        }
        return true;
    },


    onSelectionChangeWarrantsGrid: function(selModel, selected) {
        this.getEditAction().disable();
        this.getApproveAction().disable();
        this.getTerminateAction().disable();
        this.getViewAction().hide();
        if(selected.length > 0)
        {
            if(selected[0].get('tr_status_code') == 'approved')
            {
                this.getTerminateAction().enable();
                this.getViewAction().show();
                this.getEditAction().disable();
                this.getIsPaidAction().enable();
            }
            else
            {
                this.getEditAction().enable();
            }

            if(selected[0].get('tr_status_code') == 'approved' && selected[0].get('is_paid') == true)
            {
                this.getIsPaidAction().disable();
            }

            if(selected[0].get('locked_user_id') > 0)
            {

            }
            else
            {
                if(selected[0].get('tr_status_code') != 'approved')
                {
                    this.getApproveAction().enable();
                }
            }
        }
    },

    onClickApproveAction: function(){
        var selection = this.getWarrantsGrid().getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            var oController = this.application.loadController('workflow.warrant.ApproveDlg');
            oController.showDialog({model:selection[0]}).on({
                actionCompleted: function() {
                    this.getWarrantsGrid().loadStore();
                    this.onResetAction();
                    this.getEditAction().disable();
                    this.getApproveAction().disable();
                },
                scope: this
            });
        }
    },

    selectPartyRight: function(){
        var me = this;

        var oController = this.application.loadController('workflow.party.right.type.SelectDlg');
        oController.showDialog({}).on({
            itemSelected: function(record) {

                var found = false;
                Ext.Array.each(record, function(model) {

                    var checkFn = function(row) {

                        if(row.data.party_right_type_id != 0 && model.get('id') != 0)
                        {
                            return (row.data.party_right_type_id === model.get('id'));
                        }
                        return false;
                    };
                    if(me.getPartyRights().getStore().findBy(checkFn) >= 0)
                    {
                        found = true;
                    }

                    if(found)
                    {
                        Ext.Msg.show({
                            title: me.application.title,
                            msg: me.T("existing_right"),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });
                        return;
                    }

                    me.getPartyRights().getStore().add({
                        "party_right_type_id": model.getId(),
                        "party_right_type_label": model.get('label')
                    });
                });
            },
            scope:this
        });

    },

    editPartyRight: function(){
        var me = this;

        var selectionModel = this.getPartyRights().getSelectionModel();

        if(selectionModel.hasSelection())
        {
            var selection = selectionModel.getLastSelected();
        }

        var oController = this.application.loadController('workflow.party.right.type.SelectDlg');
        oController.showDialog({}).on({
            itemSelected: function(record) {
                var found = false;
                Ext.Array.each(record, function(model, index) {
                    var checkFn = function(row) {
                        if(row.data.party_right_type_id != 0 && model.get('id') != 0)
                        {
                            return (row.data.party_right_type_id === model.get('id'));
                        }
                        return false;
                    };
                    if(me.getPartyRights().getStore().findBy(checkFn) >= 0)
                    {
                        found = true;
                    }

                    if(found)
                    {
                        Ext.Msg.show({
                            title: me.application.title,
                            msg: me.T("existing_right"),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });
                        return;
                    }
                    if(index == 0)
                    {
                        selection.set({
                            "id": 0,
                            "party_right_type_id": model.getId(),
                            "party_right_type_label": model.get('label')
                        });
                    }
                    else
                    {
                        me.getPartyRights().getStore().add({
                            "party_right_type_id": model.getId(),
                            "party_right_type_label": model.get('label')
                        });
                    }
                });
            },
            scope:this
        });
    },

    deletePartyRight: function(){
        var selection = this.getPartyRights().getSelectionModel().getSelection()[0];
        if(selection)
        {
            this.getPartyRights().getStore().remove(selection);
        }
    },

    onSelectChangePartyRights: function(){
        this.getDeletePartyRight().enable();
        this.getEditPartyRight().enable();
    },

    getPartyRightsId: function(){
        var party_rights = [];
        var oPartyRightsStore = this.getPartyRights().getStore();
        oPartyRightsStore.each(function(model) {
            party_rights.push({
                id:model.data.id,
                party_right_type_id:model.data.party_right_type_id
            });
        });
        return party_rights;
    },


    onSelectSubjectRelationAction: function(){
        var agents = this.getPartiesPanel().down('[partyTypeId=2]').getSubjectRecords();
        var oController = this.application.loadController('workflow.subject.relation.AgentSelectDlg');
        oController.showDialog({model:agents}).on({
            itemSelected: function(record) {
                Ext.suspendLayouts();

                var date = new Date().getTime();
                var subjectRelationPanel = this.getSubjectRelationPanel();
                var item;
                var cfg = {
                    xtype: 'bsgrid',
                    title: record.rel_type,
                    autoLoadStore: false,
                    hideHeaders:true,
                    resizable: true,
                    resizeHandles: 's e se',
                    tools: [],
                    store: Ext.create('Aenis.store.workflow.subject.Relations'),
                    subjectRelCode: 'relations'+date,
                    passingCode:'relations'+date,
                    relTypeId: record.rel_type_id,
                    flex: 1,
                    margin: '5 4',
                    closable:  true,
                    columns: [
                        {
                            flex:1,
                            dataIndex:'contactName'
                        }]
                };
                item = Ext.ComponentManager.create(cfg);
                subjectRelationPanel.add(item);
                this.getSubjectRelationPanel().down('[subjectRelCode=relations'+date+']').getStore().loadData(record.data);

                Ext.resumeLayouts(true);
            },
            scope: this
        });
    },


    getSubjectRelationData: function(oPanel){

        var store = oPanel.getStore();
        var items = [];
        store.each(function(record){
             items.push({
                 subject_id: record.get('id'),
                 serviceData: record.get('serviceData')
             })
        });
        return items;
    }

});
