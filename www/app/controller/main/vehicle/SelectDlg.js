Ext.define("Aenis.controller.main.vehicle.SelectDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.vehicle.SelectDlg'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.vehicle.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @return {Aenis.controller.main.vehicle.SelectDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();
        this.oDlg.addEvents(
            /**
             * @event itemSelected
             * Fired when user selects a vehicle and presses OK button.
             * Return FALSE from event handler to prevent dialog from closing.
             * @param {Aenis.model.main.Vehicle} model    Selected item
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
            '[ref=vehiclesGrid]': {
                specialkey: this.onSpecialKey,
                selectionchange: this.onSelectionChangeVehiclesGrid
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
                afterrender:{fn:this.afterVehicleDialog,single:true}
            }
        }, null, this);
        this.oDlg.show();
        return this.oDlg;
    },


    afterVehicleDialog: function(){
        this.params = this.oDlg.params;

        if(this.oDlg.params.mode == 'edit')
        {
            this.getCustomFields().show();
            this.getCustomFields().getForm().setValues(this.oDlg.params.params.objectData);
            this.getAcceptAction().enable();
        }
        else
        {
            this.getAcceptAction().disable();
            this.getCustomFields().hide();
        }



    },

    onTextFieldSpecialKey: function(field, event) {
        if(event.getKey() == event.ENTER) {
            this.onSearchBtn();
        }
    },


    onSpecialKey: function(field, event) {
        if(event.getKey() == event.ENTER) {
            this.onAccept();
        }
    },

    onAccept: function() {
        var oGrid = this.getVehiclesGrid();
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
                var model = Ext.create('Aenis.model.main.Vehicle');
                model.set('id',0);
                model.set('number',values.number);
                model.set('type',values.type);
                model.set('vin',values.vin);
                model.set('color',values.color);
                model.set('model',values.model);
                model.set('model_year',values.model_year);
                model.set('data',{
                    "number": values.number,
                    "type":values.type,
                    "model": values.model,
                    "model_year":values.model_year,
                    "vin":values.vin
                });
                this.oDlg.returnValue = model;
                this.oDlg.close();
            }
        }
    },

    onSelectionChangeVehiclesGrid: function(model, selected) {
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
            values.mode = this.params.mode;

            if(values.number == '' && values.vin == '')
            {
                Ext.Msg.show({
                    title: this.application.title,
                    msg: this.T("enter_search_criteria"),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });
                return;
            }

            console.log(values);
            var me = this;
            this.getVehiclesGrid().loadStore({
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

