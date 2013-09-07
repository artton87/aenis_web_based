Ext.define('Aenis.controller.workflow.template.SelectDlg', {
	extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.workflow.template.SelectDlg'
    ],

    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @param {Object} params    {String|Number} documentType - either document type id or code
     *                           {Number} transactionTypeId - transaction type id
     * @return {Aenis.view.workflow.template.SelectDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();
        this.oDlg.addEvents(
            /**
             * @event itemSelected
             * Fired when user selects a template and presses OK button.
             * Return FALSE from event handler to prevent dialog from closing.
             * @param {Aenis.model.workflow.Template} model    Selected item
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
        this.oDlg.control({
            '[ref=templatesGrid]': {
                specialkey: this.onSpecialKey,
                selectionchange: this.onSelectionChangeTemplatesGrid
            },
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
                }
            }
        }, null, this);

        var storeParams = {};
        if(params)
        {
            var submitParams = {};
            if('documentType' in params)
            {
                if(Ext.isNumeric(params.documentType))
                    submitParams['doc_type_id'] = params.documentType;
                else
                    submitParams['doc_type_code'] = params.documentType;
            }
            if('transactionTypeId' in params)
            {
                submitParams['tr_type_id'] = params.transactionTypeId;
            }

            storeParams['params'] = submitParams;
        }
        this.getTemplatesGrid().loadStore(storeParams);
        this.oDlg.show();
        return this.oDlg;
    },

    onSpecialKey: function(field, event) {
    	if(event.getKey() == event.ENTER) {
            this.onAccept();
    	}
    },

    onAccept: function() {
        var oGrid = this.getTemplatesGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            this.oDlg.returnValue = selection[0];
            this.oDlg.close();
        }
    },

    onSelectionChangeTemplatesGrid: function(model, selected) {
        if(selected.length > 0)
        {
            this.getAcceptAction().enable();
        }
        else
        {
            this.getAcceptAction().disable();
        }
    }
});
