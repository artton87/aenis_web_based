Ext.define("Aenis.controller.main.other.SelectDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.other.SelectDlg'
    ],


    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @param {Object} params    An object with the following keys:
     *                           {String} mode    Optional. Pass 'edit' for editing mode, do not pass otherwise
     *                           {Object} data    Optional. If mode='edit', pass form data for editing mode
     * @return {Aenis.controller.main.other.SelectDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();
        this.oDlg.addEvents(
            /**
             * @event itemSelected
             * Fired when user types in some text and presses OK button.
             * Return FALSE from event handler to prevent dialog from closing.
             * @param {Object} data    An object with form data
             */
            'itemSelected',

            /**
             * @event cancelled
             * Fired when user closes the dialog without selecting an item
             */
            'cancelled'
        );
        this.oDlg.params = params || {};
        this.addComponentRefs(this.oDlg);
        this.oDlg.returnValue = null;
        this.oDlg.control({
            '[ref=acceptAction]': {
                click: this.onAccept
            },
            '[action=cancel]': {
                click: {fn: this.oDlg.close, scope: this.oDlg}
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
                afterrender:{fn:this.afterOtherDialog,single:true}
            }
        }, null, this);
        this.oDlg.show();
        return this.oDlg;
    },


    afterOtherDialog: function(){
        if(this.oDlg.params.mode == 'edit')
        {
            this.getOtherForm().getForm().setValues(this.oDlg.params.data);
        }
    },


    onSpecialKey: function(field, event) {
        if(event.getKey() == event.ENTER) {
            this.onAccept();
        }
    },

    onAccept: function() {
        var oForm = this.getOtherForm().getForm();
        if(oForm.isValid())
        {
            this.oDlg.returnValue = oForm.getValues();
            this.oDlg.close();
        }
    }
});

