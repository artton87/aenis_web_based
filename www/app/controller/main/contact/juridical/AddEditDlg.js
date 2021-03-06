Ext.define("Aenis.controller.main.contact.juridical.AddEditDlg",{
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.contact.juridical.AddEditDlg',
        'Aenis.store.main.contact.juridical.Types'
    ],

    params:{},

    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @returns {Aenis.controller.main.contact.juridical.AddEditDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();
        this.oDlg.addEvents(
            /**
             * @event itemSelected
             * Fired when user finishes adding/editing contact.
             * Return FALSE from event handler to prevent dialog from closing.
             * @param {Aenis.model.main.contact.Juridical} model    Selected item
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
            '[action=add]':{
                click: {fn: this.addJuridicalContact, buffer:BestSoft.eventDelay}
            },
            '[action=save]':{
                click: {fn: this.saveJuridicalContact, buffer:BestSoft.eventDelay}
            },
            '[action=cancel]': {
                click:this.onclickCloseBtn
            },
            '[action=selectCountry]':{
                click:this.onclickSelectCountry
            },
            '[ref=juridicalTypes]':{
                beforeRender:this.beforeRenderJuridicalTypes
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


    beforeRenderJuridicalTypes: function(oList){
        var oStore = oList.getStore();
        oStore.load({
                scope:this,
                callback: function(records) {
                    this.getJuridicalTypes().setValue(records[0]);
                }
            }
        );
    },


    onTextFieldSpecialKey: function(field, event) {
        if(event.getKey() == event.ENTER) {
            var oForm = this.getAddJuridicalForm().getForm();
            var oRecord = oForm.getRecord();
            if(oRecord)
            {
                this.saveJuridicalContact();
            }
            else
            {
                this.addJuridicalContact();
            }
        }
    },

    onclickSelectCountry: function(){
        var oController = this.application.loadController('main.country.SelectDlg');
        oController.showDialog({onlyForeignCountries:1}).on({
            'itemSelected':function(model){
                this.getCountryId().setValue(model.data.id);
                this.getCountryLabel().setValue(model.data.name);
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
                msg: this.getAddJuridicalForm().messages[operation.action+'Success'],
                icon: Ext.MessageBox.INFO,
                buttons: Ext.MessageBox.OK
            });
            this.oDlg.returnValue = record
        }
        this.onclickResetJuridicalContacts();
    },

    addJuridicalContact: function(){
        var oForm = this.getAddJuridicalForm().getForm();
        if(oForm.isValid())
            this.submitModel('create');
    },

    saveJuridicalContact: function(){
        var oForm = this.getAddJuridicalForm().getForm();
        if(oForm.isValid())
            this.submitModel('update');
    },

    onclickResetNaturalContacts: function(){
        this.getAddJuridicalForm().getForm().reset();
        this.oDlg.close();
    },

    submitModel: function(mode, values) {
        var modelName = 'Aenis.model.main.contact.Juridical';
        var operationConfig = {
            scope: this,
            callback: this.modelSyncHandler
        };
        var oForm = this.getAddJuridicalForm().getForm();
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
            title = this.getAddJuridicalForm().messages.add_juridical_contact_title;
            this.getJuridicalContactPanel().setTitle(title);
            this.getAddAction().show();
            this.getSaveAction().hide();
            this.getAddJuridicalForm().getForm().setValues(this.oDlg.params.params);
        }
        else
        {
            if(this.oDlg.params.params.data.type == 'edit')
            {
                title = this.getAddJuridicalForm().messages.edit_juridical_contact_title;
                this.getJuridicalContactPanel().setTitle(title);
                this.getAddAction().hide();
                this.getSaveAction().show();
                this.getAddJuridicalForm().getForm().setValues(this.oDlg.params.params.data);
            }
        }
    },

    onclickResetJuridicalContacts: function(){
        this.getAddJuridicalForm().getForm().reset();
        this.oDlg.close();
    }
});
