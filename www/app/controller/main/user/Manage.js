Ext.define('Aenis.controller.main.user.Manage', {
	extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.main.user.Manage',
        'Aenis.store.main.Users'
    ],


    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
        	oView.control({
                'textfield': {
                    specialkey: {fn: this.onTextFieldSpecialKey, buffer:BestSoft.eventDelay}
                },
                '[action=reset]': {
                    click: this.onclickResetBtn
                },
                '[ref=addAction]': {
                    click: {fn: this.onclickAddBtn, buffer:BestSoft.eventDelay}
                },
                '[ref=editAction]': {
                    click: {fn: this.onclickSaveBtn, buffer:BestSoft.eventDelay}
                },
                '[ref=deleteAction]': {
                    click: {fn: this.onclickDeleteBtn, buffer:BestSoft.eventDelay}
                },
                '[action=autoFillPassword]': {
                    click: this.onclickAutoFillPasswordBtn
                },
                '[action=autoFillPassportSsn]': {
                    click: this.onclickAutoFillPassportSsnBtn
                },
                '#userDetailsForm [name=is_notary]': {
                    change: this.onchangeIsNotaryCheck
                },
                '[ref=usersGrid]': {
                    selectionchange: this.onSelectionChangeUsersGrid
                },
                '.': {
                    afterrender: {fn: this.onAfterRenderMainView, single:true}
                }
            }, null, this);
        });
    },

    onchangeIsNotaryCheck: function(oCheck, checked) {
        if(checked)
            this.getNotaryCodeField().show();
        else
            this.getNotaryCodeField().hide();
    },

    modelSyncHandler: function(record, operation) {
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
        this.getUsersGrid().getStore().reload();
        this.onclickResetBtn();
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

    onclickAutoFillPasswordBtn: function() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ",
            pass_length = 9,
            randomString = '';
        for(var i=0; i<pass_length; i++)
        {
            var rNum = Math.floor(Math.random() * chars.length);
            randomString += chars.substring(rNum, rNum+1);
        }
        this.getUserPasswordField().setValue(randomString);
    },

    onclickAutoFillPassportSsnBtn: function() {
        var languagesStore = this.getUsersGrid().languagesStore;
        var defaultLangId = languagesStore.getLanguageByDefaultFlag().getId();
        var oTabs = this.getContentDetailsTabs();
        var data = {};
        var field = oTabs.query('[name=first_name][langId='+defaultLangId+']');
        data['first_name'] = field[0].getValue();
        field = oTabs.query('[name=last_name][langId='+defaultLangId+']');
        data['last_name'] = field[0].getValue();
        field = oTabs.query('[name=second_name][langId='+defaultLangId+']');
        data['second_name'] = field[0].getValue();
        if(data['first_name'] == '' || data['last_name'] == '' || data['second_name'] == '')
        {
            Ext.Msg.show({
                title: this.application.title,
                msg: this.getDetailsForm().messages['cannot_auto_fill_passport_ssn'],
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            return;
        }
        var me = this;
        Ext.Ajax.request({
            url: 'main/user/get_service_data.php',
            method: 'POST',
            params: {
                data: Ext.JSON.encode(data)
            },
            callback: function(options, success, response) {
                if(Aenis.application.handleAjaxResponse(response))
                {
                    var oResponse = Ext.JSON.decode(response.responseText);
                    if(oResponse.passport)
                    {
                        me.getUserPassportField().setValue(oResponse.passport);
                    }
                    if(oResponse.ssn)
                    {
                        me.getUserSsnField().setValue(oResponse.ssn);
                    }
                }
            }
        });
    },

    onclickAddBtn: function() {
        var oForm = this.getDetailsForm().getForm();
        if(oForm.isValid())
            this.submitModel('create');
    },

    onclickSaveBtn: function() {
        var oForm = this.getDetailsForm().getForm();
        if(oForm.isValid())
            this.submitModel('update');
    },

    onclickDeleteBtn: function() {
        var oGrid = this.getUsersGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
            this.submitModel('destroy', {
                id: selection[0].data.id
            });
    },

    onclickResetBtn: function() {
        this.getDetailsForm().getForm().reset();
        this.getEditAction().disable();
        this.getUsersGrid().getSelectionModel().deselectAll();
    },

    onAfterRenderMainView: function(oView) {
        oView.showConditionalElements();
    	var oGrid = this.getUsersGrid();
        oGrid.mask();
        oGrid.languagesStore.load({
            scope: this,
            callback: function(records, operation) {
                if(operation.wasSuccessful())
                {
                    this.generateContentDetailsTabs(records);
                    oGrid.unmask();
                    oGrid.loadStore();
                }
            }
        });
    },

    /**
     * Create and submit a model to server
     * @param {String} mode    Either 'create', 'update' or 'destroy'
     * @param {Object} [values]     Optional. Values for the model
     */
    submitModel: function(mode, values) {
        var modelName = 'Aenis.model.main.User';
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
            var oForm = this.getDetailsForm().getForm();
            values = oForm.getValues();
            
            values.id = (mode=='create') ? 0 : oForm.getRecord().get('id');
            values.is_ws_consumer = this.getShowUsersBtn().pressed ? 0 : 1;
            
            values.contentData = {};
            var oTabs = this.getContentDetailsTabs();
            var fields = oTabs.query('[name]');

            for(var j=fields.length-1; j>=0; --j)
            {
                var field = fields[j];
                if(!Ext.isObject(values.contentData[field.langId]))
                    values.contentData[field.langId] = {};
            	values.contentData[field.langId][field.name] = field.getValue();
            }
            Ext.create(modelName, values).save(operationConfig);
        }
    },

    generateContentDetailsTabs: function(records) {
        var oTabs = this.getContentDetailsTabs();
        for(var i=0; i<records.length; ++i)
        {
            var record = records[i];
            var cfg = {
                layout: 'fit',
                iconCls: 'lang-' + record.get('code'),
                tabConfig: {
                    title: record.get('title')
                }
            };
            var viewCfg = oTabs.tabContentConfig;
            var oView = Ext.ComponentManager.create(viewCfg);
            var fields = oView.query('[name]');
            for(var j=fields.length-1; j>=0; --j)
            {
                fields[j].langId = record.get('id');
            }
            oTabs.add(cfg).add(oView);
        }
        oTabs.setActiveTab(0);
    },


    loadRecordContent: function(model) {
        var oTabs = this.getContentDetailsTabs();
        var fields = oTabs.query('[name]');
        for(var j=fields.length-1; j>=0; --j)
        {
            var field = fields[j];
            var contentModel = model.content().getById(field.langId);
            if(contentModel)
            {
                field.setValue(contentModel.get(field.name));
            }
            else
            {
                field.reset();
            }
        }
    },

    onSelectionChangeUsersGrid: function(model, selected) {
    	
    	var oForm = this.getDetailsForm().getForm();
        if(selected.length > 0)
        {
            oForm.loadRecord(selected[0]);
            this.loadRecordContent(selected[0]);  
            this.getEditAction().enable();
            this.getDeleteAction().enable();
            this.getDetailsForm().down('[name=password]').allowBlank = true;
        }
        else
        {
            this.getDeleteAction().disable();
            this.onclickResetBtn();
            this.getDetailsForm().down('[name=password]').allowBlank = false;
        }
    }
});
