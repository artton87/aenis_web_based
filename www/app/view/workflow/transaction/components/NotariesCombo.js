Ext.require([
    'Aenis.store.main.user.Notaries'
]);

Ext.define('Aenis.view.workflow.transaction.components.NotariesCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.workflowTransactionNotariesCombo',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.transaction.components.NotariesCombo',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.apply(this, {
            fieldLabel: this.T('notary'),
            labelAlign: 'right',
            labelWidth: 65,
            width: 300,
            store: Ext.create('Aenis.store.main.user.Notaries'),
            queryMode: 'local',
            editable: false,
            valueField: 'id',
            displayField: 'user_full_name',
            forceSelection: true,
            allowBlank: false
        });
        this.on('afterrender', this.onAfterRender, this, {single:true});
        this.callParent(arguments);
    },

    onAfterRender: function() {
        var oStore = this.getStore();
        oStore.load({
            scope: this,
            callback: function(records, operation, success) {
                if(success)
                {
                    this.reset();
                }
                this.validate();
            }
        });
    },

    reset: function() {
        var oStore = this.getStore();
        var c = oStore.getTotalCount();
        if(c>0)
        {
            this.select(oStore.getAt(0));
            if(c==1)
                this.setReadOnly(true);
        }
        if(c>1)
            this.show();
    }
});
