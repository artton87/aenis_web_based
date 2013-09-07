Ext.define('Aenis.controller.main.role.SelectDlg', {
	extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.role.SelectDlg'
    ],


    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @returns {Aenis.view.main.role.SelectDlg}
     */
    showDialog: function(/* params */) {
        this.oDlg = this.createMainView();
        this.oDlg.addEvents(
            /**
             * @event itemSelected
             * Fired when user selects a role and presses OK button.
             * Return FALSE from event handler to prevent dialog from closing.
             * @param {Aenis.model.main.Role} model    Selected item
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
            '[ref=itemsGrid]': {
                specialkey: this.onSpecialKey,
                selectionchange: this.onSelectionChangeItemsTree
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
        this.oDlg.show();
        this.getItemsGrid().loadStore();
        return this.oDlg;
    },

    onSpecialKey: function(field, event) {
    	if(event.getKey() == event.ENTER) {
            this.onAccept();
    	}
    },

    onAccept: function() {
        var oGrid = this.getItemsGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            this.oDlg.returnValue = selection[0];
            this.oDlg.close();
        }
    },

    onSelectionChangeItemsTree: function(model, selected) {
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
