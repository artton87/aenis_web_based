
Ext.define("Aenis.controller.main.contact.natural.Manage", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.contact.natural.Manage'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'BestSoft.mixin.Localized',
        'Aenis.controller.main.contact.natural.mixin.Search'
    ],

    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.control({
                'textfield': {
                    specialkey: this.onTextFieldSpecialKey
                },
                '[ref=naturalContactsGrid]': {
                    specialkey: this.onSpecialKey,
                    selectionchange: this.onSelectionChangeNaturalContactsGrid
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
        var values = this.getNaturalSearchForm().getForm().getValues();
        values.type="add";
        var me = this;
        var oController = this.application.loadController('main.contact.natural.AddEditDlg');
        oController.showDialog({params:values}).on({
            itemSelected: function(model) {
                me.getNaturalContactsGrid().getStore().add(model);
            },
            scope: this
        });
    },

    onclickEditContactBtn: function() {
        var selection = this.getNaturalContactsGrid().getSelectionModel().getSelection()[0];
        if(selection)
        {
            selection.data.type="edit";
            selection.data.contact_type = 1;

            var me = this;
            var oController = this.application.loadController('main.contact.natural.AddEditDlg');
            oController.showDialog({params:selection}).on({
                itemSelected: function() {
                    me.getNaturalContactsGrid().getStore().reload();
                },
                scope: this
            });
        }
    },

    onSelectionChangeNaturalContactsGrid: function(model, selected) {
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
