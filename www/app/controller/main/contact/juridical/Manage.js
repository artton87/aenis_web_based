
Ext.define("Aenis.controller.main.contact.juridical.Manage", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.contact.juridical.Manage'
    ],
    mixins: [
        'Locale.hy_AM.Common',
        'BestSoft.mixin.Localized',
        'Aenis.controller.main.contact.juridical.mixin.Search'
    ],

    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.control({
                'textfield': {
                    specialkey: this.onTextFieldSpecialKey
                },
                '[ref=juridicalContactsGrid]': {
                    specialkey: this.onSpecialKey,
                    selectionchange: this.onSelectionChangeJuridicalContactsGrid
                },
                '[action=searchContact]': {
                    click: {fn: this.onSearchBtn, buffer:BestSoft.eventDelay}
                },
                '[ref=addAction]': {
                    click: this.onclickAddContactBtn
                },
                '[ref=editAction]': {
                    click: this.onclickEditContactBtn
                }
            }, null, this);
        });
    },


    onclickAddContactBtn: function() {
        var values = this.getJuridicalSearchForm().getForm().getValues();
        values.type="add";
        var me = this;
        var oController = this.application.loadController('main.contact.juridical.AddEditDlg');
        oController.showDialog({params:values}).on({
            itemSelected: function(model) {
                me.getJuridicalContactsGrid().getStore().add(model);
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
                itemSelected: function() {
                    me.getJuridicalContactsGrid().getStore().reload();
                },
                scope: this
            });
        }
    },


    onSelectionChangeJuridicalContactsGrid: function(model, selected) {
        this.getEditAction().disable();
        if(selected.length > 0)
        {
            this.getViewForm().getForm().loadRecord(selected[0]);
            if(selected[0].data.contact_id != 0)
            {
                this.getEditAction().enable();
            }
        }
    }
});
