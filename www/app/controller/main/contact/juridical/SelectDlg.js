Ext.define("Aenis.controller.main.contact.juridical.SelectDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.contact.juridical.SelectDlg'
    ],

    mixins: [
        'Aenis.controller.main.contact.juridical.mixin.Search'
    ],


    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @returns {Aenis.controller.main.contact.juridical.SelectDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();
        this.oDlg.addEvents(
            /**
             * @event itemSelected
             * Fired when user selects a juridical contact and presses OK button.
             * Return FALSE from event handler to prevent dialog from closing.
             * @param {Aenis.model.main.contact.Juridical} model    Selected item
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
            '[ref=juridicalContactsGrid]': {
                specialkey: this.onSpecialKey,
                selectionchange: this.onSelectionChangeJuridicalContactsGrid
            },
            '[ref=acceptAction]': {
                click: this.onAccept
            },
            '[action=cancel]': {
                click: {fn: this.oDlg.close, scope: this.oDlg}
            },
            '[action=searchContact]': {
                click: {fn: this.onSearchBtn, buffer:BestSoft.eventDelay}
            },
            '[ref=addAction]': {
                click: this.onclickAddContactBtn
            },
            '[ref=editAction]': {
                click: this.onclickEditContactBtn
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
                afterrender:{fn:this.afterRenderJuridicalContactDialog, single:true}
            }
        }, null, this);
        this.oDlg.show();
        return this.oDlg;
    },

    afterRenderJuridicalContactDialog: function(){
        if('search' == this.oDlg.params.mode)
        {
            this.getAddAction().hide();
            this.getEditAction().hide();
            this.getSearchPlaces().hide();
        }
    },

    onSelectionChangeJuridicalContactsGrid: function(model, selected) {
        this.getAcceptAction().disable();
        this.getEditAction().disable();
        if(selected.length > 0)
        {
            if(selected[0].data.contact_id)
            {
                this.getEditAction().enable();
            }
            this.getAcceptAction().enable();
        }
    },

    onAccept: function() {
        var selection = this.getJuridicalContactsGrid().getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            selection[0].data.contactType = 'juridical';
            this.oDlg.returnValue = selection[0];
        }
        this.oDlg.close();
    },

    onclickAddContactBtn: function() {
        var values = this.getJuridicalSearchForm().getForm().getValues();
        values.type="add";
        var oController = this.application.loadController('main.contact.juridical.AddEditDlg');
        oController.showDialog({params:values}).on({
            itemSelected: function(model) {
                this.oDlg.returnValue = model;
                this.oDlg.close();
            },
            scope: this
        });
    },


    onclickEditContactBtn: function() {
        var selection = this.getJuridicalContactsGrid().getSelectionModel().getSelection()[0];
        if(selection)
        {
            selection.data.type="edit";
            selection.data.contact_type = 2;
            var me = this;
            var oController = this.application.loadController('main.contact.juridical.AddEditDlg');
            oController.showDialog({params:selection}).on({
                itemSelected: function(/*ev*/) {
                    me.getJuridicalContactsGrid().getStore().reload();
                },
                scope: this
            });
        }
    }
});
