Ext.define("Aenis.controller.main.contact.natural.AddEditDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.contact.natural.AddEditDlg',
        'Aenis.model.main.contact.Natural'
    ],

    params:{},

    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @returns {Aenis.controller.main.contact.natural.AddEditDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();
        this.oDlg.addEvents(
            /**
             * @event itemSelected
             * Fired when user finishes adding/editing contact.
             * Return FALSE from event handler to prevent dialog from closing.
             * @param {Aenis.model.main.contact.Natural} model    Selected item
             */
            'itemSelected',

            /**
             * @event cancelled
             * Fired when user closes the dialog without selecting an item
             */
            'cancelled'
        );
        this.addComponentRefs(this.oDlg);
        this.oDlg.returnValue = null;
        this.oDlg.params = params || {};
        this.oDlg.control({
            'textfield': {
                specialkey: this.onTextFieldSpecialKey
            },
            '[ref=addAction]':{
                click: {fn: this.addNaturalContact, buffer:BestSoft.eventDelay}
            },
            '[ref=saveAction]':{
                click: {fn: this.saveNaturalContact, buffer:BestSoft.eventDelay}
            },
            '[action=cancel]': {
                click:this.onclickCloseBtn
            },
            '[action=selectCountry]':{
               click:this.onclickSelectCountry
            },
            '.': {
                beforeclose: function(oDlg) {
                    if(oDlg.returnValue)
                    {
                        if(!oDlg.fireEvent('itemSelected', oDlg.returnValue))
                        {
                            oDlg.returnValue = null;
                            return false;
                        }
                    }
                    else
                    {
                        oDlg.fireEvent('cancelled');
                    }
                    delete this.oDlg;
                    return true;
                },
                afterrender:{fn:this.afterRenderForm,single:true}
            }
        }, null, this);
        this.oDlg.show();
        return this.oDlg;
    },

    onTextFieldSpecialKey: function(field, event) {
        if(event.getKey() == event.ENTER) {
            var oForm = this.getAddNaturalForm().getForm();
            var oRecord = oForm.getRecord();
            if(oRecord)
            {
                this.saveNaturalContact();
            }
            else
            {
                this.addNaturalContact();
            }
        }
    },


    onclickSelectCountry: function(){
        var oController = this.application.loadController('main.country.SelectDlg');
        oController.showDialog(/*{onlyForeignCountries:1}*/).on({
            'itemSelected':function(model){
                this.getCountryId().setValue(model.getId());
                this.getCountryLabel().setValue(model.get('name'));
            },
            scope:this
        });
    },


    modelSyncHandler: function(record, operation) {
        if(!operation.wasSuccessful()) return;
        if(operation.action == 'create' || operation.action == 'update')
        {
            Ext.Msg.show({
                title: this.application.title,
                msg: this.getAddNaturalForm().messages[operation.action+'Success'],
                icon: Ext.MessageBox.INFO,
                buttons: Ext.MessageBox.OK
            });
            this.oDlg.returnValue =  record;
        }
        this.onclickResetNaturalContacts();
    },

    addNaturalContact: function(){
        var oForm = this.getAddNaturalForm().getForm();
        if(oForm.isValid())
            this.submitModel('create');
    },

    saveNaturalContact: function(){
        var oForm = this.getAddNaturalForm().getForm();
        if(oForm.isValid())
            this.submitModel('update');
    },

    onclickResetNaturalContacts: function(){
        this.getAddNaturalForm().getForm().reset();
        this.oDlg.close();
    },

    submitModel: function(mode, values) {
        var modelName = 'Aenis.model.main.contact.Natural';
        var operationConfig = {
            scope: this,
            callback: this.modelSyncHandler
        };
        var oForm = this.getAddNaturalForm().getForm();
        values = oForm.getValues();
        Ext.create(modelName, values).save(operationConfig);
    },

    onclickCloseBtn: function() {
        this.oDlg.close();
    },

    afterRenderForm: function(){
        var title;
        if(this.oDlg.params.params.type == 'add')
        {
            title = this.getAddNaturalForm().messages.add_natural_contact_title;
            this.getNaturalContactPanel().setTitle(title);
            this.getAddAction().show();
            this.getSaveAction().hide();
            this.getAddNaturalForm().getForm().setValues(this.oDlg.params.params);
        }
        else
        {
            if(this.oDlg.params.params.data.type == 'edit')
            {
                title = this.getAddNaturalForm().messages.edit_natural_contact_title;
                this.getNaturalContactPanel().setTitle(title);
                this.getAddAction().hide();
                this.getSaveAction().show();
                this.getAddNaturalForm().getForm().setValues(this.oDlg.params.params.data);
            }
        }
    }
});