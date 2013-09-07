Ext.define('Aenis.controller.workflow.object.type.SelectDlg', {
	extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.workflow.object.type.SelectDlg',
        'Aenis.store.workflow.object.Types'
    ],

    showDialog: function(/* params */) {
        this.oDlg = this.createMainView();
        this.oDlg.addEvents(
            /**
             * @event itemSelected
             * Fired when user selects object type and presses OK button.
             * Return FALSE from event handler to prevent dialog from closing.
             * @param {Aenis.model.workflow.object.Type} model    Selected item
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
            '[ref=itemsTree]': {
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
                afterrender: this.onAfterRenderView,
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
        var oTree = this.getItemsTree();
        var selection = oTree.getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            this.oDlg.returnValue = {
                id: selection[0].data.id,
                name: selection[0].data.label
            };
            this.oDlg.close();
        }
    },

    onAfterRenderView: function() {
        var oTree = this.getItemsTree();
        this.getItemsTreeFilterField().setTreeComponent(oTree);
        oTree.loadStore({params:{visible_only:1}});
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