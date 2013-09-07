Ext.define("Aenis.controller.main.stock.SelectDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.stock.SelectDlg'
    ],


    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @return {Aenis.controller.main.stock.SelectDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();
        this.oDlg.addEvents(
            /**
             * @event itemSelected
             * Fired when user selects a stock and presses OK button.
             * Return FALSE from event handler to prevent dialog from closing.
             * @param {Aenis.model.main.Stock} model    Selected item
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
            '[ref=stockGrid]': {
                specialkey: this.onSpecialKey,
                selectionchange: this.onSelectionChangeStocksGrid
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
        var oGrid = this.getStockGrid();
        var selection = oGrid.getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            this.oDlg.returnValue = {
                id: selection[0].get('id'),
                name: selection[0].get('number')+' '+selection[0].get('type')+' '+selection[0].get('model_desc'),
                data: {
                    "number":selection[0].get('number'),
                    "type":selection[0].get('type'),
                    "model_desc":selection[0].get('model_desc')
                },
                type:'stock'
            };
            this.oDlg.close();
        }
    },

    onSelectionChangeStocksGrid: function(model, selected) {
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
        var values = form.getValues();
       this.getStockGrid().loadStore({params: values});
    }
});

