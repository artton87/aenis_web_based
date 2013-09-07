Ext.define('Aenis.controller.main.country.region.SelectDlg', {
	extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.country.region.SelectDlg'
    ],

    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @return {Aenis.view.main.country.region.SelectDlg}
     */
    showDialog: function(/* params */) {
        this.oDlg = this.createMainView();
        this.oDlg.addEvents(
            /**
             * @event itemSelected
             * Fired when user selects a region and presses OK button.
             * Return FALSE from event handler to prevent dialog from closing.
             * @param {Aenis.model.main.country.Region} model    Selected item
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
            '[ref=regionsGrid]': {
                specialkey: this.onSpecialKey,
                selectionchange: this.onSelectionChangeRegionsGrid,
                beforerender: this.onBeforeRenderRegionsGrid
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
        return this.oDlg;
    },

    onSpecialKey: function(field, event) {
    	if(event.getKey() == event.ENTER) {
            this.onAccept();
    	}
    },

    onAccept: function() {
        var oGrid = this.getRegionsGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            this.oDlg.returnValue = selection[0];
            this.oDlg.close();
        }
    },

    onBeforeRenderRegionsGrid: function(oGrid) {
        oGrid.loadStore({params:{default_language_only:1}});
    },

    onSelectionChangeRegionsGrid: function(model, selected) {
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
