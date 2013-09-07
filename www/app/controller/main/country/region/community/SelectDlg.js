Ext.define('Aenis.controller.main.country.region.community.SelectDlg', {
	extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.country.region.community.SelectDlg'
    ],

    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @return {Aenis.view.main.country.region.community.SelectDlg}
     */
    showDialog: function(params) {
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
        this.oDlg.params = params || {};
        this.oDlg.control({
            '[ref=communitiesGrid]': {
                specialkey: this.onSpecialKey,
                selectionchange: this.onSelectionChangeCommunitiesGrid,
                beforerender: this.onBeforeRenderCommunitiesGrid
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
                },
                afterrender: this.onAfterRenderCommunitiesAction
            }
        }, null, this);
        this.oDlg.show();
        return this.oDlg;
    },

    onAfterRenderCommunitiesAction: function(){
       // var regionId = this.oDlg.params.regionId;
        console.log();
    },


    onSpecialKey: function(field, event) {
    	if(event.getKey() == event.ENTER) {
            this.onAccept();
    	}
    },

    onAccept: function() {
        var oGrid = this.getCommunitiesGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            this.oDlg.returnValue = selection[0];
            this.oDlg.close();
        }
    },

    onBeforeRenderCommunitiesGrid: function(oGrid) {

        var regionId = this.oDlg.params.regionId;
        oGrid.loadStore({params:
            {
                default_language_only:1,
                region_id: regionId
            }
        });
    },

    onSelectionChangeCommunitiesGrid: function(model, selected) {
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
