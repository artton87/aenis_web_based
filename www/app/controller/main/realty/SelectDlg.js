Ext.define("Aenis.controller.main.realty.SelectDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.realty.SelectDlg'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.realty.SelectDlg',
        'BestSoft.mixin.Localized'
    ],


    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @return {Aenis.controller.main.realty.SelectDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();
        this.oDlg.addEvents(
            /**
             * @event itemSelected
             * Fired when user selects a realty and presses OK button.
             * Return FALSE from event handler to prevent dialog from closing.
             * @param {Aenis.model.main.Realty} model    Selected item
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
            '[ref=realtyGrid]': {
                specialkey: this.onSpecialKey,
                selectionchange: this.onSelectionChangeRealtyGrid
            },
            '[ref=acceptAction]': {
                click: this.onAccept
            },
            '[action=cancel]': {
                click: {fn: this.oDlg.close, scope: this.oDlg}
            },
            '[action=search]': {
                click: {fn: this.onSearchBtn, buffer:BestSoft.eventDelay}
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
                afterrender:{fn:this.afterRealtyDialog,single:true}
            }
        }, null, this);
        this.oDlg.show();
        return this.oDlg;
    },

    afterRealtyDialog: function(){
        this.getAcceptAction().disable();
        this.getCustomFields().hide();
    },


    onSpecialKey: function(field, event) {
        if(event.getKey() == event.ENTER) {
            this.onAccept();
        }
    },


    onTextFieldSpecialKey: function(field, event) {
        if(event.getKey() == event.ENTER) {
            this.onSearchBtn();
        }
    },

    onAccept: function() {
        var oGrid = this.getRealtyGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            this.oDlg.returnValue = selection[0];
            this.oDlg.close();
        }
        else
        {
            var oForm = this.getCustomFields().getForm();
            if(this.getCustomFields().isVisible() && oForm.isValid())
            {
                var values = oForm.getValues();
                var model = Ext.create('Aenis.model.main.Realty');
                model.set('id',0);
                model.set('address',values.address);
                model.set('given_date',values.given_date);
                model.set('certificate_number',values.certificate_number);
                model.set('building_total_area',values.building_total_area);
                model.set('building_type',values.building_type);
                model.set('parcel_total_area',values.parcel_total_area);
                model.set('description',values.description);
                model.set('data',{
                    "address": values.address,
                    "certificate_number":values.certificate_number,
                    "building_total_area": values.building_total_area,
                    "parcel_total_area":values.parcel_total_area,
                    "description":values.description
                });
                this.oDlg.returnValue = model;
                console.log(model);
                this.oDlg.close();
            }
        }
    },

    onSelectionChangeRealtyGrid: function(model, selected) {
        if(selected.length > 0)
        {
            this.getAcceptAction().enable();
        }
        else
        {
            this.getAcceptAction().disable();
        }
    },

    onSearchBtn:function() {
        var form = this.getSearchForm().getForm();

        if(form.isValid())
        {
            var values = form.getValues();
            if(values.certificate_number == '')
            {
                Ext.Msg.show({
                    title: this.application.title,
                    msg: this.T("enter_certificate_number"),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });
                return;
            }
            var me = this;
            this.getRealtyGrid().loadStore({
                scope: this,
                params:values,
                callback: function(records/*, operation, success*/) {
                    if(records.length == 0)
                    {
                        me.getCustomFields().show();
                        me.getAcceptAction().enable();
                    }
                    else
                    {
                        me.getCustomFields().hide();
                        me.getAcceptAction().disable();
                    }
                }
            });
        }
    }
});

