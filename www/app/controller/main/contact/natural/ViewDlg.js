Ext.define("Aenis.controller.main.contact.natural.ViewDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.contact.natural.ViewDlg'
    ],


    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @param {Object} params    {Aenis.model.main.contact.Natural} model
     * @return {Aenis.view.main.contact.Natural}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();

        this.addComponentRefs(this.oDlg);
        this.oDlg.params = params || {};
        this.oDlg.control({

            '[action=cancel]': {
                click:this.onclickCloseBtn
            },
            '.': {
                beforeclose: function() {
                    delete this.oDlg;
                    return true;
                },
                afterrender:{fn:this.afterRenderNaturalContactViewDialog,single:true}
            }
        }, null, this);
        this.oDlg.show();
        return this.oDlg;
    },

    afterRenderNaturalContactViewDialog: function(){
        var me = this;
        var subjectModel = this.oDlg.params.subjectModel;

        var modelName = 'Aenis.model.main.contact.Natural';
        var model = Ext.create(modelName, {contact_id: subjectModel.get('contactId')});

        var docStore = subjectModel.documents();
        console.log(docStore);
        docStore.load();

        model.reload({
                params:{
                    storage:'from_db',
                    init:1
                }
            },
            function(record, operation/*, success*/) {
                if(operation.wasSuccessful())
                {
                    var oForm = me.getDataContent();
                    oForm.down('[name=first_name]').setValue(record.get('first_name'));
                    oForm.down('[name=last_name]').setValue(record.get('last_name'));
                    oForm.down('[name=second_name]').setValue(record.get('second_name'));
                    oForm.down('[name=date_of_birth]').setValue(record.get('date_of_birth'));
                    oForm.down('[name=passport_number]').setValue(record.get('passport_number'));
                    oForm.down('[name=fax]').setValue(record.get('fax'));
                    oForm.down('[name=phone_home]').setValue(record.get('phone_home'));
                    oForm.down('[name=phone_office]').setValue(record.get('phone_office'));
                    oForm.down('[name=given_date]').setValue(record.get('given_date'));
                    oForm.down('[name=phone_office]').setValue(record.get('phone_office'));
                    oForm.down('[name=authority]').setValue(record.get('authority'));
                    oForm.down('[name=country_label]').setValue(record.get('country_label'));

                    docStore.each(function(a){
                        console.log(a);
                    });
                }
            });
    },

    onclickCloseBtn: function() {
        this.oDlg.close();
    }
});


